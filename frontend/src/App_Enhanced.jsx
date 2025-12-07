import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConnectForm from "./components/ConnectForm";
import ControlPanel from "./components/ControlPanel";
import StatusBar from "./components/StatusBar";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [wsConnection, setWsConnection] = useState(null);
  const [currentCommand, setCurrentCommand] = useState("");
  const [latency, setLatency] = useState(0);
  const [connectionTime, setConnectionTime] = useState(null);

  useEffect(() => {
    // Cleanup WebSocket connection on unmount
    return () => {
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, [wsConnection]);

  const handleConnect = (ip, port) => {
    const ws = new WebSocket(
      `ws://localhost:8081/?ip=${encodeURIComponent(
        ip
      )}&port=${encodeURIComponent(port)}`
    );

    ws.onopen = () => {
      setIsConnected(true);
      setWsConnection(ws);
      setConnectionTime(new Date());
      toast.success(`🚀 Connected to ${ip}:${port}!`);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "status":
          setIsConnected(data.connected);
          if (!data.connected) {
            toast.error("⚠️ Connection to ESP32 lost!");
          }
          break;
        case "pong":
          // Calculate latency from ping timestamp
          const latency = Date.now() - data.timestamp;
          setLatency(latency);
          break;
        case "error":
          toast.error(`❌ ${data.message}`);
          break;
        case "esp32Data":
          // Handle any data coming from ESP32
          console.log("ESP32 data:", data.data);
          break;
      }
    };

    ws.onerror = (error) => {
      toast.error("🔥 WebSocket error occurred");
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
      setWsConnection(null);
      toast.error("🔌 Connection closed");
    };

    // Start latency monitoring using a simple ping message
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        const pingTime = Date.now();
        ws.send(JSON.stringify({ type: "ping", timestamp: pingTime }));
      }
    }, 1000);

    return () => clearInterval(pingInterval);
  };

  const handleCommand = (command, speed) => {
    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify({ cmd: command, speed }));
      setCurrentCommand(command);
    }
  };

  const handleDisconnect = () => {
    if (wsConnection) {
      wsConnection.close();
      setIsConnected(false);
      setWsConnection(null);
      setConnectionTime(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white font-poppins overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-neon-blue rounded-full mix-blend-multiply filter blur-3xl opacity-5"
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-neon-green rounded-full mix-blend-multiply filter blur-3xl opacity-5"
          animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-orbitron font-black mb-3 tracking-widest">
            <span className="bg-gradient-to-r from-neon-blue via-neon-green to-neon-blue bg-clip-text text-transparent">
              🤖 ROBOT CONTROLLER
            </span>
          </h1>
          <p className="text-gray-400 font-light text-lg tracking-wide">
            WiFi-enabled ESP32 Vehicle Control System
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isConnected ? (
            <motion.div
              key="connect"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ConnectForm onConnect={handleConnect} />
            </motion.div>
          ) : (
            <motion.div
              key="control"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 flex justify-between items-center">
                <motion.button
                  onClick={handleDisconnect}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-orbitron font-bold hover:from-red-700 hover:to-red-900 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔌 Disconnect
                </motion.button>
              </div>
              <ControlPanel onCommand={handleCommand} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Status */}
        <StatusBar
          isConnected={isConnected}
          currentCommand={currentCommand}
          latency={latency}
          connectionTime={connectionTime}
        />
      </div>
    </div>
  );
}

export default App;
