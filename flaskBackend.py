from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import openai
from fuzzywuzzy import process, fuzz

openai.api_key = 'sk-R9MxTx6I0ZOEGTQNe1KGbUmmdx73ilYAFCANkC3zudT3BlbkFJFUbh-GeIlPG9glu7kzHGh1bg82cva5mJ6zAuSeGX4A'

app = Flask(__name__)
#CORS(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

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
        required_columns = ['Name', 'College', 'Major', 'High_School', 'High_School_Location', 'Extracurriculars', 'Volunteering', 'Awards', 'Email']
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
            Email VARCHAR(255),
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
            (Name, College, Major, High_School, High_School_Location, Email, combined_text, combined_text_vector) 
            VALUES (?, ?, ?, ?, ?, ?, ?, TO_VECTOR(?))
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
                row['Email'],
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

def get_best_match(value, choices):
    """Get the best match for `value` from a list of `choices` using fuzzy matching."""
    best_match, best_score = process.extractOne(value, choices, scorer=fuzz.partial_ratio)
    return best_match if best_score > 70 else None

@app.route('/query_similarity', methods=['POST'])
def query_similarity():
    try:
        # Get the user query and filters from the request
        user_query = request.json.get('query')
        college_filter = request.json.get('college') 
        major_filter = request.json.get('major') 
        user_name = request.json.get('name')
        high_school_location_filter = request.json.get('high_school_location')  # Get high school location filter
        
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

        # Build the base SQL query
        sql = f"""
        SELECT TOP ? Name, College, High_School_Location, Major, combined_text, Email
        FROM {tableName}
        WHERE 1=1
        """

        # Add filters if provided
        params = [number_of_results]  # Initialize parameters with number of results
        if college_filter:
            sql += " AND College = ?"
            params.append(college_filter)
        if major_filter:
            sql += " AND Major = ?"
            params.append(major_filter)

        # Add similarity ordering
        sql += " ORDER BY VECTOR_DOT_PRODUCT(combined_text_vector, TO_VECTOR(?)) DESC"
        params.append(query_vector_str)  # Add query vector to parameters

        # Execute the SQL query
        cursor.execute(sql, params)
        fetched_data = cursor.fetchall()

        if high_school_location_filter:
            city, state = None, None

            parts = high_school_location_filter.split(' ', 1)
            print(parts)
            if len(parts) == 2:
                city, state = parts
                print(city, state)

            else:
                city = parts[0]  # Handle cases with only one part
                print(city)

            scored_results = []
            for row in fetched_data:
                row_location = row[2].split(' ')
                row_city = row_location[0] if len(row_location) > 0 else ''
                row_state = row_location[1] if len(row_location) > 1 else ''
                
                score = 0
                if city and get_best_match(city, [row_city]):
                    score += 50
                if state and get_best_match(state, [row_state]):
                    score += 50
                
                scored_results.append((*row, score))  # Append score to the row
            
            # Sort by score, descending
            scored_results.sort(key=lambda x: x[-1], reverse=True)

            # Keep the top results based on location score
            fetched_data = scored_results[:number_of_results]


        # Prepare the response
        response = []
        for row in fetched_data:
            response.append({
                'Name': row[0],
                'College': row[1],
                'High_School_Location': row[2],
                'Major': row[3],
                'combined_text': row[4],
                'Email': row[5]  
            })

        # Close the connection
        cursor.close()
        conn.close()

        return jsonify({'results': response}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/generate_college_plan', methods=['POST'])
def generate_college_plan():
    try:
        # Get the user query from the request
        user_query = request.json.get('query')
        user_name = request.json.get('name')
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
        {user_name} has the following query: '{user_query}'.
        Based on the following similar profiles:
        {combined_sentences}
        Provide a personalized college plan for the student. Make your response as specific as possible to the student data provided, giving examples. The response should be addressed to the student. Make this as short and succint as possible.
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
