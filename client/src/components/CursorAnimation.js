import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const CursorAnimation = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const move = (e) => setPosition({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, []);

    return (
        <motion.div
            className="cursor"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: 30,
                height: 30,
                borderRadius: '50%',
                opacity: "40%",
                backgroundColor: 'black',
                pointerEvents: 'none',
                zIndex: 9999,
            }}
            animate={{ x: position.x - 10, y: position.y - 10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
    );
};

export default CursorAnimation;