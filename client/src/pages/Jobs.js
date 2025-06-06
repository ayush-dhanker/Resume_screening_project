import { useEffect, useState } from 'react';
import JobCard from '../components/JobCard';
import { fetchJobs } from '../services/api';
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
    Col,
    Container,
    Row,
    UncontrolledCollapse,
    Card,
    CardBody

} from 'reactstrap';
// import './Jobs.css';

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
                setLoading(false);
            }
        };
        getJobs();
    }, []);

    if (loading) return <div style={{ width: '100%', textAlign: 'center' }}>
        <span className='loader'></span>
    </div>;

    return (
        <div className="jobs-page">
            <h2 style={{ paddingLeft: '1rem', marginBottom: '22px', textDecoration: 'underline', color: 'rgba(33, 37, 41, 1)' }}>Available Jobs</h2>
            <Container fluid className='job-list'>
                {/* <Row> */}
                {/* <Col> */}
                {/* <div className="job-list"> */}

                {jobs.map(job => (
                    // <JobCard key={job.id} job={job} isOpen={isOpen} toggle={toggle} />
                    <JobCard key={job.id} job={job} />
                ))}
                {/* </div> */}
                {/* </Col> */}
                {/* <Col xs='8'>
                    <div>
                        {jobs.map(job => (
                            <div className="toggle" >
                                <Card>
                                    <CardBody>
                                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                                        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                                        labore wes anderson cred nesciunt sapiente ea proident.
                                    </CardBody>
                                </Card>
                            </div>
                        ))}
                    </div>
                </Col> */}
                {/* </Row> */}
            </Container>
        </div>

    );
}

export default Jobs;