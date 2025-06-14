from fastapi import FastAPI
from loadData import load_data

app = FastAPI()

data = load_data()


@app.get('/')
def hello():
    return {'message': "hello"}


@app.get('/jobs')
def listed_jobs():
    return data


# @app.post('/jobs/{id}')
# def resume_performance():
