"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function MarsGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isVisible = true;

    // 1. Scene & Camera
    const scene = new THREE.Scene();

    const getAspect = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      return { w, h, aspect: w / h };
    };

    const initial = getAspect();
    const camera = new THREE.PerspectiveCamera(40, initial.aspect, 0.1, 100);
    camera.position.set(0, 0, 8.5);
    camera.lookAt(0, 0, 0);

    // 2. WebGL Renderer (High efficiency, low power)
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      // Graceful fallback if WebGL context creation fails
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(initial.w, initial.h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // 3. Deep Space Starfield (Lightweight 3D points, zero CPU loop)
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      // Distribute stars in the upper hemisphere and deep space
      starPos[i * 3] = (Math.random() - 0.5) * 30;
      starPos[i * 3 + 1] = Math.random() * 12 + 0.5; // Upper half
      starPos[i * 3 + 2] = -Math.random() * 15 - 2;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xdedede,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 4. Mars Texture & Geometry
    const textureLoader = new THREE.TextureLoader();
    const marsTexture = textureLoader.load("/brand/mars-texture-2k.webp");
    marsTexture.colorSpace = THREE.SRGBColorSpace;
    marsTexture.wrapS = THREE.RepeatWrapping;
    marsTexture.wrapT = THREE.RepeatWrapping;

    // Radius 8.2 creates the exact wide cinematic curvature seen from low orbit
    const radius = 8.2;
    const sphereGeometry = new THREE.SphereGeometry(radius, 64, 48);

    // Rotate geometry so equator rolls across the horizon without polar singularities
    sphereGeometry.rotateZ(Math.PI / 2);

    // Custom single-pass Mars Atmospheric Shader
    const uniforms = {
      uTexture: { value: marsTexture },
      uSunDirection: { value: new THREE.Vector3(1.1, 0.45, 0.65).normalize() },
    };

    const marsMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec3 uSunDirection;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          // Mars surface texture
          vec4 texColor = texture2D(uTexture, vUv);

          // Directional Sunlight (warmer sun on the right horizon)
          float NdotL = dot(normal, uSunDirection);
          float diff = smoothstep(-0.2, 0.8, NdotL);

          // Atmospheric Limb Glow (Fresnel rim on the horizon curvature)
          float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
          float limbIntensity = pow(fresnel, 3.8);
          vec3 atmosphereColor = vec3(1.0, 0.46, 0.18);

          // Subtle ambient light
          vec3 ambient = vec3(0.03, 0.02, 0.035);
          vec3 surface = texColor.rgb * (diff * vec3(1.2, 1.02, 0.92) + ambient);

          // Blend surface and atmospheric corona
          vec3 finalColor = surface + atmosphereColor * (limbIntensity * (diff * 1.8 + 0.35));

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const marsSphere = new THREE.Mesh(sphereGeometry, marsMaterial);
    // Position lower so only the illuminated top horizon curvature is framed
    marsSphere.position.set(0, -7.8, 0);
    // Subtle axial tilt (-0.08)
    marsSphere.rotation.z = -0.08;
    scene.add(marsSphere);

    // 5. Continuous Forward Rolling Animation
    // Positive rotation rolls the upper surface forward towards the camera
    const rollSpeed = 0.00032;

    const animate = () => {
      if (!isVisible) return;

      marsSphere.rotation.x += rollSpeed;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    // 6. IntersectionObserver for 0% Background GPU usage
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            animationFrameId = requestAnimationFrame(animate);
          }
        } else {
          isVisible = false;
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Start initial animation
    animationFrameId = requestAnimationFrame(animate);

    // 7. Responsive Resize Handler
    const handleResize = () => {
      const { w, h, aspect } = getAspect();
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 8. Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      sphereGeometry.dispose();
      marsMaterial.dispose();
      marsTexture.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
