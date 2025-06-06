import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApplicationForm from '../components/ApplicationForm';
import { fetchJobById } from '../services/api';
// import './Application.css';

function Application() {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getJob = async () => {
            try {
                const data = await fetchJobById(jobId);
                setJob(data);
            } catch (error) {
                console.error('Error fetching job:', error);
            } finally {
                setLoading(false);
            }
        };
        getJob();
    }, [jobId]);

    if (loading) return <div style={{ width: '100%', textAlign: 'center' }}>
        <span className='loader'></span>
    </div>;
    if (!job) return <div>Job not found</div>;

    return (
        <div className="application-page">
            <ApplicationForm job={job} />
        </div>
    );
}

export default Application;