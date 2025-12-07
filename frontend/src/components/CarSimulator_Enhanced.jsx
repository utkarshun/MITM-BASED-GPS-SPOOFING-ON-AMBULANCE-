import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

function CarSimulator({ currentCommand }) {
  const canvasRef = useRef(null);

  const commandColors = {
    F: { primary: "#00FFFF", secondary: "#00FF88", label: "MOVING FORWARD" },
    B: { primary: "#FF3366", secondary: "#FF0055", label: "REVERSING" },
    L: { primary: "#FFFF00", secondary: "#FFCC00", label: "TURNING LEFT" },
    R: { primary: "#00DD00", secondary: "#00FF00", label: "TURNING RIGHT" },
    S: { primary: "#4DEEEA", secondary: "#2FE8A0", label: "STOPPED" },
  };

  const colors = commandColors[currentCommand] || commandColors.S;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#0a0e27");
    gradient.addColorStop(1, "#1a1f3a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add grid background
    ctx.strokeStyle = "rgba(77, 238, 234, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    const centerX = width / 2;
    const centerY = height / 2;

    // Draw car body (modern rectangu lar design)
    const carWidth = 60;
    const carHeight = 100;

    // Calculate rotation based on command
    let rotation = 0;
    if (currentCommand === "L") rotation = -15;
    if (currentCommand === "R") rotation = 15;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    // Car body with gradient
    const bodyGradient = ctx.createLinearGradient(
      -carWidth / 2,
      -carHeight / 2,
      -carWidth / 2,
      carHeight / 2
    );
    bodyGradient.addColorStop(0, colors.primary);
    bodyGradient.addColorStop(0.5, "#1a3a4a");
    bodyGradient.addColorStop(1, colors.secondary);
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(-carWidth / 2, -carHeight / 2, carWidth, carHeight);

    // Car borders
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.strokeRect(-carWidth / 2, -carHeight / 2, carWidth, carHeight);

    // Cabin (darker top part)
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(-carWidth / 2 + 5, -carHeight / 2 + 15, carWidth - 10, 35);
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 2;
    ctx.strokeRect(-carWidth / 2 + 5, -carHeight / 2 + 15, carWidth - 10, 35);

    // Front lights (headlights)
    if (currentCommand === "F" || currentCommand === "S") {
      ctx.fillStyle = "#FFFF00";
      ctx.fillRect(-carWidth / 2 + 10, -carHeight / 2 - 5, 8, 4);
      ctx.fillRect(carWidth / 2 - 18, -carHeight / 2 - 5, 8, 4);
    }

    // Rear lights (brake lights)
    if (currentCommand === "B") {
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(-carWidth / 2 + 10, carHeight / 2 + 1, 8, 4);
      ctx.fillRect(carWidth / 2 - 18, carHeight / 2 + 1, 8, 4);
    }

    // Wheels
    const wheelY = -carHeight / 2 + 20;
    const wheelRadius = 8;

    // Front left wheel
    ctx.fillStyle = "#333333";
    ctx.beginPath();
    ctx.arc(-carWidth / 2 + 12, wheelY, wheelRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Front right wheel
    ctx.fillStyle = "#333333";
    ctx.beginPath();
    ctx.arc(carWidth / 2 - 12, wheelY, wheelRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.primary;
    ctx.stroke();

    // Rear left wheel
    ctx.fillStyle = "#333333";
    ctx.beginPath();
    ctx.arc(
      -carWidth / 2 + 12,
      carHeight / 2 - 20,
      wheelRadius,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.strokeStyle = colors.primary;
    ctx.stroke();

    // Rear right wheel
    ctx.fillStyle = "#333333";
    ctx.beginPath();
    ctx.arc(carWidth / 2 - 12, carHeight / 2 - 20, wheelRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.primary;
    ctx.stroke();

    // Movement effect (motion lines)
    if (currentCommand === "F" || currentCommand === "B") {
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-25 - i * 15, 0);
        ctx.lineTo(-35 - i * 15, 0);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    ctx.restore();

    // Status text below car
    ctx.fillStyle = colors.primary;
    ctx.font = "bold 16px 'Orbitron'";
    ctx.textAlign = "center";
    ctx.fillText(colors.label, centerX, height - 30);

    // Directional arrows
    if (currentCommand !== "S") {
      ctx.fillStyle = colors.secondary;
      ctx.globalAlpha = 0.6;
      if (currentCommand === "F") {
        // Up arrow
        ctx.beginPath();
        ctx.moveTo(centerX + 80, centerY + 40);
        ctx.lineTo(centerX + 100, centerY + 20);
        ctx.lineTo(centerX + 95, centerY + 20);
        ctx.lineTo(centerX + 95, centerY + 45);
        ctx.lineTo(centerX + 105, centerY + 45);
        ctx.lineTo(centerX + 105, centerY + 20);
        ctx.lineTo(centerX + 100, centerY + 20);
        ctx.fill();
      } else if (currentCommand === "B") {
        // Down arrow
        ctx.beginPath();
        ctx.moveTo(centerX - 80, centerY - 40);
        ctx.lineTo(centerX - 100, centerY - 20);
        ctx.lineTo(centerX - 95, centerY - 20);
        ctx.lineTo(centerX - 95, centerY - 45);
        ctx.lineTo(centerX - 105, centerY - 45);
        ctx.lineTo(centerX - 105, centerY - 20);
        ctx.lineTo(centerX - 100, centerY - 20);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }, [currentCommand]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-neon-blue border-opacity-50 rounded-2xl overflow-hidden shadow-2xl"
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full h-auto block"
        />

        {/* Overlay status */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 px-4 py-2 rounded-lg border border-neon-blue border-opacity-50">
          <p className="text-neon-green font-orbitron text-sm font-bold">
            {currentCommand === "S" ? "🛑 IDLE" : "⚡ ACTIVE"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default CarSimulator;
