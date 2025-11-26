@echo off
echo ============================================
echo  Testando Cloudflare Tunnel
echo ============================================
echo.

REM Verificar se o arquivo existe
if not exist "C:\cloudflared\cloudflared.exe" (
    echo [ERRO] cloudflared.exe nao encontrado!
    echo.
    echo Por favor:
    echo 1. Baixe: cloudflared-windows-amd64.exe
    echo 2. Crie a pasta: C:\cloudflared\
    echo 3. Mova o arquivo para la
    echo 4. Renomeie para: cloudflared.exe
    echo.
    pause
    exit /b 1
)

echo [OK] cloudflared.exe encontrado!
echo.

REM Mostrar versão
echo Versao instalada:
C:\cloudflared\cloudflared.exe --version
echo.

echo ============================================
echo  Pronto para criar o tunel!
echo ============================================
echo.
echo Para iniciar o tunel publico, execute:
echo   C:\cloudflared\cloudflared.exe tunnel --url http://localhost:3000
echo.
pause
