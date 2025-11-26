import base64
import os

# Base64 for a simple blue square icon (1x1 pixel stretched, valid PNG)
# This is a minimal valid PNG to satisfy the PWA requirement
icon_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="

# Ensure public directory exists
if not os.path.exists("public"):
    os.makedirs("public")

# Write icon-192.png
with open("public/icon-192.png", "wb") as f:
    f.write(base64.b64decode(icon_base64))

# Write icon-512.png
with open("public/icon-512.png", "wb") as f:
    f.write(base64.b64decode(icon_base64))

print("Icons created successfully.")
