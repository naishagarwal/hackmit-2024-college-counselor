from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os

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
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer  # Import for encoding text

# Database connection parameters
namespace = "USER"
port = os.getenv("DATABASE_PORT", "1972")
hostname = os.getenv("DATABASE_HOST", "localhost")
connection_string = f"{hostname}:{port}/{namespace}"
username = "demo"
password = "demo"

# First Endpoint: Upload and process CSV file
@app.route('/upload_csv', methods=['POST'])
def upload_csv():
    # Get the file from the request
    #print("got here")
    print("Headers:", request.headers)
    print("Form Data:", request.form)
    print("Files:", request.files)
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        # Read the CSV file into a DataFrame
        df = pd.read_csv(file)

        # Check if required columns exist
        required_columns = ['Name','College', 'Major', 'High_School', 'High_School_Location','Extracurriculars', 'Volunteering','Awards']
        if not all(col in df.columns for col in required_columns):
            return jsonify({'error': 'Missing required columns in CSV'}), 400

        # Concatenate the specified columns into one column
        df['combined_text'] = df['Extracurriculars'].astype(str) + ' ' + df['Volunteering'].astype(str) + ' ' + df['Awards'].astype(str)

        # Encode the combined_text column into vectors
        model = SentenceTransformer('all-MiniLM-L6-v2')  # You can choose any suitable model
        vectors = model.encode(df['combined_text'].tolist())
        df['vector'] = vectors.tolist()

        df['vector'] = df['vector'].apply(lambda x: json.dumps(x))
        print(df.head())

        # Connect to the database
        conn = iris.connect(connection_string, username, password)
        cursor = conn.cursor()

        # Define the table name and structure
        tableName = "User_Profiles"
        vector_dimension = len(df['vector'].iloc[0])  # Get the dimension of the vector
        #tableDefinition = "(Name VARCHAR(255), College VARCHAR(255), Major VARCHAR(255), HSL VARCHAR(255), EXTRAC VARCHAR(255), Volun VARCHAR(255), Awards VARCHAR(255), unn VARCHAR(255))"
        tableDefinition = """
            (Name VARCHAR(255) PRIMARY KEY, 
            College VARCHAR(255), 
            Major VARCHAR(255), 
            High_School VARCHAR(255), 
            High_School_Location VARCHAR(255), 
            combined_text VARCHAR(1000), 
            vector TEXT)"""


        # Drop the table if it exists
        cursor.execute(f"DROP TABLE IF EXISTS {tableName}")
        print("got here sdf")

        # Create the table
        cursor.execute(f"CREATE TABLE {tableName} {tableDefinition}")
        print("sdfsdf")

        # Prepare the SQL insert statement
        sql = """
            INSERT INTO User_Profiles 
            (Name, College, Major, High_School, High_School_Location, combined_text, vector) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """

        #sql = f"INSERT INTO {tableName} (Name, College, Major, High School, High School Location, combined_text, vector) VALUES (?, ?, ?, ?, ?, ?, ?)"

        # Insert data into the table
        # data_to_insert = []
        # for index, row in df.iterrows():
        #     data_to_insert.append((row['Name'], row['College'], row['Major'], row['High_School'], row['High_School_Location'], row['combined_text'], row['vector']))

        # Use executemany for efficient bulk insertion
        for index, row in df.iterrows():
            cursor.execute(sql, [row.Name,row.College,row.Major,row.High_School, row.High_School_Location, row.combined_text, row.vector])
        # for row in data_to_insert:
        #     cursor.execute(sql, list(row))
        #cursor.executemany(sql, data_to_insert)
        print("sdsdfd")

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
        tableName = "Demo.IdVectors"

        # Prepare the SQL query
        sql = f"""
        SELECT TOP ? id, combined_text
        FROM {tableName}
        ORDER BY VECTOR_DOT_PRODUCT(vector, TO_VECTOR(?)) DESC
        """

        # Execute the SQL query
        cursor.execute(sql, [number_of_results, query_vector_str])
        fetched_data = cursor.fetchall()

        # Prepare the response
        response = []
        for row in fetched_data:
            response.append({
                'id': row[0],
                'combined_text': row[1]
            })

        # Close the connection
        cursor.close()
        conn.commit()
        conn.close()

        return jsonify({'results': response}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5010)
