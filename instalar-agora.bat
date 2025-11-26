@echo off
chcp 65001 >nul
echo ============================================
echo  Instalando Cloudflared
echo ============================================
echo.

set "SOURCE=C:\Users\pc\Downloads\Programs\cloudflared.exe"
set "DEST=C:\cloudflared"

REM Verificar se o arquivo existe
if not exist "%SOURCE%" (
    echo ✗ Arquivo não encontrado: %SOURCE%
    echo.
    pause
    exit /b 1
)

echo ✓ Arquivo encontrado!
echo.

REM Criar pasta de destino
echo [1/3] Criando pasta %DEST%...
if not exist "%DEST%" mkdir "%DEST%"
echo ✓ Pasta criada!
echo.

REM Copiar arquivo
echo [2/3] Copiando cloudflared.exe...
copy /Y "%SOURCE%" "%DEST%\cloudflared.exe" >nul
if errorlevel 1 (
    echo ✗ Erro ao copiar arquivo
    pause
    exit /b 1
)
echo ✓ Arquivo copiado para: %DEST%\cloudflared.exe
echo.

REM Testar instalação
echo [3/3] Testando instalação...
"%DEST%\cloudflared.exe" --version
echo.

echo ============================================
echo  ✓ INSTALAÇÃO COMPLETA!
echo ============================================
echo.
echo Cloudflared instalado em: C:\cloudflared\cloudflared.exe
echo.
echo 🚀 PRÓXIMO PASSO:
echo    Execute: iniciar-tunel.bat
echo.
echo    Ou manualmente:
echo    C:\cloudflared\cloudflared.exe tunnel --url http://localhost:3000
echo.
pause
