import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function ConnectForm({ onConnect }) {
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");

  useEffect(() => {
    // Load last used values from localStorage
    const lastIp = localStorage.getItem("lastIp");
    const lastPort = localStorage.getItem("lastPort");
    if (lastIp) setIp(lastIp);
    if (lastPort) setPort(lastPort);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save values to localStorage
    localStorage.setItem("lastIp", ip);
    localStorage.setItem("lastPort", port);
    onConnect(ip, parseInt(port));
  };

  return (
    <motion.div
      className="max-w-md mx-auto bg-dark-glass backdrop-glass p-8 rounded-xl shadow-xl"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="ip"
            className="block text-sm font-medium text-neon-blue mb-2"
          >
            ESP32 IP Address
          </label>
          <input
            type="text"
            id="ip"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.100"
            pattern="^(\d{1,3}\.){3}\d{1,3}$"
            required
            className="w-full bg-light-glass backdrop-glass text-white px-4 py-2 rounded-lg border border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue"
          />
        </div>

        <div>
          <label
            htmlFor="port"
            className="block text-sm font-medium text-neon-blue mb-2"
          >
            Port Number
          </label>
          <input
            type="number"
            id="port"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            placeholder="8080"
            min="1"
            max="65535"
            required
            className="w-full bg-light-glass backdrop-glass text-white px-4 py-2 rounded-lg border border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue"
          />
        </div>

        <motion.button
          type="submit"
          className="w-full bg-neon-blue text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors hover:bg-neon-green"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Connect to Robot
        </motion.button>
      </form>
    </motion.div>
  );
}

export default ConnectForm;
