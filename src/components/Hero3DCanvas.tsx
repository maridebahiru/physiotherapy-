import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Activity, RefreshCw } from 'lucide-react';

export const Hero3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglError, setWebglError] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsLowPower(true);
      return;
    }

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animFrameId: number;

    // Mouse tracking targets
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    try {
      scene = new THREE.Scene();
      
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 8;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;

      // Clear container and append canvas
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // --- LIGHTS ---
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xc88a35, 2.5); // Ochre accent light
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const blueLight = new THREE.DirectionalLight(0x468b7c, 2.0); // Pine secondary light
      blueLight.position.set(-5, -3, 2);
      scene.add(blueLight);

      // --- ANATOMICAL SPINE / VERTEBRAE MESH GROUP ---
      const spineGroup = new THREE.Group();

      // Vertebrae count
      const vertebraeCount = 12;
      const discGeometry = new THREE.CylinderGeometry(0.7, 0.75, 0.18, 24);
      const jointMaterial = new THREE.MeshStandardMaterial({
        color: 0x9cc9bb,
        roughness: 0.2,
        metalness: 0.1,
        emissive: 0x1c443b,
        emissiveIntensity: 0.15
      });

      const discMaterial = new THREE.MeshStandardMaterial({
        color: 0xc88a35,
        roughness: 0.3,
        metalness: 0.4,
        emissive: 0x8e5624,
        emissiveIntensity: 0.2
      });

      for (let i = 0; i < vertebraeCount; i++) {
        // Vertebra body
        const vMesh = new THREE.Mesh(discGeometry, jointMaterial);
        vMesh.position.y = (i - vertebraeCount / 2) * 0.38;
        
        // Slight organic curve in spine
        const curveOffset = Math.sin(i * 0.4) * 0.15;
        vMesh.position.x = curveOffset;
        vMesh.rotation.z = Math.sin(i * 0.3) * 0.05;

        // Intervertebral disc cushion
        const discMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.65, 0.65, 0.08, 20),
          discMaterial
        );
        discMesh.position.y = vMesh.position.y - 0.2;
        discMesh.position.x = curveOffset;

        spineGroup.add(vMesh);
        spineGroup.add(discMesh);
      }

      // Add central neural canal core glowing line
      const curvePoints: THREE.Vector3[] = [];
      for (let i = 0; i < vertebraeCount; i++) {
        const y = (i - vertebraeCount / 2) * 0.38;
        const x = Math.sin(i * 0.4) * 0.15;
        curvePoints.push(new THREE.Vector3(x, y, 0));
      }
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const tubeGeometry = new THREE.TubeGeometry(curve, 32, 0.08, 12, false);
      const tubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xe8c27a,
        wireframe: true,
        transparent: true,
        opacity: 0.6
      });
      const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
      spineGroup.add(tubeMesh);

      // --- AMBIENT FLOATING MOVEMENT PARTICLES ---
      const particlesCount = 80;
      const particlePositions = new Float32Array(particlesCount * 3);
      for (let i = 0; i < particlesCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 10;
        particlePositions[i + 1] = (Math.random() - 0.5) * 10;
        particlePositions[i + 2] = (Math.random() - 0.5) * 6;
      }
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xc88a35,
        size: 0.04,
        transparent: true,
        opacity: 0.6
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      spineGroup.position.set(0, 0, 0);
      scene.add(spineGroup);

      // Mouse position listener
      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        targetX = x * 0.6;
        targetY = y * 0.4;
      };

      window.addEventListener('mousemove', handleMouseMove);

      // Resize listener
      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);

      // --- ANIMATION LOOP ---
      let clock = new THREE.Clock();

      const animate = () => {
        animFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smooth rotation damping towards mouse
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        spineGroup.rotation.y = elapsedTime * 0.3 + mouseX * 0.8;
        spineGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.15 + mouseY * 0.4;
        spineGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.15;

        // Slow particle drift
        particles.rotation.y = elapsedTime * 0.05;

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animFrameId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (renderer && renderer.domElement) {
          renderer.dispose();
        }
      };

    } catch (err) {
      console.warn('WebGL initialization failed, falling back to static visual:', err);
      setWebglError(true);
    }
  }, []);

  if (webglError || isLowPower) {
    return (
      <div className="w-full h-full min-h-[380px] rounded-3xl bg-gradient-to-br from-pine-900/60 to-darkpine-950 border border-pine-800/60 p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-soft">
        <div className="w-20 h-20 rounded-full bg-pine-800/40 border border-ochre-500/30 flex items-center justify-center shadow-glow-ochre">
          <Activity className="w-10 h-10 text-ochre-400 animate-pulse" />
        </div>
        <div className="space-y-1 max-w-xs">
          <h4 className="text-sm font-serif font-bold text-parchment-50">Anatomical Biomechanics</h4>
          <p className="text-xs text-parchment-300">Targeted spinal decompression & musculoskeletal restoration</p>
        </div>
        <span className="text-[11px] px-3 py-1 rounded-full bg-pine-950 text-ochre-400 border border-pine-800 font-mono">
          3D Interactive Model • 100% 1:1 Precision
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] flex items-center justify-center group">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />
      
      {/* Overlay Badge */}
      <div className="absolute bottom-4 left-4 right-4 bg-parchment-50/90 dark:bg-darkpine-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-parchment-200 dark:border-pine-800/80 flex items-center justify-between text-xs shadow-lg pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-ochre-500 animate-ping"></span>
          <span className="font-bold text-pine-950 dark:text-parchment-50">3D Spine & Musculoskeletal Model</span>
        </div>
        <span className="text-[11px] text-pine-700 dark:text-ochre-300 font-medium hidden sm:inline">
          Move cursor to inspect biomechanics
        </span>
      </div>
    </div>
  );
};
