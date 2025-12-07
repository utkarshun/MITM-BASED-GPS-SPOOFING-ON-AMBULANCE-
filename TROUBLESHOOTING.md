# Troubleshooting Checklist

## Step 1: Check WiFi Connection

1. On your laptop, open WiFi settings
2. Look for network "RC_AMBULANCE"
3. **You MUST be connected to RC_AMBULANCE**, not your home WiFi
4. If not connected, connect now with password: `ambulance123`

## Step 2: Verify ESP32 is Running

1. Power on your ESP32
2. Wait 10 seconds for it to boot
3. Check if "RC_AMBULANCE" WiFi appears in your WiFi list
4. If not appearing:
   - Reboot the ESP32
   - Check if the code is uploaded correctly
   - Verify the code is set to AP mode

## Step 3: Test Connection Manually

1. Open Command Prompt on your laptop
2. Run: `ping 192.168.4.1`
3. You should see replies (not timeouts)
4. If timeout, you're not on the ESP32's WiFi

## Step 4: Check Backend Logs

Look at your terminal running `node server.js`:

- "Sent command to ESP32: R80" = Backend is sending commands ✓
- "TCP connection error: connect ETIMEDOUT" = Backend CANNOT reach ESP32 ✗

## Step 5: If Still Not Working

1. Disconnect from ESP32 WiFi
2. Power off ESP32
3. Wait 10 seconds
4. Power on ESP32
5. Wait 10 seconds
6. Connect laptop to RC_AMBULANCE WiFi
7. Verify with ping 192.168.4.1
8. Try again

## Key Point

The error "ETIMEDOUT 192.168.1:5006" should be "192.168.4.1:5006"
This suggests the IP might be wrong OR the ESP32 crashed.
