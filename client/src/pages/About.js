import './About.css';
import React, { useEffect, useState } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import SplitText from '../Animation/SplitText';
import DecryptedText from '../Animation/DecryptedText';
import { fetchTeamMeambers } from '../services/api';


function About() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getMembers = async () => {
            try {
                const data = await fetchTeamMeambers();
                setTeamMembers(data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            }
        };
        getMembers();
    }, []);

    if (loading) return <div style={{ width: '100%', textAlign: 'center' }}>
        <span className='loader'></span>
    </div>;
    return (
        <section className="about-section" id="about">
            <h1>
                <SplitText
                    text="Hello, there!"
                    className="text-2xl font-semibold text-center"
                    delay={100}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                />
            </h1>
            <p>
                This project was created as part of our coursework for HCAI (Human-Centered AI).

            </p>

            <h2>
                <DecryptedText
                    text="Meet the team"
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
            <div className="team-container">
                {teamMembers.map((member, index) => (
                    <div className="team-card" key={index}>
                        <img src={member.photo} alt={member.name} className="profile-photo" />
                        <h3>{member.name}</h3>
                        <p>{member.role}</p>
                        <div className="social-icons">
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                                <FaLinkedin />
                            </a>
                            <a href={member.github} target="_blank" rel="noopener noreferrer">
                                <FaGithub />
                            </a>
                        </div>
                    </div>

                ))}
            </div>
        </section>
    );
}

export default About;


