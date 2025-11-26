@echo off
chcp 65001 >nul
echo ============================================
echo  Baixando Cloudflared (Versão Correta)
echo ============================================
echo.

set "URL=https://github.com/cloudflare/cloudflared/releases/download/2025.11.1/cloudflared-windows-amd64.exe"
set "DEST=C:\cloudflared\cloudflared.exe"

echo Baixando de:
echo %URL%
echo.
echo Para:
echo %DEST%
echo.
echo Aguarde... (pode levar alguns minutos)
echo.

REM Criar pasta
if not exist "C:\cloudflared\" mkdir "C:\cloudflared\"

REM Baixar usando PowerShell
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%URL%' -OutFile '%DEST%' -UseBasicParsing}"

if errorlevel 1 (
    echo.
    echo ✗ Erro ao baixar!
    echo.
    echo Por favor, baixe manualmente:
    echo 1. Acesse: https://github.com/cloudflare/cloudflared/releases/latest
    echo 2. Baixe: cloudflared-windows-amd64.exe
    echo 3. Salve em: C:\cloudflared\cloudflared.exe
    echo.
    pause
    exit /b 1
)

echo.
echo ✓ Download completo!
echo.

REM Testar
echo Testando instalação...
"%DEST%" --version
if errorlevel 1 (
    echo ✗ Erro ao executar
    pause
    exit /b 1
)

echo.
echo ============================================
echo  ✓ INSTALAÇÃO COMPLETA!
echo ============================================
echo.
echo Cloudflared instalado em: %DEST%
echo.
echo 🚀 PRÓXIMO PASSO:
echo    Execute: iniciar-tunel.bat
echo.
pause
