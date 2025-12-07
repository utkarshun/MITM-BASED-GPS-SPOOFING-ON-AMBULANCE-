#!/usr/bin/env node
// Simple TCP command sender for WiFi Robot Controller (for manual testing)
// Usage:
// 1) Send single command:
//    node send_command.js <HOST> <PORT> <CMD>
//    e.g. node send_command.js 192.168.4.1 5006 R
// 2) Interactive mode (enter commands):
//    node send_command.js <HOST> <PORT>
//    Enter lines like: F or R or S

const net = require("net");
const readline = require("readline");

const [, , host, portArg, maybeCmd, maybeSpeed] = process.argv;
if (!host || !portArg) {
  console.log("Usage: node send_command.js <HOST> <PORT> [CMD] [SPEED]");
  process.exit(1);
}
const port = parseInt(portArg, 10);

function makeMessage(cmd, speed) {
  // ensure single-letter command
  cmd = String(cmd || "")
    .trim()
    .toUpperCase();
  if (!cmd) return null;
  const c = cmd[0];

  // *** FIX 3: Send ONLY the command character + newline ***
  return `${c}\n`;
}

const socket = new net.Socket();
socket.setEncoding("utf8");

socket.on("connect", () => {
  console.log(`Connected to ${host}:${port}`);
  if (maybeCmd) {
    // single-shot mode
    // If --hold flag provided as 4th arg, keep connection open and wait for response
    const hold = process.argv.includes("--hold");
    const msg = makeMessage(maybeCmd, maybeSpeed || "");
    if (!msg) {
      console.error("Invalid command");
      socket.end();
      return;
    }
    console.log("Sending:", msg.trim());
    socket.write(msg);
    if (hold) {
      console.log(
        "Hold mode: keeping connection open to receive responses. Press Ctrl+C to exit."
      );
      return;
    }
    // wait a bit for any response then close
    setTimeout(() => socket.end(), 2000);
    return;
  }

  // interactive mode
  console.log("Interactive mode. Type commands like: F or R or S");
  console.log("Type 'quit' or Ctrl+C to exit.");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.on("line", (line) => {
    const t = line.trim();
    if (!t) return;
    if (t.toLowerCase() === "quit" || t.toLowerCase() === "exit") {
      rl.close();
      socket.end();
      return;
    }
    // allow input like: F 80 or just F
    const parts = t.split(/\s+/);
    const cmd = parts[0];
    const speed = parts[1] || "";
    const msg = makeMessage(cmd, speed);
    if (!msg) {
      console.log("Invalid input. Example: F");
      return;
    }
    console.log("Sending:", msg.trim());
    socket.write(msg);
  });
});

socket.on("data", (data) => {
  console.log("Received from ESP32:", data.toString().trim());
});

socket.on("error", (err) => {
  console.error("Socket error:", err.message || err);
});

socket.on("close", (hadErr) => {
  console.log("Connection closed", hadErr ? "due to error" : "");
  process.exit(0);
});

console.log(`Connecting to ${host}:${port} ...`);
socket.connect(port, host);
