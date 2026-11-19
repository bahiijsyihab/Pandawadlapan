"use client";

import React, { useEffect, useRef, useState } from "react";
import { Compass, Focus, Orbit } from "lucide-react";

type CameraPresetKey = "epic" | "core" | "orbit";

interface CameraPreset {
  key: CameraPresetKey;
  label: string;
  rx: number;
  ry: number;
  zoom: number;
  orbitScale: number;
}

const CAMERA_PRESETS: CameraPreset[] = [
  { key: "epic", label: "Mode Epik", rx: 0.2, ry: 0.36, zoom: 1.0, orbitScale: 1.0 },
  { key: "core", label: "Inti Logo", rx: 0.04, ry: 0.0, zoom: 1.18, orbitScale: 0.88 },
  { key: "orbit", label: "Orbit 41", rx: 0.58, ry: -0.42, zoom: 0.82, orbitScale: 1.22 },
];

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface Satellite {
  index: number;
  baseRadius: number;
  theta: number;
  phi: number;
  speed: number;
  size: number;
  color: string;
}

interface ExtrudedPiece {
  front: Vec3[];
  back: Vec3[];
  accentGold: boolean;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

function rotatePoint(p: Vec3, rx: number, ry: number, rz = 0): Vec3 {
  let x = p.x;
  let y = p.y;
  let z = p.z;
  if (rz !== 0) {
    const cz = Math.cos(rz);
    const sz = Math.sin(rz);
    const nx = x * cz - y * sz;
    const ny = x * sz + y * cz;
    x = nx;
    y = ny;
  }
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const x1 = x * cosY - z * sinY;
  const z1 = x * sinY + z * cosY;
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const y2 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;
  return { x: x1, y: y2, z: z2 };
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function extrudeLogo2D(pts: [number, number][], depth: number, accentGold: boolean): ExtrudedPiece {
  const scale = 1 / 128;
  const cx = 180;
  const cy = 182;
  const front: Vec3[] = pts.map(([x, y]) => ({
    x: (x - cx) * scale,
    y: (y - cy) * scale,
    z: depth,
  }));
  const back: Vec3[] = pts.map(([x, y]) => ({
    x: (x - cx) * scale,
    y: (y - cy) * scale,
    z: -depth,
  }));
  return { front, back, accentGold };
}

const LOGO_PIECES_3D: ExtrudedPiece[] = [
  extrudeLogo2D(
    [
      [36, 64],
      [324, 64],
      [215, 253],
      [143, 128],
      [185, 128],
      [214, 178],
      [258, 102],
      [58, 102],
    ],
    0.22,
    true
  ),
  extrudeLogo2D(
    [
      [73, 128],
      [117, 128],
      [202, 275],
      [180, 313],
    ],
    0.22,
    false
  ),
];

const OUTER_FRAME_VERTICES: Vec3[] = [
  { x: -1.42, y: -1.04, z: 0.36 },
  { x: 1.42, y: -1.04, z: 0.36 },
  { x: 0.0, y: 1.44, z: 0.36 },
  { x: -1.42, y: -1.04, z: -0.36 },
  { x: 1.42, y: -1.04, z: -0.36 },
  { x: 0.0, y: 1.44, z: -0.36 },
];

const OUTER_FRAME_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 0],
  [3, 4], [4, 5], [5, 3],
  [0, 3], [1, 4], [2, 5],
];

function create41Satellites(): Satellite[] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: 41 }, (_, i) => {
    const t = i / 41;
    const phi = Math.acos(1 - 2 * ((i + 0.5) / 41));
    const theta = goldenAngle * i;
    return {
      index: i + 1,
      baseRadius: 1.95 + (i % 4) * 0.24,
      theta,
      phi: (phi - Math.PI / 2) * 0.58,
      speed: 0.17 + (i % 5) * 0.03,
      size: i < 6 ? 4.4 : 2.5 + t * 1.3,
      color: i < 6 ? "#F7D046" : i % 4 === 0 ? "#5CE1E6" : i % 2 === 0 ? "#FBE38A" : "#E8E4F3",
    };
  });
}

