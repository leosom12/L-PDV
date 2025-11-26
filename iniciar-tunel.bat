@echo off
echo ============================================
echo  Iniciando Tunel Publico Cloudflare
echo ============================================
echo.

REM Verificar se o cloudflared existe
if not exist "C:\cloudflared\cloudflared.exe" (
    echo [ERRO] cloudflared.exe nao encontrado!
    echo Execute primeiro: testar-cloudflare.bat
    echo.
    pause
    exit /b 1
)

echo [OK] Iniciando tunel para localhost:3000...
echo.
echo IMPORTANTE:
echo - Mantenha esta janela aberta
echo - Copie a URL publica que aparecer
echo - Compartilhe com quem quiser acessar
echo.
echo ============================================
echo.

C:\cloudflared\cloudflared.exe tunnel --url http://localhost:3000

echo.
echo ============================================
echo  Tunel encerrado
echo ============================================
pause
