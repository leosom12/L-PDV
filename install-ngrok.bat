@echo off
rem ------------------------------------------------------------
rem Install ngrok (Windows) for Supermarket POS
rem ------------------------------------------------------------

rem Define where ngrok will be installed
set NGROK_DIR=C:\ngrok

rem Create directory if it does not exist
if not exist "%NGROK_DIR%" mkdir "%NGROK_DIR%"

rem Download ngrok zip (64-bit) using PowerShell
powershell -Command "Invoke-WebRequest -Uri 'https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-windows-amd64.zip' -OutFile '%NGROK_DIR%\ngrok.zip'"

rem Extract ngrok.exe
powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [IO.Compression.ZipFile]::ExtractToDirectory('%NGROK_DIR%\ngrok.zip', '%NGROK_DIR%')"

rem Clean up zip file
del "%NGROK_DIR%\ngrok.zip"

rem Verify installation
if exist "%NGROK_DIR%\ngrok.exe" (
    echo ngrok installed successfully in %NGROK_DIR%
) else (
    echo Failed to install ngrok. Please check your internet connection and try again.
)

pause
