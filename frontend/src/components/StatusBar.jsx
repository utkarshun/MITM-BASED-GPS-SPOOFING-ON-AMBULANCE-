import React, { useMemo } from "react";
import { motion } from "framer-motion";

function StatusBar({ isConnected, currentCommand, latency, connectionTime }) {
  const commandMap = {
    F: "Forward",
    B: "Backward",
    L: "Left",
    R: "Right",
    S: "Stop",
  };

  const uptime = useMemo(() => {
    if (!connectionTime) return "-";
    const seconds = Math.floor((Date.now() - connectionTime.getTime()) / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  }, [connectionTime]);

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t-4 border-hospital-red"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div
              className={`w-4 h-4 rounded-full ${
                isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <div>
              <div className="font-bold text-hospital-dark">
                {isConnected ? "✓ CONNECTED" : "✗ DISCONNECTED"}
              </div>
              <div className="text-xs text-hospital-gray">Uptime: {uptime}</div>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs">
            <div>
              <div className="text-hospital-gray font-semibold mb-1">
                Last Command
              </div>
              <div className="font-bold text-hospital-blue">
                {commandMap[currentCommand] || "—"}
              </div>
            </div>

            <div>
              <div className="text-hospital-gray font-semibold mb-1">
                Network Latency
              </div>
              <div
                className={`font-bold ${
                  latency > 200 ? "text-hospital-red" : "text-green-600"
                }`}
              >
                {latency}ms
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default StatusBar;
