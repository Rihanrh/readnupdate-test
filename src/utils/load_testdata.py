import json
import os

def load_json_testcases(program_name):
    """
    Load test cases from a JSON file for a given program.
    
    Args:
        program_name (str): Name of the program to load test cases for
        
    Returns:
        list: List of test cases loaded from the JSON file
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)  # src directory
    json_path = os.path.join(project_root, 'json_testcases', f'{program_name}.json')
    
    with open(json_path, 'r') as f:
        return json.load(f)