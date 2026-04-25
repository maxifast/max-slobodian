/* ═══════════════════════════════════════════
   THREE.JS — Hero: Ukraine→Spain Migration Particles + DNA Helix
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    // ── Hero Particle Network — Migration paths ──
    var heroCanvas = document.getElementById('hero-canvas');
    if (!heroCanvas || typeof THREE === 'undefined') return;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    var renderer = new THREE.WebGLRenderer({
        canvas: heroCanvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // === Two clusters: Ukraine (left, blue-yellow) → Spain (right, warm) ===

    // Network particles — flowing from left to right
    var PARTICLE_COUNT = 160;
    var positions = new Float32Array(PARTICLE_COUNT * 3);
    var colors = new Float32Array(PARTICLE_COUNT * 3);
    var velocities = [];
    var spreadX = 100;
    var spreadY = 60;

    // Ukraine colors: blue #005BBB, yellow #FFD500
    // Spain/accent colors: purple #6C5CE7, light blue #74B9FF
    var colUkrBlue = new THREE.Color(0x005BBB);
    var colUkrYellow = new THREE.Color(0xFFD500);
    var colAccent = new THREE.Color(0x8B7FFF);
    var colAccentLight = new THREE.Color(0x74B9FF);

    for (var i = 0; i < PARTICLE_COUNT; i++) {
        // Spread particles across the screen, slightly biased left-to-right flow
        positions[i * 3] = (Math.random() - 0.5) * spreadX;
        positions[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 25;

        // Color based on X position: blue/yellow on left → purple/light-blue on right
        var xNorm = (positions[i * 3] + spreadX / 2) / spreadX; // 0..1
        var col;
        if (xNorm < 0.4) {
            col = Math.random() > 0.5 ? colUkrBlue : colUkrYellow;
        } else if (xNorm > 0.6) {
            col = Math.random() > 0.5 ? colAccent : colAccentLight;
        } else {
            // Transition zone — blend
            var t = (xNorm - 0.4) / 0.2;
            var fromCol = Math.random() > 0.5 ? colUkrBlue : colUkrYellow;
            var toCol = Math.random() > 0.5 ? colAccent : colAccentLight;
            col = fromCol.clone().lerp(toCol, t);
        }
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;

        // Velocity — general drift from left to right (migration flow)
        velocities.push({
            x: 0.01 + Math.random() * 0.025, // always moving right
            y: (Math.random() - 0.5) * 0.015,
            z: (Math.random() - 0.5) * 0.008
        });
    }

    var particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var particleMaterial = new THREE.PointsMaterial({
        size: 0.5,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        vertexColors: true
    });

    var particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Lines between nearby particles
    var lineMaterial = new THREE.LineBasicMaterial({
        color: 0x6C5CE7,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending
    });

    var linesMesh = null;
    var MAX_DISTANCE = 10;

    function updateLines() {
        if (linesMesh) {
            scene.remove(linesMesh);
            linesMesh.geometry.dispose();
        }

        var linePoints = [];
        var pos = particleGeometry.attributes.position.array;

        for (var ii = 0; ii < PARTICLE_COUNT; ii++) {
            for (var jj = ii + 1; jj < PARTICLE_COUNT; jj++) {
                var dx = pos[ii * 3] - pos[jj * 3];
                var dy = pos[ii * 3 + 1] - pos[jj * 3 + 1];
                var dz = pos[ii * 3 + 2] - pos[jj * 3 + 2];
                var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < MAX_DISTANCE) {
                    linePoints.push(
                        new THREE.Vector3(pos[ii * 3], pos[ii * 3 + 1], pos[ii * 3 + 2]),
                        new THREE.Vector3(pos[jj * 3], pos[jj * 3 + 1], pos[jj * 3 + 2])
                    );
                }
            }
        }

        if (linePoints.length > 0) {
            var lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
            linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
            scene.add(linesMesh);
        }
    }

    // Mouse interaction
    var mouse = { x: 0, y: 0 };
    document.addEventListener('mousemove', function (e) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // === Migration path curves (arching lines from left to right) ===
    var pathGroup = new THREE.Group();
    scene.add(pathGroup);

    for (var p = 0; p < 5; p++) {
        var curvePoints = [];
        var startY = (Math.random() - 0.5) * 30;
        var endY = (Math.random() - 0.5) * 30;
        var arcHeight = 5 + Math.random() * 15;
        var startX = -spreadX / 2 + Math.random() * 10;
        var endX = spreadX / 2 - Math.random() * 10;

        for (var cp = 0; cp <= 40; cp++) {
            var t2 = cp / 40;
            var x = startX + (endX - startX) * t2;
            var y = startY + (endY - startY) * t2 + Math.sin(t2 * Math.PI) * arcHeight;
            var z = Math.sin(t2 * Math.PI * 2) * 3 - 10;
            curvePoints.push(new THREE.Vector3(x, y, z));
        }

        var curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
        var curveMat = new THREE.LineBasicMaterial({
            color: 0x6C5CE7,
            transparent: true,
            opacity: 0.06 + Math.random() * 0.05,
            blending: THREE.AdditiveBlending
        });
        pathGroup.add(new THREE.Line(curveGeo, curveMat));
    }

    // Animation loop
    var frameCount = 0;
    function animateHero() {
        requestAnimationFrame(animateHero);
        frameCount++;

        var pos = particleGeometry.attributes.position.array;
        for (var k = 0; k < PARTICLE_COUNT; k++) {
            pos[k * 3] += velocities[k].x;
            pos[k * 3 + 1] += velocities[k].y;
            pos[k * 3 + 2] += velocities[k].z;

            // Mouse influence
            pos[k * 3] += mouse.x * 0.008;
            pos[k * 3 + 1] += mouse.y * 0.008;

            // Wrap around — when particle goes off right, respawn on left (migration loop)
            if (pos[k * 3] > spreadX / 2) {
                pos[k * 3] = -spreadX / 2;
                pos[k * 3 + 1] = (Math.random() - 0.5) * spreadY;
            }

            // Y & Z bounds
            if (Math.abs(pos[k * 3 + 1]) > spreadY / 2) velocities[k].y *= -1;
            if (Math.abs(pos[k * 3 + 2]) > 15) velocities[k].z *= -1;
        }

        particleGeometry.attributes.position.needsUpdate = true;

        // Update lines every 3 frames
        if (frameCount % 3 === 0) {
            updateLines();
        }

        // Camera subtle movement
        camera.position.x += (mouse.x * 3 - camera.position.x) * 0.02;
        camera.position.y += (mouse.y * 2 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        // Subtle path rotation
        pathGroup.rotation.z = Math.sin(Date.now() * 0.0002) * 0.02;

        renderer.render(scene, camera);
    }

    animateHero();

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });


    // ── DNA Helix Canvas ───────────────────────
    var dnaCanvas = document.getElementById('dna-canvas');
    if (!dnaCanvas) return;

    var dnaScene = new THREE.Scene();
    var dnaCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    dnaCamera.position.z = 60;
    dnaCamera.position.x = 20;

    var dnaRenderer = new THREE.WebGLRenderer({
        canvas: dnaCanvas,
        alpha: true,
        antialias: true
    });
    dnaRenderer.setSize(window.innerWidth, window.innerHeight);
    dnaRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // DNA helix particles
    var DNA_POINTS = 120;
    var helixPositions1 = new Float32Array(DNA_POINTS * 3);
    var helixPositions2 = new Float32Array(DNA_POINTS * 3);
    var connectorPoints = [];

    var helixRadius = 8;
    var helixHeight = 80;
    var helixTurns = 4;

    for (var d = 0; d < DNA_POINTS; d++) {
        var t3 = (d / DNA_POINTS) * Math.PI * 2 * helixTurns;
        var y3 = (d / DNA_POINTS) * helixHeight - helixHeight / 2;

        helixPositions1[d * 3] = Math.cos(t3) * helixRadius;
        helixPositions1[d * 3 + 1] = y3;
        helixPositions1[d * 3 + 2] = Math.sin(t3) * helixRadius;

        helixPositions2[d * 3] = Math.cos(t3 + Math.PI) * helixRadius;
        helixPositions2[d * 3 + 1] = y3;
        helixPositions2[d * 3 + 2] = Math.sin(t3 + Math.PI) * helixRadius;

        if (d % 6 === 0) {
            connectorPoints.push(
                new THREE.Vector3(helixPositions1[d * 3], y3, helixPositions1[d * 3 + 2]),
                new THREE.Vector3(helixPositions2[d * 3], y3, helixPositions2[d * 3 + 2])
            );
        }
    }

    var helixGeo1 = new THREE.BufferGeometry();
    helixGeo1.setAttribute('position', new THREE.BufferAttribute(helixPositions1, 3));
    var helixGeo2 = new THREE.BufferGeometry();
    helixGeo2.setAttribute('position', new THREE.BufferAttribute(helixPositions2, 3));

    var helixMat = new THREE.PointsMaterial({
        color: 0x8B7FFF,
        size: 0.6,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    var helixMat2 = new THREE.PointsMaterial({
        color: 0x74B9FF,
        size: 0.6,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    var dnaGroup = new THREE.Group();
    dnaGroup.add(new THREE.Points(helixGeo1, helixMat));
    dnaGroup.add(new THREE.Points(helixGeo2, helixMat2));

    if (connectorPoints.length > 0) {
        var connGeo = new THREE.BufferGeometry().setFromPoints(connectorPoints);
        var connMat = new THREE.LineBasicMaterial({
            color: 0x6C5CE7,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });
        dnaGroup.add(new THREE.LineSegments(connGeo, connMat));
    }

    dnaScene.add(dnaGroup);

    function animateDNA() {
        requestAnimationFrame(animateDNA);
        dnaGroup.rotation.y += 0.003;
        dnaGroup.rotation.x = Math.sin(Date.now() * 0.0003) * 0.1;
        dnaRenderer.render(dnaScene, dnaCamera);
    }

    animateDNA();

    window.addEventListener('resize', function () {
        dnaCamera.aspect = window.innerWidth / window.innerHeight;
        dnaCamera.updateProjectionMatrix();
        dnaRenderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
