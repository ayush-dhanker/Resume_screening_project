// import { createAnimatable, utils, Animatable } from 'animejs';
// animatable.x(100).y(200);

// const $demos = document.querySelector('#docs-demos');
// const $demo = $demos.querySelector('.docs-demo.is-active');
// let bounds = $demo.getBoundingClientRect();
// const refreshBounds = () => bounds = $demo.getBoundingClientRect();

// const circle = createAnimatable('.circle', {
//     x: 0,
//     y: 0,
//     backgroundColor: 0,
//     ease: 'outExpo',
// });

// const rgb = [164, 255, 79];

// // Sets new durations and easings
// circle.x(0, 500, 'out(2)');
// circle.y(0, 500, 'out(3)');
// circle.backgroundColor(rgb, 250);

// const onMouseMove = e => {
//     const { width, height, left, top } = bounds;
//     const hw = width / 2;
//     const hh = height / 2;
//     const x = utils.clamp(e.clientX - left - hw, -hw, hw);
//     const y = utils.clamp(e.clientY - top - hh, -hh, hh);
//     rgb[0] = utils.mapRange(x, -hw, hw, 0, 164);
//     rgb[2] = utils.mapRange(x, -hw, hw, 79, 255);
//     circle.x(x).y(y).backgroundColor(rgb); // Update values
// }

// window.addEventListener('mousemove', onMouseMove);
// $demos.addEventListener('scroll', refreshBounds);