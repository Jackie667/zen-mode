const { Engine, Runner, Bodies, Composite, Body, MouseConstraint, Mouse, Events } = Matter;

document.addEventListener('DOMContentLoaded', () => {
    const engine = Engine.create({ gravity: { x: 0, y: 1.2 } });
    const world = engine.world;

    const pills = document.querySelectorAll('.pill-tag');
    const container = document.querySelector('.hero-container');
    const massiveText = document.querySelector('.massive-text');
    const tagsWrapper = document.querySelector('.tags-wrapper');

    if (!pills.length || !container || !massiveText || !tagsWrapper) return;

    // Skip physics on narrow screens — pills stay in normal flow
    if (window.innerWidth < 600) return;

    function getZoneBounds() {
        const w = container.offsetWidth;
        const top = tagsWrapper.offsetTop;
        const bottom = massiveText.offsetTop + massiveText.offsetHeight * 0.15;
        return { w, top, bottom, h: bottom - top };
    }

    const zone = getZoneBounds();
    const wallT = 60;

    const pillBodies = [];
    pills.forEach((pill, i) => {
        const pw = Math.max(pill.offsetWidth, 80);
        const ph = pill.offsetHeight;
        // All pills start inside the zone, staggered horizontally
        const x = zone.w * 0.12 + i * (zone.w * 0.22);
        const y = zone.top + 20 + i * 8;

        const body = Bodies.rectangle(x, y, pw, ph, {
            chamfer: { radius: ph / 3 },
            restitution: 0.5,
            friction: 0.3,
            frictionAir: 0.02,
            density: 0.002,
            angle: 0,
            plugin: { css: pill }
        });

        pillBodies.push(body);
        pill.classList.add('physical-initialized');
    });

    const floor = Bodies.rectangle(zone.w / 2, zone.bottom + wallT / 2, zone.w + 200, wallT, { isStatic: true });
    const ceiling = Bodies.rectangle(zone.w / 2, zone.top - wallT / 2 - 30, zone.w + 200, wallT, { isStatic: true });
    const wallL = Bodies.rectangle(-wallT / 2, (zone.top + zone.bottom) / 2, wallT, zone.h + 300, { isStatic: true });
    const wallR = Bodies.rectangle(zone.w + wallT / 2, (zone.top + zone.bottom) / 2, wallT, zone.h + 300, { isStatic: true });

    Composite.add(world, [...pillBodies, floor, ceiling, wallL, wallR]);

    const mouse = Mouse.create(container);

    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.6,
            damping: 0.1,
            render: { visible: false }
        }
    });
    Composite.add(world, mouseConstraint);

    Events.on(mouseConstraint, 'startdrag', (e) => {
        if (e.body && e.body.isStatic) {
            mouseConstraint.body = null;
        }
    });

    container.addEventListener('mousedown', () => { container.style.cursor = 'grabbing'; });
    document.addEventListener('mouseup', () => { container.style.cursor = ''; });

    container.addEventListener('touchmove', (e) => {
        if (mouseConstraint.body) e.preventDefault();
    }, { passive: false });

    const runner = Runner.create();
    Runner.run(runner, engine);

    Events.on(engine, 'afterUpdate', () => {
        const z = getZoneBounds();
        const ox = tagsWrapper.offsetLeft;
        const oy = tagsWrapper.offsetTop;

        pillBodies.forEach(body => {
            const pill = body.plugin.css;
            if (!pill) return;

            // Self-righting: spring torque always pulls angle back to 0
            const angle = body.angle;
            const speed = body.speed;
            const angSpeed = Math.abs(body.angularVelocity);

            if (speed < 0.3 && angSpeed < 0.05 && Math.abs(angle) < 0.02) {
                // Nearly still → snap to 0
                Body.setAngle(body, 0);
                Body.setAngularVelocity(body, 0);
            } else {
                // Corrective torque proportional to angle offset
                Body.setAngularVelocity(body,
                    body.angularVelocity * 0.92 + (-angle) * 0.08
                );
            }

            // Respawn if escaped
            if (body.position.y > z.bottom + 80 ||
                body.position.y < z.top - 150 ||
                body.position.x < -100 ||
                body.position.x > z.w + 100) {
                Body.setPosition(body, {
                    x: z.w / 2 + (Math.random() - 0.5) * 200,
                    y: z.top + 20
                });
                Body.setVelocity(body, { x: 0, y: 2 });
                Body.setAngle(body, 0);
                Body.setAngularVelocity(body, 0);
            }

            const px = body.position.x - pill.offsetWidth / 2 - ox;
            const py = body.position.y - pill.offsetHeight / 2 - oy;
            pill.style.transform = `translate3d(${px}px, ${py}px, 0) rotate(${body.angle}rad)`;
        });
    });

    window.addEventListener('resize', () => {
        const z = getZoneBounds();
        Body.setPosition(floor, { x: z.w / 2, y: z.bottom + wallT / 2 });
        Body.setPosition(ceiling, { x: z.w / 2, y: z.top - wallT / 2 - 30 });
        Body.setPosition(wallL, { x: -wallT / 2, y: (z.top + z.bottom) / 2 });
        Body.setPosition(wallR, { x: z.w + wallT / 2, y: (z.top + z.bottom) / 2 });
    });
});
