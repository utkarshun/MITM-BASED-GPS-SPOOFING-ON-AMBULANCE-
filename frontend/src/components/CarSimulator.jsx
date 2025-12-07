import React, { useRef, useEffect } from "react";

function CarSimulator({ currentCommand }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ x: 150, y: 80, angle: 0, speed: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf = null;

    const draw = () => {
      const s = stateRef.current;
      // clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // background grid
      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(200, 200, 200, 0.4)";
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // update state
      const accel = 0.6;
      switch (currentCommand) {
        case "F":
          s.speed = Math.min(6, s.speed + accel * 0.2);
          break;
        case "B":
          s.speed = Math.max(-4, s.speed - accel * 0.2);
          break;
        case "L":
          s.angle -= 0.06;
          break;
        case "R":
          s.angle += 0.06;
          break;
        default:
          s.speed *= 0.92;
      }

      s.x += Math.sin(s.angle) * s.speed;
      s.y -= Math.cos(s.angle) * s.speed;

      // wrap
      if (s.x < -50) s.x = canvas.width + 50;
      if (s.x > canvas.width + 50) s.x = -50;
      if (s.y < -50) s.y = canvas.height + 50;
      if (s.y > canvas.height + 50) s.y = -50;

      // draw car shadow
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);

      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.beginPath();
      ctx.ellipse(0, 20, 40, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // ambulance body
      ctx.fillStyle = "#dc3545";
      ctx.fillRect(-30, -18, 60, 36);

      // white stripe
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-30, -4, 60, 8);

      // windows
      ctx.fillStyle = "rgba(100, 150, 220, 0.4)";
      ctx.fillRect(-18, -12, 36, 10);

      // headlights
      ctx.fillStyle = "#ffff00";
      ctx.fillRect(-36, -8, 8, 6);
      ctx.fillRect(-36, 2, 8, 6);

      // taillights
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(28, -8, 6, 6);
      ctx.fillRect(28, 2, 6, 6);

      ctx.restore();

      // telemetry text
      ctx.fillStyle = "#336699";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(
        `Direction: ${
          currentCommand === "F"
            ? "FORWARD"
            : currentCommand === "B"
            ? "BACKWARD"
            : currentCommand === "L"
            ? "LEFT"
            : currentCommand === "R"
            ? "RIGHT"
            : "STOPPED"
        }`,
        12,
        20
      );
      ctx.fillStyle = "#666";
      ctx.font = "12px sans-serif";
      ctx.fillText(`Speed: ${Math.round(s.speed * 10) / 10}`, 12, 38);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [currentCommand]);

  return (
    <div className="h-48 w-full rounded-lg overflow-hidden bg-gray-50 shadow-md border border-gray-300">
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className="w-full h-full"
      />
    </div>
  );
}

export default CarSimulator;