export function Hero3DStage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [preset, setPreset] = useState<CameraPresetKey>("epic");
  const [isDragging, setIsDragging] = useState(false);

  const stateRef = useRef({
    rx: 0.55,
    ry: -1.35,
    vrx: 0,
    vry: 0.0048,
    targetRx: 0.22,
    targetRy: 0.36,
    zoom: 0.48,
    targetZoom: 1.0,
    orbitScale: 1.65,
    targetOrbitScale: 1.0,
    presetBlend: 1.0,
    pulse: 0.8,
    sparks: [] as Spark[],
    dragging: false,
    lastX: 0,
    lastY: 0,
    pointerX: -9999,
    pointerY: -9999,
    pointerActive: false,
    inView: true,
    pageVisible: true,
  });

  const spawnBurst = (x: number, y: number, count = 22) => {
    const st = stateRef.current;
    const colors = ["#F7D046", "#FFF5CC", "#5CE1E6", "#C58BF2"];
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const spd = 1.6 + Math.random() * 3.8;
      st.sparks.push({
        x,
        y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        life: 1.0,
        color: colors[i % colors.length],
        size: 1.5 + Math.random() * 2.2,
      });
    }
  };

  const applyPreset = (key: CameraPresetKey) => {
    setPreset(key);
    const p = CAMERA_PRESETS.find((c) => c.key === key) || CAMERA_PRESETS[0];
    const st = stateRef.current;
    st.targetRx = p.rx;
    st.targetRy = p.ry;
    st.targetZoom = p.zoom;
    st.targetOrbitScale = p.orbitScale;
    st.presetBlend = 1.0;
    st.pulse = 1.0;
    st.vrx = 0;
    st.vry = 0.0038;
    const canvas = canvasRef.current;
    if (canvas) {
      spawnBurst(canvas.clientWidth * 0.5, canvas.clientHeight * 0.5, 24);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const satellites = create41Satellites();
    const isMobile = window.innerWidth < 768;
    const ambientCount = isMobile ? 32 : 70;
    const ambientStars = Array.from({ length: ambientCount }, (_, i) => ({
      x: ((i * 197.3) % 100) / 100,
      y: ((i * 313.7) % 100) / 100,
      z: 0.3 + ((i * 47) % 100) / 100,
      r: 0.7 + (i % 3) * 0.55,
      a: 0.15 + (i % 5) * 0.08,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onVisibility = () => {
      stateRef.current.pageVisible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => {
        stateRef.current.inView = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    observer.observe(section);

    let rafId = 0;
    let time = 0;

    const render = () => {
      rafId = requestAnimationFrame(render);
      const st = stateRef.current;
      if (!st.pageVisible || !st.inView) return;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;

      time += 0.016;
      st.pulse *= 0.93;

      if (st.presetBlend > 0.004 && !st.dragging) {
        st.rx += (st.targetRx - st.rx) * 0.065;
        st.ry += (st.targetRy - st.ry) * 0.065;
        st.presetBlend *= 0.95;
      } else if (!st.dragging) {
        st.rx += st.vrx;
        st.ry += st.vry;
        st.vrx *= 0.94;
        st.vry = st.vry * 0.96 + 0.0048 * 0.04;
      }
      st.zoom += (st.targetZoom - st.zoom) * 0.065;
      st.orbitScale += (st.targetOrbitScale - st.orbitScale) * 0.065;

      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.46;
      const baseScale = Math.min(w, h) * 0.23 * st.zoom;
      const fov = 5.4;

      const project = (p: Vec3) => {
        const z = p.z + fov;
        const factor = (fov / Math.max(0.85, z)) * baseScale;
        return {
          x: cx + p.x * factor,
          y: cy + p.y * factor,
          z: p.z,
          scale: factor / baseScale,
        };
      };

      const parallaxX = st.pointerActive ? ((st.pointerX - cx) / Math.max(1, w)) * 0.24 : 0;
      const parallaxY = st.pointerActive ? ((st.pointerY - cy) / Math.max(1, h)) * 0.24 : 0;
      const effRx = st.rx + parallaxY;
      const effRy = st.ry + parallaxX;

      // 1. Subtle parallax starfield
      for (let i = 0; i < ambientStars.length; i++) {
        const s = ambientStars[i];
        const sx = (s.x * w - parallaxX * 42 * s.z + w) % w;
        const sy = (s.y * h - parallaxY * 42 * s.z + h) % h;
        const twinkle = 0.55 + 0.45 * Math.sin(time * 1.4 + i);
        ctx.fillStyle = `rgba(255,255,255,${(s.a * twinkle).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Volumetric Studio Conic Light Rays
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.06);
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        const rayGrad = ctx.createLinearGradient(0, 0, baseScale * 2.4, 0);
        rayGrad.addColorStop(0, "rgba(247, 208, 70, 0.07)");
        rayGrad.addColorStop(0.5, "rgba(124, 58, 237, 0.04)");
        rayGrad.addColorStop(1, "rgba(22, 10, 44, 0)");
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(baseScale * 2.4, -baseScale * 0.22);
        ctx.lineTo(baseScale * 2.4, baseScale * 0.22);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      const aura = ctx.createRadialGradient(cx, cy, baseScale * 0.1, cx, cy, baseScale * 2.2);
      aura.addColorStop(0, "rgba(139, 92, 246, 0.24)");
      aura.addColorStop(0.5, "rgba(46, 16, 101, 0.14)");
      aura.addColorStop(1, "rgba(22, 10, 44, 0)");
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(cx, cy, baseScale * 2.2, 0, Math.PI * 2);
      ctx.fill();

      if (st.pulse > 0.025) {
        const waveR = (1 - st.pulse) * baseScale * 2.9;
        ctx.save();
        ctx.strokeStyle = `rgba(247, 208, 70, ${(st.pulse * 0.65).toFixed(3)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, waveR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      const drawGyroRing = (
        radius: number,
        tiltX: number,
        tiltZ: number,
        spinSpeed: number,
        colorRgb: string,
        behind: boolean,
        withComets: boolean
      ) => {
        const steps = 80;
        const pts: { x: number; y: number; z: number }[] = [];
        for (let i = 0; i <= steps; i++) {
          const a = (i / steps) * Math.PI * 2 + time * spinSpeed;
          const rad = radius * st.orbitScale * (1 + st.pulse * 0.09);
          const x0 = Math.cos(a) * rad;
          const y0 = Math.sin(a) * rad * Math.sin(tiltX);
          const z0 = Math.sin(a) * rad * Math.cos(tiltX);
          const xr = x0 * Math.cos(tiltZ) - y0 * Math.sin(tiltZ);
          const yr = x0 * Math.sin(tiltZ) + y0 * Math.cos(tiltZ);
          pts.push(project(rotatePoint({ x: xr, y: yr, z: z0 }, effRx, effRy)));
        }

        ctx.save();
        ctx.lineWidth = behind ? 1.0 : 1.7;
        for (let i = 0; i < steps; i++) {
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const midZ = (p1.z + p2.z) * 0.5;
          if (behind ? midZ <= 0 : midZ > 0) continue;
          ctx.strokeStyle = `rgba(${colorRgb}, ${behind ? 0.18 : 0.6})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        if (withComets) {
          for (const offset of [0, 0.5]) {
            const cometIdx = Math.floor((((time * 0.28 + offset) % 1) + 1) % 1 * steps);
            const cp = pts[cometIdx];
            if (behind ? cp.z > 0 : cp.z <= 0) {
              ctx.fillStyle = `rgba(${colorRgb}, 1)`;
              ctx.shadowColor = `rgba(${colorRgb}, 0.95)`;
              ctx.shadowBlur = 16;
              ctx.beginPath();
              ctx.arc(cp.x, cp.y, 3.3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        ctx.restore();
      };

      drawGyroRing(2.05, 0.34, 0.22, 0.16, "247, 208, 70", true, true);
      drawGyroRing(2.42, -0.44, -0.26, -0.12, "123, 146, 248", true, true);
      drawGyroRing(1.68, 0.95, 0.48, 0.24, "92, 225, 230", true, false);

      let hoveredSat: { index: number; x: number; y: number } | null = null;
      let minHoverDist = 32;

      const projectedSats = satellites.map((sat) => {
        const a = sat.theta + time * sat.speed;
        const r = sat.baseRadius * st.orbitScale * (1 + st.pulse * 0.15);
        const p3: Vec3 = {
          x: Math.cos(a) * Math.cos(sat.phi) * r,
          y: Math.sin(sat.phi) * r * 0.88,
          z: Math.sin(a) * Math.cos(sat.phi) * r,
        };
        const proj = project(rotatePoint(p3, effRx, effRy));

        const aPrev = a - sat.speed * 0.2;
        const pPrev: Vec3 = {
          x: Math.cos(aPrev) * Math.cos(sat.phi) * r,
          y: Math.sin(sat.phi) * r * 0.88,
          z: Math.sin(aPrev) * Math.cos(sat.phi) * r,
        };
        const projPrev = project(rotatePoint(pPrev, effRx, effRy));

        if (st.pointerActive && proj.z <= 0.4) {
          const d = Math.hypot(proj.x - st.pointerX, proj.y - st.pointerY);
          if (d < minHoverDist) {
            minHoverDist = d;
            hoveredSat = { index: sat.index, x: proj.x, y: proj.y };
          }
        }
        return { ...sat, ...proj, prevX: projPrev.x, prevY: projPrev.y };
      });

      const drawSatellites = (behind: boolean) => {
        for (let i = 0; i < projectedSats.length; i++) {
          const s = projectedSats[i];
          if (behind ? s.z <= 0 : s.z > 0) continue;

          if (st.pointerActive) {
            const dist = Math.hypot(s.x - st.pointerX, s.y - st.pointerY);
            if (dist < 175) {
              const alpha = (1 - dist / 175) * 0.5;
              ctx.strokeStyle = `rgba(247, 208, 70, ${alpha.toFixed(3)})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(st.pointerX, st.pointerY);
              ctx.lineTo(s.x, s.y);
              ctx.stroke();
            }
          }

          ctx.strokeStyle = s.color;
          ctx.globalAlpha = behind ? 0.16 : 0.45;
          ctx.lineWidth = Math.max(1, s.size * s.scale * 0.48);
          ctx.beginPath();
          ctx.moveTo(s.prevX, s.prevY);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();

          const radius = Math.max(1.5, s.size * s.scale);
          ctx.save();
          ctx.fillStyle = s.color;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = behind ? 4 : 14;
          ctx.globalAlpha = behind ? 0.4 : 0.98;
          ctx.beginPath();
          ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.globalAlpha = 1;
      };

      drawSatellites(true);

      const projFrame = OUTER_FRAME_VERTICES.map((v) => project(rotatePoint(v, effRx, effRy)));
      ctx.save();
      ctx.strokeStyle = "rgba(247, 208, 70, 0.3)";
      ctx.lineWidth = 1.2;
      for (const [a, b] of OUTER_FRAME_EDGES) {
        ctx.beginPath();
        ctx.moveTo(projFrame[a].x, projFrame[a].y);
        ctx.lineTo(projFrame[b].x, projFrame[b].y);
        ctx.stroke();
      }
      ctx.restore();

      const lightGold = normalize({
        x: Math.cos(time * 0.7) * 0.9 + parallaxX * 2.2,
        y: -0.75 + parallaxY * 2.2,
        z: -1.0,
      });
      const lightAqua = normalize({ x: -0.85, y: 0.75, z: -0.6 });

      interface RenderPoly {
        pts: { x: number; y: number }[];
        avgZ: number;
        fill: string | CanvasGradient;
        stroke: string;
        lineWidth: number;
        glow?: boolean;
      }
      const polys: RenderPoly[] = [];

      for (const piece of LOGO_PIECES_3D) {
        const rotF = piece.front.map((v) => rotatePoint(v, effRx, effRy));
        const rotB = piece.back.map((v) => rotatePoint(v, effRx, effRy));
        const projF = rotF.map(project);
        const projB = rotB.map(project);
        const n = rotF.length;

        for (let i = 0; i < n; i++) {
          const j = (i + 1) % n;
          const v0 = rotF[i];
          const v1 = rotF[j];
          const v2 = rotB[j];
          const v3 = rotB[i];
          const avgZ = (v0.z + v1.z + v2.z + v3.z) * 0.25;
          const normal = normalize(cross(sub(v1, v0), sub(v3, v0)));
          const nDotG = Math.abs(dot(normal, lightGold));
          const nDotA = Math.abs(dot(normal, lightAqua));
          const spec = Math.pow(nDotG, 8) * 0.75 + st.pulse * 0.35;

          const r = piece.accentGold
            ? Math.min(255, Math.round(150 + nDotG * 95 + spec * 65))
            : Math.min(255, Math.round(110 + nDotG * 85 + nDotA * 40 + spec * 55));
          const g = piece.accentGold
            ? Math.min(255, Math.round(112 + nDotG * 88 + spec * 60))
            : Math.min(255, Math.round(82 + nDotA * 95 + spec * 55));
          const b = piece.accentGold
            ? Math.min(255, Math.round(42 + nDotA * 55 + spec * 40))
            : Math.min(255, Math.round(190 + nDotA * 60 + spec * 35));

          polys.push({
            pts: [projF[i], projF[j], projB[j], projB[i]],
            avgZ,
            fill: `rgba(${r}, ${g}, ${b}, 0.96)`,
            stroke: piece.accentGold ? "rgba(255, 240, 175, 0.5)" : "rgba(197, 139, 242, 0.45)",
            lineWidth: 0.95,
          });
        }

        const addCapFace = (rotVerts: Vec3[], projVerts: { x: number; y: number }[], isFront: boolean) => {
          const avgZ = rotVerts.reduce((acc, v) => acc + v.z, 0) / rotVerts.length;
          const sweep = (Math.sin(time * 1.4) + 1) * 0.5;
          const grad = ctx.createLinearGradient(
            projVerts[0].x,
            projVerts[0].y,
            projVerts[Math.floor(projVerts.length / 2)].x,
            projVerts[Math.floor(projVerts.length / 2)].y
          );
          if (piece.accentGold) {
            grad.addColorStop(0, "#FFFFFF");
            grad.addColorStop(Math.max(0.15, Math.min(0.85, sweep)), "#FFF7D6");
            grad.addColorStop(1, "#F7D046");
          } else {
            grad.addColorStop(0, "#FFFFFF");
            grad.addColorStop(Math.max(0.15, Math.min(0.85, 1 - sweep)), "#F3EEFF");
            grad.addColorStop(1, "#C58BF2");
          }

          polys.push({
            pts: projVerts,
            avgZ: avgZ - (isFront ? 0.02 : -0.02),
            fill: grad,
            stroke: piece.accentGold ? "#F7D046" : "rgba(255, 255, 255, 0.9)",
            lineWidth: 1.7,
            glow: true,
          });
        };

        addCapFace(rotB, projB, false);
        addCapFace(rotF, projF, true);
      }

      polys.sort((a, b) => b.avgZ - a.avgZ);

      for (const poly of polys) {
        ctx.save();
        ctx.beginPath();
        poly.pts.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        if (poly.glow) {
          ctx.shadowColor = "rgba(247, 208, 70, 0.42)";
          ctx.shadowBlur = 22;
        }
        ctx.fillStyle = poly.fill;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = poly.stroke;
        ctx.lineWidth = poly.lineWidth;
        ctx.lineJoin = "miter";
        ctx.stroke();
        ctx.restore();
      }

      drawGyroRing(2.05, 0.34, 0.22, 0.16, "247, 208, 70", false, true);
      drawGyroRing(2.42, -0.44, -0.26, -0.12, "123, 146, 248", false, true);
      drawGyroRing(1.68, 0.95, 0.48, 0.24, "92, 225, 230", false, false);
      drawSatellites(false);

      for (let i = st.sparks.length - 1; i >= 0; i--) {
        const sp = st.sparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.96;
        sp.vy *= 0.96;
        sp.life -= 0.025;
        if (sp.life <= 0) {
          st.sparks.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = sp.life;
        ctx.fillStyle = sp.color;
        ctx.shadowColor = sp.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (hoveredSat) {
        const hs = hoveredSat as { index: number; x: number; y: number };
        ctx.save();
        ctx.strokeStyle = "#F7D046";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(hs.x, hs.y, 13, 0, Math.PI * 2);
        ctx.stroke();
        const tag = `ANGGOTA #${String(hs.index).padStart(2, "0")}`;
        ctx.font = '600 10px "JetBrains Mono", monospace';
        const tw = ctx.measureText(tag).width + 16;
        ctx.fillStyle = "rgba(22, 10, 44, 0.92)";
        ctx.strokeStyle = "rgba(247, 208, 70, 0.6)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(hs.x + 16, hs.y - 12, tw, 24, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#F7D046";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(tag, hs.x + 24, hs.y);
        ctx.restore();
      }
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const st = stateRef.current;
    st.dragging = true;
    st.presetBlend = 0;
    st.pulse = 0.7;
    st.lastX = e.clientX;
    st.lastY = e.clientY;
    spawnBurst(e.clientX - rect.left, e.clientY - rect.top, 16);
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const st = stateRef.current;
    st.pointerX = e.clientX - rect.left;
    st.pointerY = e.clientY - rect.top;
    st.pointerActive = true;

    if (st.dragging) {
      const dx = e.clientX - st.lastX;
      const dy = e.clientY - st.lastY;
      st.ry += dx * 0.0085;
      st.rx += dy * 0.0085;
      st.vry = dx * 0.0045;
      st.vrx = dy * 0.0045;
      st.lastX = e.clientX;
      st.lastY = e.clientY;
    }
  };

  const handlePointerUp = () => {
    stateRef.current.dragging = false;
    setIsDragging(false);
  };

  const handlePointerLeave = () => {
    stateRef.current.dragging = false;
    stateRef.current.pointerActive = false;
    setIsDragging(false);
  };

  return (
    <section
      id="beranda"
      ref={sectionRef}
      className="relative h-[100svh] min-h-[640px] max-h-[1080px] bg-transparent text-white overflow-hidden flex flex-col pt-24 pb-6"
    >
      {/* ZONE 1 (TOP): Clean Centered Wordmark — Guaranteed Never Overlaps 3D Stage */}
      <div className="relative z-10 mx-auto max-w-4xl w-full px-4 text-center shrink-0">
        <h1 className="font-display text-4xl sm:text-6xl lg:text-[4.5rem] leading-[0.95] tracking-[-0.04em] text-white">
          PANDAWA
        </h1>
        <p className="mt-1.5 font-serif italic text-lg sm:text-2xl text-gold">
          United in Trust, Stronger Together.
        </p>
      </div>

      {/* ZONE 2 (MIDDLE): 100% Dedicated Unobstructed Interactive 3D Logo Stage */}
      <div className="relative flex-1 w-full min-h-[320px]">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          aria-label="Panggung 3D Interaktif Logo Resmi PANDAWA dengan 41 satelit orbit anggota"
          className={`absolute inset-0 w-full h-full touch-pan-y select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        />
      </div>

      {/* ZONE 3 (BOTTOM): Liquid Glass Segmented Pill Camera Dock */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 flex flex-col items-center gap-2 shrink-0">
        <div
          className="inline-flex items-center gap-1 p-1 rounded-full bg-black/45 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          role="group"
          aria-label="Preset Kamera 3D"
        >
          {CAMERA_PRESETS.map((cam) => {
            const active = preset === cam.key;
            const Icon =
              cam.key === "epic" ? Compass : cam.key === "core" ? Focus : Orbit;
            return (
              <button
                key={cam.key}
                type="button"
                onClick={() => applyPreset(cam.key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  active
                    ? "bg-white text-obsidian"
                    : "text-white/75 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cam.label}</span>
              </button>
            );
          })}
        </div>
        <span className="text-[11px] text-white/45">
          Geser atau klik untuk memutar logo 3D
        </span>
      </div>
    </section>
  );
}
