from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import openai
openai.api_key = 'sk-R9MxTx6I0ZOEGTQNe1KGbUmmdx73ilYAFCANkC3zudT3BlbkFJFUbh-GeIlPG9glu7kzHGh1bg82cva5mJ6zAuSeGX4A'

app = Flask(__name__)
CORS(app)

#@app.route('/')
# def homepage():
#     return render_template('index.html') 

####################################################################################################
## CONNECTING TO THE IRIS DATABASE

import iris
import json
import time
import requests
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer  # Import for encoding text
import pickle
# Database connection parameters
namespace = "USER"
port = 1972
hostname = os.getenv('IRIS_HOSTNAME', 'localhost')
connection_string = f"{hostname}:{port}/{namespace}"
username = "demo"
password = "demo"

model = SentenceTransformer('all-MiniLM-L6-v2') 

@app.route('/upload_csv', methods=['POST'])
def upload_csv():
    # Ensure a file is uploaded
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        # Read the CSV file into a DataFrame
        df = pd.read_csv(file)

        # Check if required columns exist
        required_columns = ['Name', 'College', 'Major', 'High_School', 'High_School_Location', 'Extracurriculars', 'Volunteering', 'Awards']
        if not all(col in df.columns for col in required_columns):
            return jsonify({'error': 'Missing required columns in CSV'}), 400

        # Generate embeddings for the combined text
        df['combined_text'] = df['Extracurriculars'].astype(str) + ' ' + df['Volunteering'].astype(str) + ' ' + df['Awards'].astype(str)
        embeddings = model.encode(df['combined_text'].tolist(), normalize_embeddings=True)

        # Add the embeddings to the DataFrame
        df['combined_text_vector'] = embeddings.tolist()
        vector_dimension = len(df['combined_text_vector'].iloc[0])

        # Connect to the database
        conn = iris.connect(connection_string, username, password)
        cursor = conn.cursor()

        # Define the table name and structure
        tableName = "User_Profiles"
        tableDefinition = f"""
            (Name VARCHAR(255), 
            College VARCHAR(255), 
            Major VARCHAR(255), 
            High_School VARCHAR(255), 
            High_School_Location VARCHAR(255), 
            combined_text VARCHAR(1000), 
            combined_text_vector VECTOR(DOUBLE, {vector_dimension}))
        """

        # Drop the table if it exists
        try:
            cursor.execute(f"DROP TABLE {tableName}")
        except:
            pass

        # Create the table
        cursor.execute(f"CREATE TABLE {tableName} {tableDefinition}")

        # Prepare the SQL insert statement
        sql = f"""
            INSERT INTO {tableName}
            (Name, College, Major, High_School, High_School_Location, combined_text, combined_text_vector) 
            VALUES (?, ?, ?, ?, ?, ?, TO_VECTOR(?))
        """

        # Insert data into the table
        start_time = time.time()
        for index, row in df.iterrows():
            cursor.execute(sql, [
                row['Name'],
                row['College'],
                row['Major'],
                row['High_School'],
                row['High_School_Location'],
                row['combined_text'],
                json.dumps(row['combined_text_vector'])  # Convert vector to JSON string
            ])
        end_time = time.time()
        print(f"time taken to add {len(df)} entries: {end_time - start_time} seconds")

        # Commit the transaction
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': 'CSV data uploaded and stored successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Second Endpoint: User query and similarity search
@app.route('/query_similarity', methods=['POST'])
def query_similarity():
    try:
        # Get the user query from the request
        user_query = request.json.get('query')
        if not user_query:
            return jsonify({'error': 'No query provided'}), 400

        number_of_results = request.json.get('numberOfResults', 10)

        # Encode the query into a vector with normalization
        query_vector = model.encode(user_query, normalize_embeddings=True).tolist()

        # Convert the vector to a string representation suitable for TO_VECTOR
        query_vector_str = str(query_vector)

        # Connect to the database
        conn = iris.connect(connection_string, username, password)
        cursor = conn.cursor()

        # Define the table name
        tableName = "User_Profiles"

        # Prepare the SQL query
        sql = f"""
        SELECT TOP ? Name, combined_text
        FROM {tableName}
        ORDER BY VECTOR_COSINE(combined_text_vector, TO_VECTOR(?)) DESC
        """

        # Execute the SQL query
        cursor.execute(sql, [number_of_results, query_vector_str])
        fetched_data = cursor.fetchall()

        # Prepare the response
        response = []
        for row in fetched_data:
            response.append({
                'Name': row[0],
                'combined_text': row[1]
            })

        # Close the connection
        cursor.close()
        conn.commit()
        conn.close()

        return jsonify({'results': response}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/get_college_plan', methods=['POST'])
def generate_college_plan():
    try:
        # Get the user query from the request
        user_query = request.json.get('query')
        if not user_query:
            return jsonify({'error': 'No query provided'}), 400

        # Fetch similar results (you can reuse the query_similarity logic here)
        similar_profiles_response, status_code = query_similarity()
        print(type(similar_profiles_response)) #Flask Response Object

        if status_code != 200:
            return jsonify({'error': 'Failed to fetch similar profiles'}), status_code

        # Parse the JSON response body (similar_profiles_response is likely a JSON string)
        similar_profiles_data = similar_profiles_response.get_json()
        print(type(similar_profiles_data))
        #print(similar_profiles_data)

        name_combined_text_dict = {profile['Name']: profile['combined_text'] for profile in similar_profiles_data['results']}
        print(name_combined_text_dict)

        combined_sentences = ""
        for name, text in name_combined_text_dict.items():
            sentence = f"Name {name}, Info: {text}. "
            combined_sentences+= sentence
        
        print(combined_sentences)

        # Create the prompt for the LLM
        prompt = f"""
        A student has the following query: '{user_query}'.
        Based on the following similar profiles:
        {combined_sentences}
        Provide a personalized college plan for the student. Make your response as specific as possible to the student data provided, giving examples. The response should be addressed to the student.
        """

        url = "https://api.openai.com/v1/chat/completions"
        api_key = 'sk-R9MxTx6I0ZOEGTQNe1KGbUmmdx73ilYAFCANkC3zudT3BlbkFJFUbh-GeIlPG9glu7kzHGh1bg82cva5mJ6zAuSeGX4A'
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        data = {
            "model": "gpt-4",  # or another model like "gpt-3.5-turbo"
            "messages": [
                {"role": "system", "content": "You are a personal college counselor for high school students."},
                {"role": "user", "content": prompt}
            ]
        }

        response = requests.post(url, headers=headers, json=data)
        response_json = response.json()

        # Extract the generated response from the LLM
        generated_plan = response_json['choices'][0]['message']['content'].strip()


        return jsonify({'personalized_college_plan': generated_plan}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5010)

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5010)
