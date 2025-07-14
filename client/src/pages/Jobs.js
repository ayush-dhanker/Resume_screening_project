import { useEffect, useState } from 'react';
import JobCard from '../components/JobCard';
import { fetchJobs } from '../services/api';
import { Container } from 'reactstrap';
// import './Jobs.css';
import DecryptedText from '../Animation/DecryptedText'

function Jobs() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        const getJobs = async () => {
            try {
                const data = await fetchJobs();
                setJobs(data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            }
        };
        getJobs();
    }, []);

    if (loading) return <div style={{ width: '100%', textAlign: 'center' }}>
        <span className='loader'></span>
    </div>;

    return (
        <div className="jobs-page">
            <h2 style={{ paddingLeft: '1rem', marginBottom: '22px', textDecoration: 'underline', color: 'rgba(33, 37, 41, 1)' }}>
                <DecryptedText
                    text="Available Jobs"
                    speed={160}
                    maxIterations={20}
                    characters="ABCD1234!?"
                    className="revealed"
                    parentClassName="all-letters"
                    encryptedClassName="encrypted"
                    animateOn="view"
                    revealDirection="start"
                    sequential="True"
                />
            </h2>
            <Container fluid className='job-list'>

                {jobs.map(job => (
                    <JobCard key={job.id} job={job} />
                ))}

            </Container>
        </div>

    );
}

export default Jobs;