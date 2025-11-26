@echo off
rem ------------------------------------------------------------
rem Cloudflare Tunnel startup script for Supermarket POS
rem ------------------------------------------------------------

rem Ensure cloudflared is installed and available in PATH.
rem If not, download from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation

rem Name of the tunnel (must match the tunnel created with `cloudflared tunnel create`)
set TUNNEL_NAME=supermarket-pos-tunnel

rem Start the tunnel – it will forward local port 80 to the public URL defined in cloudflared.yml
cloudflared tunnel run %TUNNEL_NAME%
