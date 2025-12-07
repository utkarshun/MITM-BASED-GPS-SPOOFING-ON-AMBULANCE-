
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

ap = network.WLAN(network.AP_IF)
ap.active(True)
ap.config(essid=SSID, password=PASSWORD, authmode=3)
print("Access Point started. SSID:", SSID)
print("Waiting for connection...")
while not ap.active():
    pass
print("AP active, IP:", ap.ifconfig()[0])

# --- Test all pins ---
print("\n=== GPIO PIN TEST ===")
test_pins = [
    ("IN1 (19)", IN1),
    ("IN2 (21)", IN2),
    ("IN3 (22)", IN3),
    ("IN4 (23)", IN4),
    ("CONT1 (16)", CONT1),
    ("CONT2 (14)", CONT2),
]

for name, pin in test_pins:
    pin.value(1)
    print(f"✓ {name} = ON  (value={pin.value()})")
    sleep(0.2)
    pin.value(0)
    print(f"✓ {name} = OFF (value={pin.value()})")
    sleep(0.2)

print("\n=== All pins tested successfully! ===\n")

# --- Movement functions ---
def forward():
    IN1.value(1)
    IN2.value(0)
    IN3.value(1)
    IN4.value(0)
    print("[MOTOR] Forward - IN1=1, IN2=0, IN3=1, IN4=0")

def backward():
    IN1.value(0)
    IN2.value(1)
    IN3.value(0)
    IN4.value(1)
    print("[MOTOR] Backward - IN1=0, IN2=1, IN3=0, IN4=1")

def rotate_left():
    IN1.value(0)
    IN2.value(1)
    IN3.value(1)
    IN4.value(0)
    print("[MOTOR] Rotate Left - IN1=0, IN2=1, IN3=1, IN4=0")

def rotate_right():
    IN1.value(1)
    IN2.value(0)
    IN3.value(0)
    IN4.value(1)
    print("[MOTOR] Rotate Right - IN1=1, IN2=0, IN3=0, IN4=1")

def stop():
    IN1.value(0)
    IN2.value(0)
    IN3.value(0)
    IN4.value(0)
    print("[MOTOR] Stop - All pins = 0")

def control_light1(state):
    CONT1.value(1 if state else 0)
    print(f"[LIGHT1] {'ON' if state else 'OFF'}")

def control_light2(state):
    CONT2.value(1 if state else 0)
    print(f"[LIGHT2] {'ON' if state else 'OFF'}")

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

# --- TCP Socket Server ---
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(("", PORT))
s.listen(1)
print(f"Server listening on port {PORT}")
print("Waiting for connections...\n")

try:
    while True:
        conn, addr = s.accept()
        print(f"\n[CONNECTION] Client connected from {addr[0]}:{addr[1]}")
        try:
            while True:
                data = conn.recv(1024)
                if not data:
                    print("[CONNECTION] Client sent empty data (disconnecting)")
                    break
                
                cmd = data.decode().strip()
                print(f"[RECEIVED] Raw command: '{cmd}'")
                
                # Only use the first character for command
                if len(cmd) > 0 and cmd[0] in COMMANDS:
                    print(f"[EXECUTE] Running command: {cmd[0]}")
                    COMMANDS[cmd[0]]()
                    # send acknowledgement back to the client
                    try:
                        conn.send(b"OK\n")
                    except Exception as _:
                        # If send fails, just continue (debug only)
                        pass
                else:
                    print(f"[ERROR] Unknown command: {cmd}")
                    try:
                        conn.send(b"ERR\n")
                    except Exception:
                        pass
                    
        except Exception as e:
            print(f"[ERROR] Connection error: {e}")
        finally:
            conn.close()
            stop()
            print("[CONNECTION] Client disconnected\n")

except KeyboardInterrupt:
    print("\n[SHUTDOWN] Keyboard interrupt detected...")
    stop()
    s.close()
    ap.active(False)
    print("[SHUTDOWN] WiFi AP disabled. Program exited cleanly.")
