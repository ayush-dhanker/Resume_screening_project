import json


def load_data():
    with open('Data/jobs.json', 'r') as f:
        data = json.load(f)
        return data
