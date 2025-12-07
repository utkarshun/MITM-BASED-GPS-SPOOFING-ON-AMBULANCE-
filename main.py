"""
main.py - ESP32 startup script (MicroPython)

This script runs automatically when the ESP32 boots.
It imports the server module and starts the TCP server.
"""

import time

print("[BOOT] Starting WiFi Robot Controller...")

try:
    import server_sta
    print("[BOOT] server_sta module imported successfully")
except Exception as e:
    print("[BOOT] ERROR: Cannot import server_sta module:", e)
    print("[BOOT] Make sure server_sta.py is in the device root or /lib")
    # wait forever (or you can reboot)
    while True:
        time.sleep(10)

# Start the server
try:
    print("[BOOT] Starting TCP server...")
    if hasattr(server_sta, 'start_server'):
        server_sta.start_server()
    else:
        print("[BOOT] ERROR: server_sta does not have start_server() function")
except KeyboardInterrupt:
    print("[BOOT] Interrupted by user")
except Exception as e:
    print("[BOOT] ERROR: Failed to start server:", e)
    import traceback
    traceback.print_exc()

print("[BOOT] main.py finished (server stopped or error occurred)")
