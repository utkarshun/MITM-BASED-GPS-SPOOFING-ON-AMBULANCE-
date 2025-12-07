"""
ESP32 TCP server (STA mode) - MicroPython
- Connects to your home WiFi (2.4GHz)
- Starts a TCP server on PORT (default 5006)
- Processes commands: F,B,L,R,S (first char used) with optional numeric value (e.g. "F80")
- Sends acknowledgement: `OK\n` for handled commands, `ERR\n` for unknown input
- Prints detailed debug logs to serial

Usage:
- Edit `SSID` and `PASSWORD` values below
- Upload to ESP32 and run (via Thonny / ampy / rshell)
- Serial monitor will print IP; use that IP in the frontend/backend
"""

import network
import socket
import time
from machine import Pin

# --- Edit these ---
SSID = "YOUR_HOME_SSID"
PASSWORD = "YOUR_HOME_PASSWORD"
PORT = 5006

# --- Motor Control Pins (adjust if needed) ---
IN1 = Pin(19, Pin.OUT)
IN2 = Pin(21, Pin.OUT)
IN3 = Pin(22, Pin.OUT)
IN4 = Pin(23, Pin.OUT)

# Optional enable pins on some motor drivers (uncomment and set if used)
# ENA = Pin(32, Pin.OUT)
# ENB = Pin(33, Pin.OUT)
# ENA.value(1); ENB.value(1)

# --- Movement functions ---

def forward():
    IN1.value(1); IN2.value(0)
    IN3.value(1); IN4.value(0)
    print("[MOTOR] Forward -> IN1=1 IN2=0 | IN3=1 IN4=0")

def backward():
    IN1.value(0); IN2.value(1)
    IN3.value(0); IN4.value(1)
    print("[MOTOR] Backward -> IN1=0 IN2=1 | IN3=0 IN4=1")

def rotate_left():
    IN1.value(0); IN2.value(1)
    IN3.value(1); IN4.value(0)
    print("[MOTOR] Rotate Left -> IN1=0 IN2=1 | IN3=1 IN4=0")

def rotate_right():
    IN1.value(1); IN2.value(0)
    IN3.value(0); IN4.value(1)
    print("[MOTOR] Rotate Right -> IN1=1 IN2=0 | IN3=0 IN4=1")

def stop():
    IN1.value(0); IN2.value(0)
    IN3.value(0); IN4.value(0)
    print("[MOTOR] Stop -> All pins 0")

COMMANDS = {
    'F': forward,
    'B': backward,
    'L': rotate_left,
    'R': rotate_right,
    'S': stop
}

# --- Connect to WiFi (STA mode) ---
sta = network.WLAN(network.STA_IF)
sta.active(True)

if not sta.isconnected():
    print('Connecting to WiFi:', SSID)
    sta.connect(SSID, PASSWORD)
    # wait up to 20 seconds
    t = 20
    while not sta.isconnected() and t > 0:
        time.sleep(1)
        t -= 1

if sta.isconnected():
    print('Connected to WiFi')
    print('IP:', sta.ifconfig()[0])
else:
    print('Failed to connect to WiFi - falling back to AP mode')
    # Optional: fallback to AP (not implemented here)

# Helper to get IP address string (or None)
def get_ip():
    try:
        return sta.ifconfig()[0]
    except Exception:
        return None

# --- TCP Server ---
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
addr = ('', PORT)
try:
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
except Exception:
    pass
s.bind(addr)
s.listen(1)
print('TCP server listening on port', PORT)

def start_server():
    """Start the TCP server and accept connections."""
    try:
        while True:
            print('Waiting for client... (IP {})'.format(get_ip()))
        conn, addr = s.accept()
        print('Client connected from', addr)
        # use a generous timeout so long-running clients can keep connection
        conn.settimeout(30.0)
        try:
            buffer = b""
            while True:
                try:
                    data = conn.recv(1024)
                except Exception as e:
                    print('Recv error:', e)
                    break
                if not data:
                    print('Client closed connection')
                    break
                buffer += data
                # split by newline or treat any whitespace-separated token as command
                parts = buffer.split(b'\n')
                # keep last partial chunk in buffer
                buffer = parts.pop() if parts else b''
                for part in parts:
                    try:
                        msg = part.decode().strip()
                    except Exception:
                        msg = ''
                    if not msg:
                        continue
                    print('Received raw:', repr(msg))
                    # Basic: first non-space char is command
                    cmd = msg[0].upper()
                    if cmd in COMMANDS:
                        print('Executing command:', cmd, 'full:', msg)
                        try:
                            COMMANDS[cmd]()
                            try:
                                conn.send(b'OK\n')
                                print('Sent: OK')
                            except Exception as e:
                                print('Send ACK error:', e)
                        except Exception as e:
                            print('Command exec error:', e)
                            try:
                                conn.send(b'ERR\n')
                            except Exception as ee:
                                print('Send ERR error:', ee)
                    else:
                        # If frontend/back-end are using JSON ping/pong, echo a simple pong
                        if msg.startswith('{') and 'ping' in msg.lower():
                            try:
                                conn.send(b'PONG\n')
                                print('Sent: PONG (for ping)')
                            except Exception as e:
                                print('Send PONG error:', e)
                        else:
                            print('Unknown command:', msg)
                            try:
                                conn.send(b'ERR\n')
                            except Exception as e:
                                print('Send ERR error:', e)
        except Exception as e:
            print('Connection error:', e)
        finally:
            try:
                conn.close()
            except Exception:
                pass
            stop()
            print('Client disconnected')
except KeyboardInterrupt:
    print('KeyboardInterrupt - shutting down')
finally:
    try:
        s.close()
    except:
        pass
    print('Server stopped')
