import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function JobDetailModel({ job, modal, toggle, items }) {

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>
                    <h2>{job.title}</h2>
                    <p><strong>{job.company}</strong> – {job.location}</p>
                </ModalHeader>
                <ModalBody>
                    <p><strong>Level:</strong> {job.level}</p>
                    <p><strong>Type:</strong> {job.type}</p>
                    <p><strong>Salary:</strong> {job.salary}</p>
                    <p><strong>Posted:</strong> {job.posted_date}</p>
                    <p style={{ marginTop: "15px" }}>{job.description}</p>
                    <div style={{ marginTop: "15px" }}>
                        <strong>Skills:</strong><br />
                        {job.skills.map((skill, idx) => (
                            <span key={idx} className='skillBadge'>{skill}</span>
                        ))}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={toggle} href={`/apply/${job.id}`} color='primary' type='a' style={{ background: items }}>
                        Apply Now
                    </Button>{' '}
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default JobDetailModel;