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
        // In a real app:
        const response = await axios.get(`${API_BASE_URL}/jobs`);
        return response.data;

        // Mock implementation:
        // return new Promise(resolve => {
        //     setTimeout(() => resolve(mockJobs), 500);
        // });
    } catch (error) {
        throw error;
    }
};

export const fetchJobById = async (id) => {
    try {
        // In a real app:
        const response = await axios.get(`${API_BASE_URL}/jobs/${id}`);
        return response.data;

        // Mock implementation:
        // return new Promise((resolve, reject) => {
        //     setTimeout(() => {
        //         const job = mockJobs.find(job => job.id === id);
        //         if (job) {
        //             resolve(job);
        //         } else {
        //             reject(new Error('Job not found'));
        //         }
        //     }, 500);
        // });
    } catch (error) {
        throw error;
    }
};

export const submitApplication = async (jobId, formData) => {
    try {
        // In a real app:
        // const response = await axios.post(`${API_BASE_URL}/applications`, {
        //   jobId,
        //   ...formData
        // });
        // return response.data;

        // Mock implementation:
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true }), 1000);
        });
    } catch (error) {
        throw error;
    }
};