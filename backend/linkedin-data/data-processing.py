import pandas as pd

def remove_commas_from_column(input_csv, output_csv, column_name):
    try:
        # Read the CSV file into a DataFrame
        df = pd.read_csv(input_csv)

        # Check if the specified column exists
        if column_name not in df.columns:
            print(f"Column '{column_name}' does not exist in the CSV file.")
            return

        # Remove commas from the specified column
        df[column_name] = df[column_name].astype(str).apply(lambda x: x.replace(',', ''))

        # Save the modified DataFrame to a new CSV file
        df.to_csv(output_csv, index=False)
        print(f"Successfully removed commas from the column '{column_name}' and saved to '{output_csv}'.")

    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage
input_csv = 'chatgpt-50-diversified.csv'   # Replace with your input file path
output_csv = 'output_file.csv' # Replace with your output file path
column_name = 'High School Location'    # Replace with the column name you want to modify

remove_commas_from_column(input_csv, input_csv, column_name)
