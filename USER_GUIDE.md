# WiFi Robot Controller - User Guide

## 📋 Complete Setup Guide

### Prerequisites

- Node.js 16.x or higher installed on your computer
- ESP32 robot car with WiFi capabilities
- ESP32 programmed with TCP server capability (port configurable)
- Computer and ESP32 on the same WiFi network

### 1️⃣ Hardware Setup

1. Power on your ESP32 robot car
2. Connect your ESP32 to your WiFi network
3. Note down the ESP32's IP address (usually displayed on the device's display if available, or check your router's connected devices)
4. Ensure the ESP32's TCP server is running and note the port number (default is usually 8080)

### 2️⃣ Software Setup

#### Backend Setup

1. Open a terminal/command prompt
2. Navigate to the backend folder:
   ```bash
   cd wifi-robot-controller/backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```
5. You should see a message: "Server running on port 8081"

#### Frontend Setup

1. Open a new terminal/command prompt
2. Navigate to the frontend folder:
   ```bash
   cd wifi-robot-controller/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. You should see a URL (typically http://localhost:5173)

### 3️⃣ Connecting to the Robot

1. Open your web browser and go to http://localhost:5173
2. You'll see the connection page with two input fields:
   - ESP32 IP Address field
   - Port Number field
3. Enter your ESP32's IP address (e.g., 192.168.1.100)
4. Enter the TCP server port number (e.g., 8080)
5. Click "Connect to Robot"

### 4️⃣ Controlling the Robot

Once connected, you'll see the control dashboard with:

1. **Control Options**:

   - Direction buttons (▲ Forward, ▼ Backward, ◄ Left, ► Right, ■ Stop)
   - Optional joystick control (toggle with button)
   - Speed slider (0-100%)

2. **3D Visualization**:

   - Shows real-time representation of robot movement
   - Can be rotated for different viewing angles

3. **Status Bar**:
   - Connection status indicator
   - Current command display
   - Network latency monitor

### 🔍 Troubleshooting

1. **Can't Connect to ESP32**:

   - Verify ESP32 is powered on
   - Confirm ESP32 and computer are on same WiFi network
   - Double-check IP address and port
   - Try pinging the ESP32 IP address

2. **Backend Server Issues**:

   - Ensure port 8081 is not in use
   - Check if Node.js is installed correctly
   - Look for error messages in terminal

3. **Frontend Not Loading**:

   - Verify npm install completed successfully
   - Check browser console for errors
   - Try different browser

4. **Control Not Responding**:
   - Check connection status in status bar
   - Verify ESP32 is receiving commands (check its logs)
   - Check network latency for connection issues

### 📝 Command Reference

Robot commands are sent in this format:

- Forward: F + speed (e.g., "F80")
- Backward: B + speed (e.g., "B60")
- Left: L + speed (e.g., "L50")
- Right: R + speed (e.g., "R50")
- Stop: S + 0 (e.g., "S0")

### 🔒 Security Notes

1. This system is designed for local network use only
2. Ensure your WiFi network is secure
3. Don't expose the backend server to the internet
4. Keep your ESP32 firmware updated

### 🔄 Shutdown Procedure

1. Stop the robot (click Stop button)
2. Close the browser window
3. Stop the frontend server (Ctrl+C in frontend terminal)
4. Stop the backend server (Ctrl+C in backend terminal)
5. Power off the ESP32 robot

### 💡 Tips

- Save commonly used IP/port combinations (automatically saved in browser)
- Start with lower speeds when testing
- Use the 3D visualization to understand robot movement
- Monitor network latency for optimal performance
- Use joystick control for smoother movement
