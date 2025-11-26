@echo off
rem ------------------------------------------------------------
rem Cloudflare Tunnel startup script for Supermarket POS
rem ------------------------------------------------------------

rem Ensure cloudflared is in PATH. If not, download from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation

rem Name of the tunnel (choose a name you like)
set TUNNEL_NAME=supermarket-pos-tunnel

rem Run the tunnel (it will forward port 80 to the public URL)
cloudflared tunnel run %TUNNEL_NAME%
