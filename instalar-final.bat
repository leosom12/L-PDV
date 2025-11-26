@echo off
chcp 65001 >nul
echo ============================================
echo  Instalando Cloudflared
echo ============================================
echo.

set "SOURCE=C:\Users\pc\Downloads\Programs\cloudflared-windows-amd64.exe"
set "DEST=C:\cloudflared"

REM Verificar se o arquivo existe
if not exist "%SOURCE%" (
    echo ✗ Arquivo não encontrado: %SOURCE%
    echo.
    echo Certifique-se de que o arquivo baixado se chama:
    echo   cloudflared-windows-amd64.exe
    echo.
    echo E está em:
    echo   C:\Users\pc\Downloads\Programs\
    echo.
    pause
    exit /b 1
)

echo ✓ Arquivo encontrado!
echo   Local: %SOURCE%
echo.

REM Criar pasta de destino
echo [1/3] Criando pasta %DEST%...
if not exist "%DEST%" mkdir "%DEST%"
echo ✓ Pasta criada!
echo.

REM Copiar arquivo
echo [2/3] Copiando arquivo...
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
if errorlevel 1 (
    echo.
    echo ✗ ERRO: Arquivo incompatível ou corrompido!
    echo.
    echo Tente baixar novamente:
    echo https://github.com/cloudflare/cloudflared/releases/latest
    echo.
    pause
    exit /b 1
)
echo.

echo ============================================
echo  ✓ INSTALAÇÃO COMPLETA!
echo ============================================
echo.
echo Cloudflared instalado com sucesso!
echo Local: C:\cloudflared\cloudflared.exe
echo.
echo 🚀 PRÓXIMO PASSO - Iniciar Túnel Público:
echo.
echo    Opção 1: Execute o script
echo      iniciar-tunel.bat
echo.
echo    Opção 2: Comando manual
echo      C:\cloudflared\cloudflared.exe tunnel --url http://localhost:3000
echo.
pause
