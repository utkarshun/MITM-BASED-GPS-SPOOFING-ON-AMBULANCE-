import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Joystick } from "react-joystick-component";
import CarSimulator from "./CarSimulator";

function ControlPanel({ onCommand }) {
  const [speed, setSpeed] = useState(80);
  const [currentCommand, setCurrentCommand] = useState("S");
  const [useJoystick, setUseJoystick] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);

  // For continuous command sending
  const intervalRef = useRef(null);

  const handleCommand = (command) => {
    setCurrentCommand(command);
    onCommand(command, speed);

    // Add to history
    setCommandHistory((prev) => {
      const updated = [
        { cmd: command, speed, time: new Date().toLocaleTimeString() },
        ...prev,
      ];
      return updated.slice(0, 5); // Keep last 5 commands
    });
  };

  const handleButtonDown = (command) => {
    handleCommand(command);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      handleCommand(command);
    }, 120); // send every 120ms
  };

  const handleButtonUp = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    handleCommand("S");
  };

  const handleJoystickMove = (e) => {
    if (!e || !e.direction) {
      handleCommand("S");
      return;
    }

    switch (e.direction.toLowerCase()) {
      case "forward":
        handleCommand("F");
        break;
      case "backward":
        handleCommand("B");
        break;
      case "left":
        handleCommand("L");
        break;
      case "right":
        handleCommand("R");
        break;
      default:
        handleCommand("S");
    }
  };

  const buttonVariants = {
    idle: { scale: 1, boxShadow: "0 0 10px #4DEEEA" },
    hover: { scale: 1.05, boxShadow: "0 0 20px #4DEEEA" },
    pressed: { scale: 0.95, boxShadow: "0 0 30px #2FE8A0" },
  };

  const commandMapping = {
    F: { label: "Forward", icon: "▲", color: "text-blue-400" },
    B: { label: "Backward", icon: "▼", color: "text-red-400" },
    L: { label: "Left", icon: "◄", color: "text-yellow-400" },
    R: { label: "Right", icon: "►", color: "text-green-400" },
    S: { label: "Stop", icon: "■", color: "text-white" },
  };

  return (
    <div className="space-y-8">
      <CarSimulator currentCommand={currentCommand} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Control Panel */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-neon-blue border-opacity-30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-orbitron text-neon-blue font-bold tracking-wider">
              🎮 CONTROLS
            </h3>
            <motion.button
              className={`px-6 py-2 rounded-lg font-orbitron text-sm font-bold transition-all ${
                useJoystick
                  ? "bg-gradient-to-r from-neon-blue to-neon-green text-gray-900 shadow-lg shadow-neon-blue"
                  : "bg-gradient-to-r from-gray-700 to-gray-800 text-neon-blue border border-neon-blue border-opacity-50"
              }`}
              onClick={() => setUseJoystick(!useJoystick)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {useJoystick ? "🕹️ Joystick" : "⌨️ Buttons"}
            </motion.button>
          </div>

          {useJoystick ? (
            <div className="flex justify-center py-12">
              <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-8 rounded-2xl border-2 border-neon-blue border-opacity-50">
                <Joystick
                  size={180}
                  baseColor="rgba(77, 238, 234, 0.15)"
                  stickColor="#4DEEEA"
                  move={handleJoystickMove}
                  stop={() => handleCommand("S")}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {/* Forward button */}
              <motion.button
                className="col-start-2 bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-xl font-bold text-2xl border-2 border-blue-300 transition-all duration-150"
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="pressed"
                onMouseDown={() => handleButtonDown("F")}
                onMouseUp={handleButtonUp}
                onMouseLeave={handleButtonUp}
                onTouchStart={() => handleButtonDown("F")}
                onTouchEnd={handleButtonUp}
              >
                ▲
              </motion.button>

              {/* Left button */}
              <motion.button
                className="col-start-1 row-start-2 bg-gradient-to-br from-yellow-500 to-yellow-700 text-white p-6 rounded-xl font-bold text-2xl border-2 border-yellow-300 transition-all duration-150"
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="pressed"
                onMouseDown={() => handleButtonDown("L")}
                onMouseUp={handleButtonUp}
                onMouseLeave={handleButtonUp}
                onTouchStart={() => handleButtonDown("L")}
                onTouchEnd={handleButtonUp}
              >
                ◄
              </motion.button>

              {/* Stop button */}
              <motion.button
                className="col-start-2 row-start-2 bg-gradient-to-br from-red-500 to-red-700 text-white p-6 rounded-xl font-bold text-2xl border-2 border-red-300 transition-all duration-150"
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="pressed"
                onMouseDown={() => handleButtonDown("S")}
                onMouseUp={handleButtonUp}
                onMouseLeave={handleButtonUp}
                onTouchStart={() => handleButtonDown("S")}
                onTouchEnd={handleButtonUp}
              >
                ■
              </motion.button>

              {/* Right button */}
              <motion.button
                className="col-start-3 row-start-2 bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-xl font-bold text-2xl border-2 border-green-300 transition-all duration-150"
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="pressed"
                onMouseDown={() => handleButtonDown("R")}
                onMouseUp={handleButtonUp}
                onMouseLeave={handleButtonUp}
                onTouchStart={() => handleButtonDown("R")}
                onTouchEnd={handleButtonUp}
              >
                ►
              </motion.button>

              {/* Backward button */}
              <motion.button
                className="col-start-2 row-start-3 bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-xl font-bold text-2xl border-2 border-purple-300 transition-all duration-150"
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="pressed"
                onMouseDown={() => handleButtonDown("B")}
                onMouseUp={handleButtonUp}
                onMouseLeave={handleButtonUp}
                onTouchStart={() => handleButtonDown("B")}
                onTouchEnd={handleButtonUp}
              >
                ▼
              </motion.button>
            </div>
          )}

          {/* Command Indicator */}
          <div className="mt-8 pt-6 border-t border-neon-blue border-opacity-30">
            <p className="text-sm text-gray-400 mb-2">CURRENT ACTION</p>
            <motion.div
              key={currentCommand}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-4xl font-bold ${commandMapping[currentCommand].color}`}
            >
              {commandMapping[currentCommand].label}
            </motion.div>
          </div>
        </div>

        {/* Right Sidebar: Speed & History */}
        <div className="space-y-6">
          {/* Speed Control */}
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-neon-blue border-opacity-30 backdrop-blur-xl p-6 rounded-2xl shadow-2xl">
            <h3 className="text-lg font-orbitron text-neon-blue mb-4 font-bold">
              ⚡ SPEED
            </h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-blue"
                style={{
                  background: `linear-gradient(to right, #4DEEEA 0%, #4DEEEA ${speed}%, rgba(77,238,234,0.1) ${speed}%, rgba(77,238,234,0.1) 100%)`,
                }}
              />
              <motion.div
                key={speed}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <div className="text-5xl font-orbitron font-bold text-neon-blue">
                  {speed}%
                </div>
              </motion.div>

              {/* Speed indicators */}
              <div className="flex gap-1 mt-4">
                {[25, 50, 75, 100].map((val) => (
                  <motion.button
                    key={val}
                    onClick={() => setSpeed(val)}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${
                      Math.abs(speed - val) < 15
                        ? "bg-neon-blue text-gray-900 shadow-lg shadow-neon-blue"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {val}%
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Command History */}
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-neon-blue border-opacity-30 backdrop-blur-xl p-6 rounded-2xl shadow-2xl">
            <h3 className="text-lg font-orbitron text-neon-blue mb-4 font-bold">
              📜 HISTORY
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {commandHistory.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No commands yet...
                </p>
              ) : (
                commandHistory.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-gray-700 bg-opacity-50 p-3 rounded-lg border-l-2 border-neon-green"
                  >
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-neon-green">
                        {commandMapping[entry.cmd].label} @ {entry.speed}%
                      </span>
                      <span className="text-xs text-gray-400">
                        {entry.time}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Stats Panel */}
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-neon-blue border-opacity-30 backdrop-blur-xl p-6 rounded-2xl shadow-2xl">
            <h3 className="text-lg font-orbitron text-neon-blue mb-4 font-bold">
              📊 STATUS
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Mode:</span>
                <span className="text-neon-blue font-bold">
                  {useJoystick ? "🕹️ Joystick" : "⌨️ Buttons"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Cmd:</span>
                <span className="text-neon-green font-bold">
                  {commandMapping[currentCommand].label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
