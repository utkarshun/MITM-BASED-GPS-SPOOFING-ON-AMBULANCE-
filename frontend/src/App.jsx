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
    return () => {
      if (wsConnection) wsConnection.close();
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
      if (data.type === "status") {
        setIsConnected(data.connected);
        if (!data.connected) toast.error("⚠️ Connection to ESP32 lost!");
      }
      if (data.type === "pong") setLatency(Date.now() - data.timestamp);
      if (data.type === "error") toast.error(`❌ ${data.message}`);
      if (data.type === "esp32Data") console.log("ESP32:", data.data);
    };

    ws.onerror = () => {
      toast.error("🔥 WebSocket error");
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
      setWsConnection(null);
      toast.info("🔌 Disconnected");
    };

    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN)
        ws.send(JSON.stringify({ type: "ping", timestamp: Date.now() }));
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
    if (wsConnection) wsConnection.close();
    setIsConnected(false);
    setWsConnection(null);
    setConnectionTime(null);
  };

  return (
    <div className="min-h-screen bg-hospital-white text-hospital-dark font-poppins overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-hospital-red rounded-full mix-blend-multiply filter blur-3xl opacity-3"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-hospital-blue rounded-full mix-blend-multiply filter blur-3xl opacity-3"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
        />
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div className="container mx-auto px-4 py-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-hospital-dark">
            🚑 AMBULANCE CONTROL SYSTEM
          </h1>
          <p className="text-hospital-gray text-sm font-medium tracking-tight">
            Medical Navigation & Mobility Control
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
              <div className="mb-6 flex justify-end">
                <motion.button
                  onClick={handleDisconnect}
                  className="px-5 py-2 bg-hospital-red text-white rounded-lg font-bold text-sm hover:bg-red-700 shadow-md border border-red-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  DISCONNECT
                </motion.button>
              </div>
              <ControlPanel onCommand={handleCommand} />
            </motion.div>
          )}
        </AnimatePresence>

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
