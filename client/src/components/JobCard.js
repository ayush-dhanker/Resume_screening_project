import { Link } from 'react-router-dom';
import './JobCard.css';
import React, { useState } from 'react';
import {
    Card,
    CardText,
    CardTitle,
    Button,
    Collapse,
    CardBody,
    UncontrolledCollapse,
} from 'reactstrap';
import JobDetailModel from './JobDetailModel';

function JobCard({ job }) {
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    return (
        <div className='jobCard-style'>
            <div>
                <Card
                    body
                    className="my-2"
                    style={{
                        maxWidth: '18rem'
                    }}
                >
                    <CardTitle tag="h4" >
                        <p style={{ fontWeight: 600, textAlign: 'center' }}>{job.title}</p>
                    </CardTitle>
                    <div className='card-text'>
                        <p><strong>Company:</strong> {job.company}</p>
                        <p><strong>Location:</strong> {job.location}</p>
                        <p><strong>Salary:</strong> {job.salary}</p>
                    </div>
                    <Button onClick={toggle} id={`job-${job.id}`} color="primary" className='.apply-button' >
                        More Details
                    </Button>
                </Card>
                <JobDetailModel job={job} modal={modal} toggle={toggle} />
            </div>

        </div >
        // <div className="job-card">
        //     <h3>{job.title}</h3>
        //     <p><strong>Company:</strong> {job.company}</p>
        //     <p><strong>Location:</strong> {job.location}</p>
        //     <p><strong>Salary:</strong> {job.salary}</p>
        //     <Link to={`/apply/${job.id}`} className="apply-button">Apply Now</Link>
        // </div>
    );
}

export default JobCard;
