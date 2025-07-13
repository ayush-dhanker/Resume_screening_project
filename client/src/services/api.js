import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';


// Mock data for demonstration
// const mockJobs = [
//     {
//         id: '1',
//         title: 'Frontend Developer',
//         company: 'Tech Corp',
//         location: 'Remote',
//         salary: '$80,000 - $100,000',
//         description: 'We are looking for a skilled frontend developer...'
//     },
//     {
//         id: '2',
//         title: 'Backend Engineer',
//         company: 'Data Systems',
//         location: 'New York, NY',
//         salary: '$90,000 - $120,000',
//         description: 'Join our backend team to build scalable APIs...'
//     },
//     {
//         id: '3',
//         title: 'UX Designer',
//         company: 'Creative Minds',
//         location: 'San Francisco, CA',
//         salary: '$75,000 - $95,000',
//         description: 'Design beautiful interfaces for our clients...'
//     },
//     {
//         id: '4',
//         title: 'Product Manager',
//         company: 'Innovate Inc',
//         location: 'Chicago, IL',
//         salary: '$110,000 - $140,000',
//         description: 'Lead product development from conception to launch...'
//     }
// ];

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
        const response = await axios.get(`${API_BASE_URL}/jobs/${id}`);
        console.log(response.data)
        return response.data;

    } catch (error) {
        throw error;
    }
};

export const submitApplication = async (job, formData) => {
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
            `${API_BASE_URL}/api/applications`,
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

        return response.data;

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