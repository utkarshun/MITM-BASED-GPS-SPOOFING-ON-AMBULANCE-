const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const net = require("net");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Global state
const state = {
  startTime: Date.now(),
  esp32Connected: false,
  clientsConnected: 0,
  tcpClient: null,
  esp32Config: {
    ip: null,
    port: null,
  },
};

// Utility to format uptime
const formatUptime = () => {
  const uptime = Math.floor((Date.now() - state.startTime) / 1000);
  const minutes = Math.floor(uptime / 60);
  const seconds = uptime % 60;
  return `${minutes}m ${seconds}s`;
};

// Status endpoint
app.get("/status", (req, res) => {
  res.json({
    uptime: formatUptime(),
    esp32Connected: state.esp32Connected,
    clientsConnected: state.clientsConnected,
  });
});

// Handle WebSocket connections
wss.on("connection", (ws, req) => {
  // Parse connection parameters
  const params = new URLSearchParams(req.url.split("?")[1]);
  const ip = params.get("ip");
  const port = parseInt(params.get("port"));

  if (!ip || !port) {
    ws.close(1008, "Missing IP or port parameters");
    return;
  }

  state.clientsConnected++;
  console.log(
    `New WebSocket client connected. Total clients: ${state.clientsConnected}`
  );

  // Set up TCP connection to ESP32
  const connectToESP32 = () => {
    if (state.tcpClient) {
      state.tcpClient.destroy();
    }

    state.esp32Config = { ip, port };
    state.tcpClient = new net.Socket();

    state.tcpClient.connect(port, ip, () => {
      state.esp32Connected = true;
      ws.send(JSON.stringify({ type: "status", connected: true }));
      console.log(`Connected to ESP32 at ${ip}:${port}`);
    });

    state.tcpClient.on("data", (data) => {
      try {
        ws.send(JSON.stringify({ type: "esp32Data", data: data.toString() }));
      } catch (err) {
        console.error("Error sending ESP32 data to WebSocket:", err);
      }
    });

    state.tcpClient.on("error", (err) => {
      console.error("TCP connection error:", err);
      state.esp32Connected = false;
      ws.send(
        JSON.stringify({ type: "status", connected: false, error: err.message })
      );
    });

    state.tcpClient.on("close", () => {
      state.esp32Connected = false;
      ws.send(JSON.stringify({ type: "status", connected: false }));
      console.log("TCP connection closed");

      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) {
          console.log("Attempting to reconnect to ESP32...");
          connectToESP32();
        }
      }, 5000);
    });
  };

  // Initial connection
  connectToESP32();

  // Handle incoming WebSocket messages
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      // Handle ping messages
      if (data.type === "ping") {
        ws.send(JSON.stringify({ type: "pong", timestamp: data.timestamp }));
        return;
      }

      // Only process command messages
      if (!data.cmd) {
        console.warn("Ignoring non-command message:", data);
        return;
      }

      // Validate command format
      // NOTE: Validation requires speed, but the ESP32 code ignores it.
      if (
        typeof data.speed !== "number" ||
        !["F", "B", "L", "R", "S", "Q", "q", "W", "w"].includes(data.cmd) ||
        data.speed < 0 ||
        data.speed > 100
      ) {
        throw new Error("Invalid command format");
      }

      // *** FIX 2: Send ONLY the command character and a newline ***
      const command = `${data.cmd}\n`;

      if (state.tcpClient && state.esp32Connected) {
        state.tcpClient.write(command);
        console.log("Sent command to ESP32:", command.trim());
      } else {
        console.warn("Cannot send command - ESP32 not connected");
        ws.send(
          JSON.stringify({ type: "error", message: "ESP32 not connected" })
        );
      }
    } catch (err) {
      console.error("Error processing message:", err);
      ws.send(JSON.stringify({ type: "error", message: err.message }));
    }
  });

  // Set up heartbeat
  const heartbeat = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    }
  }, 30000);

  // Clean up on connection close
  ws.on("close", () => {
    state.clientsConnected--;
    console.log(
      `WebSocket client disconnected. Remaining clients: ${state.clientsConnected}`
    );
    clearInterval(heartbeat);

    // If this was the last client, close TCP connection
    if (state.clientsConnected === 0 && state.tcpClient) {
      state.tcpClient.destroy();
      state.tcpClient = null;
      state.esp32Connected = false;
    }
  });

  // Handle pong responses
  ws.on("pong", () => {
    ws.isAlive = true;
  });
});

// Start server
const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
