import { useEffect, useRef } from 'react';

const FinisherHeader = () => {
    const headerRef = useRef(null);

    useEffect(() => {
        // Dynamically load the script
        const script = document.createElement('script');
        script.src = `${process.env.PUBLIC_URL}/finisher-header.es5.min.js`;
        script.async = true;

        script.onload = () => {
            // Initialize after script loads
            if (window.FinisherHeader) {
                new window.FinisherHeader({
                    count: 6,
                    size: { min: 938, max: 1300, pulse: 0.3 },
                    speed: {
                        x: { min: 0.1, max: 0.6 },
                        y: { min: 0.1, max: 0.3 }
                    },
                    colors: {
                        background: "#9138e5",
                        particles: ["#6bd6ff", "#ffcb57", "#ff333d"]
                    },
                    blending: "overlay",
                    opacity: { center: 1, edge: 0.1 },
                    skew: -2,
                    shapes: ["c", "s"]
                });
            }
        };

        document.body.appendChild(script);

        return () => {
            // Cleanup
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div
            ref={headerRef}
            className="finisher-header"
            style={{
                width: '100%',
                // height: '300px',
                position: 'absolute'
            }}
        >
            {/* Your header content (logo, nav, etc.) */}
        </div>
    );
};

export default FinisherHeader;