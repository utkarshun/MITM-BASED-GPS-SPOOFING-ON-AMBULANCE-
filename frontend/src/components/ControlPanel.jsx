import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Joystick } from "react-joystick-component";
import CarSimulator from "./CarSimulator";

function ControlPanel({ onCommand }) {
  const [currentCommand, setCurrentCommand] = useState("S");
  const [useJoystick, setUseJoystick] = useState(false);

  // For continuous command sending (fixed speed: 80)
  const intervalRef = useRef(null);
  const fixedSpeed = 80;

  const handleCommand = (command) => {
    setCurrentCommand(command);
    onCommand(command, fixedSpeed);
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
    idle: { scale: 1, boxShadow: "0 2px 8px rgba(51, 102, 153, 0.2)" },
    hover: { scale: 1.05, boxShadow: "0 4px 12px rgba(220, 53, 69, 0.3)" },
    pressed: { scale: 0.95, boxShadow: "0 1px 4px rgba(220, 53, 69, 0.2)" },
  };

  return (
    <div className="space-y-6 pb-20">
      <CarSimulator currentCommand={currentCommand} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Control Panel */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-hospital-dark">
              Vehicle Controls
            </h2>
            <motion.button
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                useJoystick
                  ? "bg-hospital-blue text-white"
                  : "bg-gray-100 text-hospital-dark hover:bg-gray-200"
              }`}
              onClick={() => setUseJoystick(!useJoystick)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {useJoystick ? "Switch to Buttons" : "Use Joystick"}
            </motion.button>
          </div>

          {useJoystick ? (
            <div className="flex justify-center py-8">
              <Joystick
                size={140}
                baseColor="rgba(51, 102, 153, 0.15)"
                stickColor="#336699"
                move={handleJoystickMove}
                stop={() => handleCommand("S")}
              />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 max-w-md">
              {/* Forward */}
              <motion.button
                className="col-start-2 bg-hospital-blue hover:bg-blue-600 text-white rounded-lg p-6 font-bold text-xl shadow-md border border-blue-300"
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

              {/* Left */}
              <motion.button
                className="col-start-1 row-start-2 bg-hospital-blue hover:bg-blue-600 text-white rounded-lg p-6 font-bold text-xl shadow-md border border-blue-300"
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

              {/* Stop */}
              <motion.button
                className="col-start-2 row-start-2 bg-hospital-red hover:bg-red-600 text-white rounded-lg p-6 font-bold text-lg shadow-md border border-red-300"
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
                ■ STOP
              </motion.button>

              {/* Right */}
              <motion.button
                className="col-start-3 row-start-2 bg-hospital-blue hover:bg-blue-600 text-white rounded-lg p-6 font-bold text-xl shadow-md border border-blue-300"
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

              {/* Backward */}
              <motion.button
                className="col-start-2 row-start-3 bg-hospital-blue hover:bg-blue-600 text-white rounded-lg p-6 font-bold text-xl shadow-md border border-blue-300"
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
        </div>

        {/* Info Panel */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-hospital-dark mb-4">
              System Info
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-hospital-gray font-semibold mb-1">
                  Current Direction
                </p>
                <p className="text-xl font-bold text-hospital-blue">
                  {currentCommand === "F" && "FORWARD"}
                  {currentCommand === "B" && "BACKWARD"}
                  {currentCommand === "L" && "LEFT"}
                  {currentCommand === "R" && "RIGHT"}
                  {currentCommand === "S" && "STOPPED"}
                </p>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-hospital-gray font-semibold mb-1">
                  Speed Setting
                </p>
                <p className="text-lg font-bold text-hospital-red">
                  Fixed: {fixedSpeed}%
                </p>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-hospital-gray font-semibold">Mode</p>
                <p className="text-sm font-semibold text-gray-600">
                  {useJoystick ? "🕹️ Joystick" : "🔘 Buttons"}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-hospital-gray font-semibold">
              TIP: Hold buttons for continuous movement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
