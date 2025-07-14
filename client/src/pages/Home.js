// import './Home.css';

import Animation from "../components/Animation";
import TrueFocus from "../Animation/TrueFocus";
import SplitText from "../Animation/SplitText";
import DecryptedText from "../Animation/DecryptedText";
import { FaHandPointRight } from "react-icons/fa";
import VariableProximity from "../Animation/VariableProximity";
import { useRef } from 'react';
import { Button } from "reactstrap";

function Home() {
    const containerRef = useRef(null);
    return (
        <section className="home">
            <div className="comp-1">
                <div style={{ width: '35%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <h2>
                        <SplitText
                            text="Human Centered AI"
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
                        <Button color="primary" outline>Download Report</Button>
                    </h2>
                    <p style={{ textAlign: 'right' }}><TrueFocus
                        sentence="Research Question"
                        manualMode={false}
                        blurAmount={5}
                        borderColor="red"
                        animationDuration={2}
                        pauseBetweenAnimations={1}
                    /><FaHandPointRight />
                    </p>

                </div>
                <div style={{ width: '55%', border: '2px dashed black', padding: '20px', borderRadius: '10px' }}>
                    <h1
                        ref={containerRef}
                        style={{ position: 'relative' }}
                    >
                        <VariableProximity
                            label={'Evaluating Transparency in User Profiling for Resume Screening Systems: A Human-Centered Approach'}
                            className={'variable-proximity-demo'}
                            fromFontVariationSettings="'wght' 400, 'opsz' 9"
                            toFontVariationSettings="'wght' 1000, 'opsz' 40"
                            containerRef={containerRef}
                            radius={100}
                            falloff='linear'
                        />
                    </h1>
                    {/* <h1>Evaluating Transparency in User Profiling for Resume Screening Systems: A Human-Centered Approach</h1> */}
                </div>
            </div>

        </section>
    );
}

export default Home;