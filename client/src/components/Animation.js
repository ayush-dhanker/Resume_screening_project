import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import './Animation.css'

const GridAnimation = () => {
    const gridRef = useRef(null);

    const grid = [11, 6];
    const totalSquares = grid[0] * grid[1];

    const animateGrid = () => {
        const squares = gridRef.current.querySelectorAll('.square');
        const from = Math.floor(Math.random() * totalSquares);

        anime({
            targets: squares,
            translateX: [
                { value: anime.stagger('-12px', { grid, from, axis: 'x' }) },
                { value: 0, easing: 'easeInOutQuad' },
            ],
            translateY: [
                { value: anime.stagger('-12px', { grid, from, axis: 'y' }) },
                { value: 0, easing: 'easeInOutQuad' },
            ],
            opacity: [
                { value: 0.5 },
                { value: 1 }
            ],
            delay: anime.stagger(85, { grid, from }),
            duration: 5500,
            complete: animateGrid
        });
    };

    useEffect(() => {
        animateGrid();
    }, []);

    return (
        <div ref={gridRef} className="grid-container">
            {Array.from({ length: totalSquares }).map((_, i) => (
                <div key={i} className="square" />
            ))}
        </div>
    );
};

export default GridAnimation;
