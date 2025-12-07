# WiFi Robot Controller - Backend

The backend component of the WiFi Robot Controller project, providing a WebSocket to TCP bridge for controlling an ESP32-based robot car.

## 🚀 Features

- WebSocket server for browser communication
- TCP client for ESP32 communication
- Real-time message bridging
- Connection state management
- Status monitoring API
- Automatic reconnection handling
- Comprehensive logging

## 🛠️ Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the server:

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The server will start on port 8081 by default.

## 📡 API Endpoints

### WebSocket

Connect to `ws://localhost:8081?ip=<ESP_IP>&port=<ESP_PORT>`

### HTTP

- `GET /status` - Get server status
  ```json
  {
    "uptime": "15m 22s",
    "esp32Connected": true,
    "clientsConnected": 2
  }
  ```

## 🔄 Communication Protocol

### From Frontend to Backend (WebSocket)

```json
{
  "cmd": "F", // Command: F/B/L/R/S (Forward/Backward/Left/Right/Stop)
  "speed": 80 // Speed: 0-100
}
```

### From Backend to ESP32 (TCP)

```
"F80\n"   // Format: <command><speed>\n
```

## ⚙️ Configuration

Default port: 8081
Environment variables:

- `PORT`: Server port (default: 8081)
- `LOG_LEVEL`: Logging level (default: "info")

## 🔍 Logging

The server logs all significant events:

- Client connections/disconnections
- ESP32 connection states
- Command transmissions
- Errors and warnings

## 🔒 Error Handling

- Automatic reconnection to ESP32
- WebSocket connection timeouts
- Invalid command validation
- TCP connection error recovery
