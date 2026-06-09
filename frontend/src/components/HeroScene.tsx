import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const HeroScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId: number;
    let renderer: THREE.WebGLRenderer;
    let handleResize: () => void;
    let handleMouseMove: (e: MouseEvent) => void;
    let mount: HTMLDivElement | null = null;
    let initialized = false;

    try {
      mount = mountRef.current;
      if (!mount) return;

      // ── Scene ──────────────────────────────────────────────────
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0A0A0A);
      scene.fog = new THREE.FogExp2(0x0A0A0A, 0.02);

      const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x0A0A0A, 1);
      mount.appendChild(renderer.domElement);

      // ── Lighting ────────────────────────────────────────────────
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const tealLight = new THREE.PointLight(0x0AFFE6, 4, 25);
      tealLight.position.set(2, 3, 2);
      scene.add(tealLight);

      const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
      sunLight.position.set(-5, 8, 6);
      scene.add(sunLight);

      // ── Translucent bubble spheres ─────────────────────────────
      const bubbles: THREE.Mesh[] = [];

      for (let i = 0; i < 20; i++) {
        const radius = Math.random() * 0.45 + 0.08;
        const geo = new THREE.SphereGeometry(radius, 16, 16);
        const mat = new THREE.MeshPhongMaterial({
          color: 0x0AFFE6,
          emissive: 0x0AFFE6,
          emissiveIntensity: 0.35,
          transparent: true,
          opacity: Math.random() * 0.2 + 0.4, // 0.40 – 0.60
          shininess: 200,
          wireframe: false,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 4 - 2
        );
        scene.add(mesh);
        bubbles.push(mesh);
      }

      // ── Mop handle ─────────────────────────────────────────────
      const mopGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.5, 8);
      const mopMat = new THREE.MeshPhongMaterial({ color: 0xC0F0EC, shininess: 80 });
      const mop = new THREE.Mesh(mopGeo, mopMat);
      mop.position.set(-2.5, -0.5, -1.5);
      mop.rotation.z = 0.5;
      scene.add(mop);

      const mopHeadGeo = new THREE.SphereGeometry(0.28, 10, 10);
      const mopHeadMat = new THREE.MeshPhongMaterial({
        color: 0x0AFFE6, shininess: 160,
        transparent: true, opacity: 0.75,
      });
      const mopHead = new THREE.Mesh(mopHeadGeo, mopHeadMat);
      mopHead.position.set(-3.2, -1.6, -1.5);
      scene.add(mopHead);

      // ── Sparkle gem (icosahedron) ──────────────────────────────
      const gemGeo = new THREE.IcosahedronGeometry(0.5, 0);
      const gemMat = new THREE.MeshPhongMaterial({
        color: 0x0AFFE6,
        emissive: 0x0AFFE6,
        emissiveIntensity: 0.3,
        shininess: 240,
        transparent: true,
        opacity: 0.85,
      });
      const gem = new THREE.Mesh(gemGeo, gemMat);
      gem.position.set(2.8, 0.5, -1);
      scene.add(gem);

      // ── Spray bottle ───────────────────────────────────────────
      const bottleGeo = new THREE.CylinderGeometry(0.18, 0.23, 1.2, 12);
      const bottleMat = new THREE.MeshPhongMaterial({
        color: 0x0AFFE6,
        shininess: 160,
        transparent: true,
        opacity: 0.55,
      });
      const bottle = new THREE.Mesh(bottleGeo, bottleMat);
      bottle.position.set(3.2, -1.5, -2);
      scene.add(bottle);

      // ── Teal particle system ───────────────────────────────────
      const particleCount = 420;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      
      const colorTeal = new THREE.Color(0x0AFFE6);
      const colorWhite = new THREE.Color(0xFFFFFF);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 14;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10 - 5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;

        const isTeal = Math.random() > 0.5;
        colors[i * 3]     = isTeal ? colorTeal.r : colorWhite.r;
        colors[i * 3 + 1] = isTeal ? colorTeal.g : colorWhite.g;
        colors[i * 3 + 2] = isTeal ? colorTeal.b : colorWhite.b;
      }
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.035,
        transparent: true,
        opacity: 0.75,
        vertexColors: true,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // ── Floor reflection ───────────────────────────────────────
      const floorGeo = new THREE.PlaneGeometry(50, 50);
      const floorMat = new THREE.MeshStandardMaterial({
        color: 0x0A0A0A,
        roughness: 0.1,
        metalness: 0.8,
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -6; // below the bounding
      scene.add(floor);

      // ── Bubble velocities ──────────────────────────────────────
      const bubbleVelocities = bubbles.map(() => ({
        x: (Math.random() - 0.5) * 0.0015,
        y: Math.random() * 0.0025 + 0.0008,
        phase: Math.random() * Math.PI * 2,
      }));

      // ── Animation loop ─────────────────────────────────────────
      const clock = new THREE.Clock();

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        bubbles.forEach((bubble, i) => {
          const v = bubbleVelocities[i];
          bubble.position.x += v.x;
          bubble.position.y += v.y;
          bubble.position.y += Math.sin(elapsed + v.phase) * 0.002;
          if (bubble.position.y > 5.5) bubble.position.y = -5.5;
          bubble.rotation.x += 0.003;
          bubble.rotation.y += 0.002;
        });

        gem.rotation.x += 0.008;
        gem.rotation.y += 0.012;
        gem.position.y = 0.5 + Math.sin(elapsed * 0.8) * 0.2;

        mop.position.y = -0.5 + Math.sin(elapsed * 0.6) * 0.15;
        mopHead.position.y = -1.6 + Math.sin(elapsed * 0.6) * 0.15;

        bottle.position.y = -1.5 + Math.sin(elapsed * 0.7 + 1) * 0.15;
        bottle.rotation.z = Math.sin(elapsed * 0.5) * 0.1;

        const posArr = particleGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          posArr[i * 3 + 1] += 0.007;
          if (posArr[i * 3 + 1] > 6) posArr[i * 3 + 1] = -5;
        }
        particleGeo.attributes.position.needsUpdate = true;

        tealLight.position.x = Math.sin(elapsed * 0.5) * 4;
        tealLight.position.z = Math.cos(elapsed * 0.5) * 4;

        particles.rotation.y = elapsed * 0.015;

        renderer.render(scene, camera);
      };
      animate();

      // ── Resize handler ─────────────────────────────────────────
      handleResize = () => {
        if (!mount) return;
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      // ── Mouse parallax ─────────────────────────────────────────
      handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 0.5;
        const y = (e.clientY / window.innerHeight - 0.5) * 0.5;
        gsap.to(camera.position, { x: x * 1.5, y: -y * 1, duration: 1.5, ease: 'power2.out' });
      };
      window.addEventListener('mousemove', handleMouseMove);
      initialized = true;
    } catch (error) {
      console.error('3D scene failed, using fallback', error);
    }

    return () => {
      if (initialized) {
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        if (renderer) renderer.dispose();
        if (mount && renderer && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" style={{ zIndex: 0 }} />;
};

export default HeroScene;
