import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';


export const fetchJobs = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/jobs`);
        console.log(response.data)
        return response.data;

    } catch (error) {
        throw error;
    }
};

export const fetchJobById = async (id) => {
    try {
        // In a real app:
        const response = await axios.get(`${API_BASE_URL}/apply/${id}`);
        console.log(response.data)
        return response.data;

    } catch (error) {
        throw error;
    }
};

export const submitApplication = async (job, formData, id) => {
    try {
        const payload = new FormData();

        // Construct simplified job structure
        const simplifiedJob = {
            text: job.description,
            required_skills: job.skills,
            education: job.education
        };

        payload.append('name', formData.name);
        payload.append('job', JSON.stringify(simplifiedJob)); // Send as JSON string
        payload.append('resume', formData.resume);

        const response = await axios.post(
            `${API_BASE_URL}/apply/${id}`,
            payload,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: progressEvent => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log(`Upload progress: ${progress}%`);
                }
            }
        );
        console.log(response)

        return response;

    } catch (error) {
        const errorMessage = error.response?.data?.message ||
            error.message ||
            'Failed to submit application';
        throw new Error(errorMessage);
    }
};


export const fetchTeamMeambers = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/about`);
        console.log(response.data)
        return response.data;

    } catch (error) {
        throw error;
    }
};