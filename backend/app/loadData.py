import json


def load_data():
    with open('Data/jobs.json', 'r') as f:
        data = json.load(f)
        return data


def job_by_id(data, job_id):

    # Search through all jobs
    for job in data.get('jobs', []):
        if job.get('id') == job_id:
            return job

    return None
