import network
import socket
from machine import Pin
from time import sleep

# --- Motor Control Pins ---
IN1 = Pin(19, Pin.OUT)
IN2 = Pin(21, Pin.OUT)
IN3 = Pin(22, Pin.OUT)
IN4 = Pin(23, Pin.OUT)

# --- Optional control pins (like lights) ---
CONT1 = Pin(16, Pin.OUT)
CONT2 = Pin(14, Pin.OUT)

# --- Wi-Fi Access Point Setup ---
SSID = "RC_AMBULANCE"
PASSWORD = "ambulance123"
PORT = 5006

# Initialize AP
ap = network.WLAN(network.AP_IF)
ap.active(True)
ap.config(essid=SSID, password=PASSWORD, authmode=3)

print("=" * 50)
print("WiFi Robot Controller - ESP32")
print("=" * 50)
print("Access Point: " + SSID)
print("Password: " + PASSWORD)
print("Port: " + str(PORT))

# Wait for AP to be active
max_wait = 20
while not ap.active() and max_wait > 0:
    print("Waiting for AP to activate...", max_wait)
    sleep(0.5)
    max_wait -= 1

if ap.active():
    print("✓ Access Point ACTIVE")
    print("IP Address: " + ap.ifconfig()[0])
else:
    print("✗ Failed to activate AP")

# --- Movement functions ---
def forward():
    IN1.value(1); IN2.value(0)
    IN3.value(1); IN4.value(0)
    print("→ Forward")
    log_pin_state()

def backward():
    IN1.value(0); IN2.value(1)
    IN3.value(0); IN4.value(1)
    print("← Backward")
    log_pin_state()

def rotate_left():
    IN1.value(0); IN2.value(1)
    IN3.value(1); IN4.value(0)
    print("↶ Rotate Left")
    log_pin_state()

def rotate_right():
    IN1.value(1); IN2.value(0)
    IN3.value(0); IN4.value(1)
    print("↷ Rotate Right")
    log_pin_state()

def stop():
    IN1.value(0); IN2.value(0)
    IN3.value(0); IN4.value(0)
    print("⏹ Stop")
    log_pin_state()


def log_pin_state():
    try:
        s = "PIN STATES -> IN1:%d IN2:%d IN3:%d IN4:%d" % (
            IN1.value(), IN2.value(), IN3.value(), IN4.value()
        )
        print(s)
    except Exception as e:
        print("Error reading pin states:", e)

def control_light1(state):
    CONT1.value(1 if state else 0)
    print("💡 Light 1:", "ON" if state else "OFF")

def control_light2(state):
    CONT2.value(1 if state else 0)
    print("💡 Light 2:", "ON" if state else "OFF")

# --- Command Map ---
COMMANDS = {
    "F": forward,
    "B": backward,
    "L": rotate_left,
    "R": rotate_right,
    "S": stop,
    "Q": lambda: control_light1(True),
    "q": lambda: control_light1(False),
    "W": lambda: control_light2(True),
    "w": lambda: control_light2(False)
}

# --- TCP Socket Server with error handling ---
print("\nStarting TCP Server...")
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

try:
    s.bind(("", PORT))
    s.listen(1)
    print("✓ Server listening on port " + str(PORT))
    print("\nWaiting for connections...")
    print("-" * 50)
    
    while True:
        try:
            conn, addr = s.accept()
            print("\n✓ Client connected from " + str(addr[0]) + ":" + str(addr[1]))
            
            # Set timeout for receive operations
            conn.settimeout(5.0)
            
            try:
                while True:
                    try:
                        data = conn.recv(1024)
                        if not data:
                            print("✗ Client closed connection")
                            break
                        
                        cmd = data.decode().strip()
                        print("📨 Received: '" + cmd + "'")
                        
                        # Process only the first character
                        if len(cmd) > 0 and cmd[0] in COMMANDS:
                            print("→ Executing: " + cmd[0])
                            COMMANDS[cmd[0]]()
                        else:
                            print("⚠ Unknown command: " + cmd)
                    
                    except socket.timeout:
                        # Continue on timeout (no data received yet)
                        continue
                    except Exception as e:
                        print("✗ Error receiving data: " + str(e))
                        break
            
            except Exception as e:
                print("✗ Connection error: " + str(e))
            
            finally:
                conn.close()
                stop()  # Stop motors when client disconnects
                print("✗ Client disconnected\n")
        
        except Exception as e:
            print("✗ Accept error: " + str(e))
            sleep(1)

except KeyboardInterrupt:
    print("\n\n⚠ Keyboard interrupt detected!")

except Exception as e:
    print("✗ Server error: " + str(e))

finally:
    print("\nShutting down...")
    stop()
    s.close()
    ap.active(False)
    print("✓ Cleanup complete. Program exited.")
