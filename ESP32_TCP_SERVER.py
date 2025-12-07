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
# Ensure this password is in your wordlist (e.g., 'ambulance123')
PASSWORD = "ambulance123" 
PORT = 5006

# Set to WPA-PSK (authmode=2) for easier deauth demonstration
ap = network.WLAN(network.AP_IF)
ap.active(True)
ap.config(essid=SSID, password=PASSWORD, authmode=2) 
print("Access Point started. SSID:", SSID)
print("Waiting for connection...")
while not ap.active():
    pass
print("AP active, IP:", ap.ifconfig()[0])

# --- Movement functions ---
def forward():
    IN1.value(1); IN2.value(0)
    IN3.value(1); IN4.value(0)
    print("Forward")

def backward():
    IN1.value(0); IN2.value(1)
    IN3.value(0); IN4.value(1)
    print("Backward")

def rotate_left():
    IN1.value(0); IN2.value(1)
    IN3.value(1); IN4.value(0)
    print("Rotate Left")

def rotate_right():
    IN1.value(1); IN2.value(0)
    IN3.value(0); IN4.value(1)
    print("Rotate Right")

def stop():
    IN1.value(0); IN2.value(0)
    IN3.value(0); IN4.value(0)
    print("Stop")

def control(cmd):
    if cmd == "Q":
        CONT1.value(1)
    elif cmd == "q":
        CONT1.value(0)
    elif cmd == "W":
        CONT2.value(1)
    elif cmd == "w":
        CONT2.value(0)

# --- Command Map ---
COMMANDS = {
    "F": forward,
    "B": backward,
    "L": rotate_left,
    "R": rotate_right,
    "S": stop,
    "Q": lambda: control("Q"),
    "q": lambda: control("q"),
    "W": lambda: control("W"),
    "w": lambda: control("w")
}

# --- TCP Socket Server ---
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(("", PORT))
s.listen(1)
print("Server listening on port", PORT)

try:
    while True:
        conn, addr = s.accept()
        print("Client connected from", addr)
        
        # FIX: Set a timeout (5 seconds) to recover from sudden disconnects (deauths)
        conn.settimeout(5.0) 
        
        try:
            while True:
                data = conn.recv(1024)
                if not data:
                    break
                cmd = data.decode().strip()
                
                # The Node.js server now sends only the single character (e.g., 'F\n')
                if len(cmd) > 0 and cmd[0] in COMMANDS:
                    COMMANDS[cmd[0]]()
                else:
                    print("Unknown command:", cmd)
                    
        except socket.timeout:
            # FIX: If the connection is broken (deauth), the timeout exception is caught here
            print("Connection timed out (Likely deauthed or lost signal).")
            
        except Exception as e:
            print("Error during data reception:", e)
            
        finally:
            conn.close()
            stop()
            print("Client disconnected")

except KeyboardInterrupt:
    print("\nKeyboard interrupt detected. Stopping motors and closing socket...")
    stop()
    s.close()
    ap.active(False)
    print("WiFi AP disabled. Program exited cleanly.")