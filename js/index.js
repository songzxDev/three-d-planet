(function () {
    'use strict';

    const backgroundColor = 0xeeeeee;
    const backgroundColorS = '#eeeeee';

    const mainColor = 0x475166;
    const mainColorS = '#475166';

    const accentColor = 0xF7941E;

    /*
      init
    */

    let thinc = document.getElementById('thinc');

    let width = window.innerWidth,
        height = window.innerHeight,
        windowHalfX = width / 2 | 0,
        windowHalfY = height / 2 | 0;

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10);
    camera.position.set(0, 0, 2);

    let rotation = 0

    let mouse = {
        x: windowHalfX,
        y: windowHalfY,
        lazyX: 0,
        lazyY: 0
    };

    let renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    let planet = createPlanet();
    let rings = createRings();
    planet.add(rings);
    scene.add(planet);

    let moons = createMoons();
    scene.add(moons);

    thinc.addEventListener('mousemove', onMove);
    thinc.addEventListener('mouseleave', onLeave);

    thinc.addEventListener('touchstart', onMove);
    thinc.addEventListener('touchmove', onMove);

    window.addEventListener('resize', onResize);

    thinc.appendChild(renderer.domElement);

    render();

    /*
     animation loop
    */
    function render() {

        let distX = mouse.x - mouse.lazyX;
        if (distX > 3 || distX < 3) mouse.lazyX += distX / 20 | 0;

        let distY = mouse.y - mouse.lazyY;
        if (distY > 3 || distY < 3) mouse.lazyY += distY / 20 | 0;

        camera.position.x += (mouse.lazyX * 0.0005 - camera.position.x - 0.8);
        camera.position.y += (-(mouse.lazyY - windowHalfY) * 0.003 - camera.position.y + 0.5);
        camera.lookAt(scene.position);

        planet.rotation.y += 0.005;
        moons.rotation.y += 0.001;

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    /*
      create planet
    */
    function createPlanet() {

        let dashTexture = new THREE.Texture(createTexture());
        dashTexture.anisotropy = renderer.getMaxAnisotropy();
        dashTexture.needsUpdate = true;

        let dashMaterial = new THREE.MeshBasicMaterial({
            map: dashTexture
        });

        let medium = new THREE.MeshBasicMaterial({
            color: mainColor,
            side: THREE.BackSide
        });

        let planet = new THREE.Group();

        let planetGeometry = new THREE.SphereGeometry(0.48, 50, 50);

        let faceVertexUvs = planetGeometry.faceVertexUvs[0];
        for (let i = 0; i < faceVertexUvs.length; i++) {

            for (let j = 0; j < 3; j++) faceVertexUvs[i][j].y = planetGeometry.faces[i].vertexNormals[j].y * 0.5 + 0.5;

        }

        let innerPlanet = new THREE.Mesh(planetGeometry, dashMaterial);
        planet.add(innerPlanet);

        let planetOutline = new THREE.Mesh(planetGeometry, medium);
        planetOutline.scale.multiplyScalar(1.05);
        planet.add(planetOutline);

        return planet;
    }

    /*
      create rings
    */
    function createRings() {
        let dark = new THREE.MeshBasicMaterial({
            color: mainColor,
            side: THREE.DoubleSide
        });
        let medium = new THREE.MeshBasicMaterial({
            color: backgroundColor,
            side: THREE.DoubleSide
        });

        let rings = new THREE.Group();

        let ringOutlineInner = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.6, 70), dark);
        rings.add(ringOutlineInner);

        let ring = new THREE.Mesh(new THREE.RingGeometry(0.6, 0.75, 70), medium);
        rings.add(ring);

        let ringOutlineOutter = new THREE.Mesh(new THREE.RingGeometry(0.75, 0.8, 70), dark)
        rings.add(ringOutlineOutter);

        rings.rotation.set(1.5, 0, 0);

        return rings;
    }

    /*
      create moons and rocks
    */
    function createMoons() {
        let bright = new THREE.MeshBasicMaterial({
            color: accentColor
        });
        let dark = new THREE.MeshBasicMaterial({
            color: mainColor
        });
        let rockGeometry = new THREE.SphereGeometry(0.05, 20, 20);
        let moonGeometry = new THREE.SphereGeometry(0.08, 25, 25);

        let moons = new THREE.Group();

        let rock1 = new THREE.Mesh(rockGeometry.clone(), bright);
        rock1.position.set(-1.3, 0, -0.3);
        moons.add(rock1);

        let rock2 = new THREE.Mesh(rockGeometry.clone(), bright);
        rock2.position.set(-0.9, 0.4, -0.8);
        moons.add(rock2);

        let rock3 = new THREE.Mesh(rockGeometry.clone(), bright);
        rock3.position.set(0.9, -0.2, 0.3);
        moons.add(rock3);

        let rock4 = new THREE.Mesh(rockGeometry.clone(), bright);
        rock4.position.set(0.9, 0.3, -0.8);
        moons.add(rock4);

        let rock5 = new THREE.Mesh(rockGeometry.clone(), bright);
        rock5.position.set(-1.5, 0.2, 0.5);
        moons.add(rock5);

        let rock6 = new THREE.Mesh(rockGeometry.clone(), bright);
        rock6.position.set(-0.9, -0.4, 0.8);
        moons.add(rock6);

        let moon1 = new THREE.Mesh(moonGeometry.clone(), dark);
        moon1.position.set(-1.2, 0.2, -0.7);
        moons.add(moon1);

        let moon2 = new THREE.Mesh(moonGeometry.clone(), dark);
        moon2.position.set(0.5, 0.2, -1.6);
        moons.add(moon2);

        let moon3 = new THREE.Mesh(moonGeometry.clone(), dark);
        moon3.position.set(1.2, 0.2, 0.7);
        moons.add(moon3);

        let moon4 = new THREE.Mesh(moonGeometry.clone(), dark);
        moon4.position.set(-1.5, -0.8, 0.7);
        moons.add(moon4);

        return moons;
    }

    /*
      create the planets texture
    */
    function createTexture() {

        let dashTextureCanvas = document.createElement('canvas');
        let ctx = dashTextureCanvas.getContext('2d');
        dashTextureCanvas.width = 1024;
        dashTextureCanvas.height = 1024;

        let lineThickness = 26;

        ctx.fillStyle = backgroundColorS;
        ctx.fillRect(0, 0, dashTextureCanvas.width, dashTextureCanvas.height);

        ctx.lineWidth = lineThickness;
        ctx.lineCap = 'round';
        ctx.strokeStyle = mainColorS;
        ctx.beginPath();

        let ammoutOfRows = dashTextureCanvas.height / lineThickness - 4;
        let middle = Math.floor(ammoutOfRows / 2) + 2;
        for (let i = -middle - 1; i < middle; i += 3) {

            let level = arcify(i) / 150 + 1;
            let currentLength = randomBetween(20, 130),
                topOffset = (i + middle) * lineThickness;

            while (true) {
                ctx.moveTo(currentLength, topOffset);

                let to = currentLength += randomBetween(50, 170) / level;
                if (to + 5 < dashTextureCanvas.width) ctx.lineTo(to, topOffset);
                else break;

                currentLength += randomBetween(70, 150);
            }

        }
        ctx.stroke();

        return dashTextureCanvas;

        function randomBetween(small, large) {
            return (Math.random() * large | 0) + small;
        }

        function arcify(x) {
            if (x == 0) return Math.pow(x + 2, 2);
            else return Math.pow(Math.abs(x), 2)
        }

    }

    /*
      Listener
    */
    function onMove(event) {
        mouse.x = event.clientX || event.touches && event.touches[0].pageX;
        mouse.y = event.clientY || event.touches && event.touches[0].pageY;
    }

    function onLeave(event) {
        mouse.x = windowHalfX;
        mouse.y = windowHalfY;
    }

    function onResize(event) {

        width = window.innerWidth;
        height = window.innerHeight;
        windowHalfX = width / 2 | 0;
        windowHalfY = height / 2 | 0;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

        mouse.x = windowHalfX;
        mouse.y = windowHalfY;

    }

}());