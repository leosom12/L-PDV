@echo off
chcp 65001 >nul
echo ============================================
echo  Iniciando Túnel Público com ngrok
echo ============================================
echo.

REM Verificar se o ngrok existe
if not exist "C:\ngrok\ngrok.exe" (
    echo [ERRO] ngrok.exe não encontrado!
    echo Execute primeiro a instalação do ngrok
    echo.
    pause
    exit /b 1
)

echo [OK] Iniciando túnel para localhost:80...
echo.
echo IMPORTANTE:
echo - Mantenha esta janela aberta
echo - Copie a URL pública que aparecer
echo - Compartilhe com quem quiser acessar
echo.
echo ============================================
echo.

C:\ngrok\ngrok.exe http 80

echo.
echo ============================================
echo  Túnel encerrado
echo ============================================
pause
