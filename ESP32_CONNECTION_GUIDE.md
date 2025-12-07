# ESP32 Connection Guide

## Method 1: Connect via ESP32's Access Point (AP Mode)

This is the easiest method where the ESP32 creates its own WiFi network.

### Steps:

1. **Power on your ESP32**

   - Connect power to your ESP32 robot
   - Wait for it to boot up (usually takes 5-10 seconds)

2. **Find ESP32's WiFi Network**

   - On your laptop, open WiFi settings
   - Look for a network named something like "ESP32_Robot" or similar
   - The default password is usually "12345678" (check your ESP32's documentation)

3. **Connect to ESP32's Network**

   - Click on the ESP32's WiFi network
   - Enter the password
   - Wait for connection to establish

4. **Get the IP Address**

   - When in AP mode, ESP32's IP address is usually `192.168.4.1`
   - The TCP server port is usually `5006` (this depends on your ESP32's firmware)

5. **Test Connection**
   - Open Command Prompt (Windows) or Terminal (Mac/Linux)
   - Type: `ping 192.168.4.1`
   - You should see replies if connection is successful

## Method 2: Connect via Home WiFi Network

This method connects both your laptop and ESP32 to your home WiFi.

### Steps:

1. **Program ESP32 with WiFi Credentials**

   - You need to program your ESP32 with your home WiFi details
   - Upload code that includes your WiFi SSID and password

2. **Connect Laptop to Home WiFi**

   - Make sure your laptop is connected to the same WiFi network

3. **Find ESP32's IP Address**

   - Method 1: Check your router's connected devices list
   - Method 2: Use an IP scanner app
   - Method 3: ESP32 might display its IP on LED/LCD if equipped

4. **Test Connection**
   - Ping the ESP32's IP address to verify connection
   - Note down the IP address for use in the control interface

## Troubleshooting

### If Connection Fails:

1. **Power Cycle**

   - Turn off ESP32
   - Wait 10 seconds
   - Turn it back on
   - Try connecting again

2. **Check WiFi Signal**

   - Keep ESP32 and laptop within 10 meters
   - Avoid metal obstacles between them

3. **Verify Settings**

   - Double-check WiFi password
   - Ensure you're connecting to the correct network
   - Verify the TCP server port number

4. **Firewall Settings**
   - Temporarily disable Windows Firewall
   - If it works, add an exception for the application

## Using the Control Interface

1. **Start the Backend Server**

   ```powershell
   cd wifi-robot-controller/backend
   node server.js
   ```

2. **Start the Frontend**

   ```powershell
   cd wifi-robot-controller/frontend
   npm run dev
   ```

3. **Connect to ESP32**
   - Open http://localhost:5173 in your browser
   - Enter ESP32's IP address (e.g., 192.168.4.1)
   - Enter TCP server port (e.g., 5006)
   - Click Connect

## Common IP Addresses

- AP Mode: 192.168.4.1 (most common)
- Home Network: Usually 192.168.1.x or 192.168.0.x

## Common Port Numbers

- Default TCP Server: 5006
- Alternative: 8080, 3232

## Safety Tips

1. Keep a backup of your ESP32's firmware
2. Don't expose your ESP32 to public networks
3. Change default passwords if possible
4. Keep your ESP32 updated
