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
port = 1972
hostname = os.getenv('IRIS_HOSTNAME', 'localhost')
connection_string = f"{hostname}:{port}/{namespace}"
username = "demo"
password = "demo"
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
        required_columns = ['Name', 'College', 'Major', 'High School', 'High School Location', 'Extracurriculars', 'Volunteering', 'Awards']
        if not all(col in df.columns for col in required_columns):
            return jsonify({'error': 'Missing required columns in CSV'}), 400

        # Connect to the database
        conn = iris.connect(connection_string, username, password)
        cursor = conn.cursor()

        # Define the table name and structure
        tableName = "Test.Upload"
        tableDefinition = """
            (Name VARCHAR(255), 
            College VARCHAR(255), 
            Major VARCHAR(255), 
            HSL VARCHAR(255), 
            HSL_Location VARCHAR(255), 
            EXTRAC VARCHAR(255), 
            Volun VARCHAR(255), 
            Awards VARCHAR(255))
        """

        # Drop the table if it exists
        try:
            cursor.execute(f"DROP TABLE {tableName}")
        except Exception as e:
            print(f"Warning: Could not drop table. Error: {e}")

        # Create the table
        cursor.execute(f"CREATE TABLE {tableName} {tableDefinition}")

        # Prepare the SQL insert statement
        sql = """
            INSERT INTO Test.Upload 
            (Name, College, Major, HSL, HSL_Location, EXTRAC, Volun, Awards) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """

        # Insert data into the table
        start_time = time.time()
        for index, row in df.iterrows():
            cursor.execute(sql, [
                row['Name'], 
                row['College'], 
                row['Major'], 
                row['High School'], 
                row['High School Location'], 
                row['Extracurriculars'], 
                row['Volunteering'], 
                row['Awards']
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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5010)


# # Second Endpoint: User query and similarity search
# @app.route('/query_similarity', methods=['POST'])
# def query_similarity():
#     try:
#         # Get the user query from the request
#         user_query = request.json.get('query')
#         if not user_query:
#             return jsonify({'error': 'No query provided'}), 400

#         number_of_results = request.json.get('numberOfResults', 10)

#         # Encode the query into a vector with normalization
#         query_vector = model.encode(user_query, normalize_embeddings=True).tolist()

#         # Convert the vector to a string representation suitable for TO_VECTOR
#         query_vector_str = str(query_vector)

#         # Connect to the database
#         conn = iris.connect(connection_string, username, password)
#         cursor = conn.cursor()

#         # Define the table name
#         tableName = "Demo.IdVectors"

#         # Prepare the SQL query
#         sql = f"""
#         SELECT TOP ? id, combined_text
#         FROM {tableName}
#         ORDER BY VECTOR_DOT_PRODUCT(vector, TO_VECTOR(?)) DESC
#         """

#         # Execute the SQL query
#         cursor.execute(sql, [number_of_results, query_vector_str])
#         fetched_data = cursor.fetchall()

#         # Prepare the response
#         response = []
#         for row in fetched_data:
#             response.append({
#                 'id': row[0],
#                 'combined_text': row[1]
#             })

#         # Close the connection
#         cursor.close()
#         conn.commit()
#         conn.close()

#         return jsonify({'results': response}), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5010)
