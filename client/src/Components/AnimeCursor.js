import React, { useEffect, useRef } from 'react';
import { createAnimatable, utils } from 'animejs';
import '../App.css'; // You'll need to create this for the CSS classes

const AnimeCursor = () => {
    const demoRef = useRef(null);
    const circleRef = useRef(null);
    const animatableRef = useRef(null);
    const rgbRef = useRef([164, 255, 79]);

    useEffect(() => {
        // Initialize animatable once component mounts
        animatableRef.current = createAnimatable(circleRef.current, {
            x: 0,
            y: 0,
            backgroundColor: 0,
            ease: 'outExpo',
        });

        // Set initial properties
        animatableRef.current.x(0, 500, 'out(2)');
        animatableRef.current.y(0, 500, 'out(3)');
        animatableRef.current.backgroundColor(rgbRef.current, 250);

        const refreshBounds = () => {
            if (demoRef.current) {
                return demoRef.current.getBoundingClientRect();
            }
            return null;
        };

        let bounds = refreshBounds();

        const onMouseMove = (e) => {
            if (!bounds) bounds = refreshBounds();
            if (!bounds) return;

            const { width, height, left, top } = bounds;
            const hw = width / 2;
            const hh = height / 2;
            const x = utils.clamp(e.clientX - left - hw, -hw, hw);
            const y = utils.clamp(e.clientY - top - hh, -hh, hh);

            rgbRef.current[0] = utils.mapRange(x, -hw, hw, 0, 164);
            // rgbRef.current[2] = utils.mapRange(x, -hw, hw, 79, 255);

            animatableRef.current.x(x).y(y).backgroundColor(rgbRef.current);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', refreshBounds);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', refreshBounds);
        };
    }, []);

    return (
        <div id="docs-demos" ref={demoRef} className="docs-demo is-active">
            <div className="large centered row">
                <div ref={circleRef} className="circle"></div>
            </div>
            <div className="medium centered row">
                <span className="label"></span>
            </div>
        </div>
    );
};

export default AnimeCursor;