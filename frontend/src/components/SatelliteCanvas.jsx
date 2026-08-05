import React, { useEffect, useRef } from "react";

const SatelliteCanvas = ({
  density = 70,
  connectionDistance = 140,
  interactive = true,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse tracking
    const mouse = {
      x: null,
      y: null,
      radius: 170,
    };

    const handleMouseMove = (e) => {
      if (!interactive) return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleTouchMove = (e) => {
      if (!interactive || !e.touches[0]) return;
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    // Satellites & Nodes initialization (Pure Monochrome Black & White)
    class Node {
      constructor(isSatellite = false) {
        this.reset(isSatellite);
      }

      reset(isSatellite = false) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.isSatellite = isSatellite || Math.random() < 0.25; // 25% are main satellites
        this.radius = this.isSatellite ? Math.random() * 2 + 2 : Math.random() * 1.5 + 0.8;
        this.color = this.isSatellite
          ? "#FFFFFF"
          : Math.random() < 0.5
          ? "rgba(255, 255, 255, 0.7)"
          : "rgba(255, 255, 255, 0.35)";

        // Satellite orbital & pulse attributes
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.025 + Math.random() * 0.02;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.015;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off screen edges smoothly
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        this.pulse += this.pulseSpeed;
        this.rotation += this.rotSpeed;

        // Mouse interactivity
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.1;
            this.y -= (dy / dist) * force * 1.1;
          }
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.isSatellite) {
          // Draw Satellite with solar wings & subtle white halo
          const auraRadius = this.radius + Math.sin(this.pulse) * 2 + 3;

          // Outer glowing halo
          ctx.beginPath();
          ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
          ctx.fill();

          // Satellite Rotation
          ctx.rotate(this.rotation);

          // Solar wings / panel lines (White/Silver)
          ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-9, 0);
          ctx.lineTo(9, 0);
          ctx.stroke();

          // Cross panels
          ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
          ctx.beginPath();
          ctx.moveTo(-7, -2.5);
          ctx.lineTo(-7, 2.5);
          ctx.moveTo(7, -2.5);
          ctx.lineTo(7, 2.5);
          ctx.stroke();

          // Core Body
          ctx.beginPath();
          ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
          ctx.shadowColor = "#FFFFFF";
          ctx.shadowBlur = 8;
        } else {
          // Regular Orbital Particle Node
          ctx.beginPath();
          ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.shadowColor = "#FFFFFF";
          ctx.shadowBlur = 3;
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Signal Pulse traveling along connections
    const pulses = [];

    class SignalPulse {
      constructor(fromNode, toNode) {
        this.from = fromNode;
        this.to = toNode;
        this.progress = 0;
        this.speed = 0.015 + Math.random() * 0.02;
        this.color = "rgba(255, 255, 255, 0.9)";
      }

      update() {
        this.progress += this.speed;
        return this.progress < 1;
      }

      draw() {
        const x = this.from.x + (this.to.x - this.from.x) * this.progress;
        const y = this.from.y + (this.to.y - this.from.y) * this.progress;

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = "#FFFFFF";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }
    }

    const nodes = [];
    const count = Math.floor((width * height) / 19000) || density;

    for (let i = 0; i < count; i++) {
      nodes.push(new Node(i % 4 === 0));
    }

    // Animation Loop
    let lastPulseTime = 0;

    const animate = (timestamp) => {
      ctx.clearRect(0, 0, width, height);

      // Render dark minimalist space backdrop
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 3,
        50,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, "#09090b");
      bgGrad.addColorStop(0.6, "#040405");
      bgGrad.addColorStop(1, "#000000");

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Update & Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
        nodes[i].draw();
      }

      // Draw Connection Lines between close nodes (Subtle White/Silver)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.35;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.restore();

            // Spawn occasional white telemetry pulse
            if (
              (nodes[i].isSatellite || nodes[j].isSatellite) &&
              timestamp - lastPulseTime > 450 &&
              Math.random() < 0.006
            ) {
              pulses.push(new SignalPulse(nodes[i], nodes[j]));
              lastPulseTime = timestamp;
            }
          }
        }
      }

      // Draw mouse connections
      if (mouse.x !== null && mouse.y !== null) {
        for (let i = 0; i < nodes.length; i++) {
          const dx = mouse.x - nodes[i].x;
          const dy = mouse.y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.5;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.shadowColor = "#FFFFFF";
            ctx.shadowBlur = 4;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Update & Draw Pulses
      for (let p = pulses.length - 1; p >= 0; p--) {
        if (pulses[p].update()) {
          pulses[p].draw();
        } else {
          pulses.splice(p, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, connectionDistance, interactive]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        background: "#000000",
      }}
    />
  );
};

export default SatelliteCanvas;
