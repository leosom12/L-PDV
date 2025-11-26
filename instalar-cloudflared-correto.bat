@echo off
chcp 65001 >nul
echo ============================================
echo  Instalando Cloudflared (Versão Correta)
echo ============================================
echo.

REM Locais possíveis do arquivo
set "FILE1=C:\Users\pc\Downloads\cloudflared-windows-amd64.exe"
set "FILE2=C:\Users\pc\Downloads\Programs\cloudflared-windows-amd64.exe"
set "FILE3=C:\Users\pc\Desktop\cloudflared-windows-amd64.exe"
set "DEST=C:\cloudflared"

REM Procurar o arquivo
set "SOURCE="

if exist "%FILE1%" (
    set "SOURCE=%FILE1%"
    echo ✓ Arquivo encontrado em: Downloads
) else if exist "%FILE2%" (
    set "SOURCE=%FILE2%"
    echo ✓ Arquivo encontrado em: Downloads\Programs
) else if exist "%FILE3%" (
    set "SOURCE=%FILE3%"
    echo ✓ Arquivo encontrado em: Desktop
) else (
    echo ✗ Arquivo não encontrado!
    echo.
    echo Por favor, baixe o arquivo correto:
    echo   Nome: cloudflared-windows-amd64.exe
    echo   Link: https://github.com/cloudflare/cloudflared/releases/latest
    echo.
    echo Procurei em:
    echo   - %FILE1%
    echo   - %FILE2%
    echo   - %FILE3%
    echo.
    pause
    exit /b 1
)

echo Arquivo: %SOURCE%
echo.

REM Criar pasta
echo [1/3] Criando pasta %DEST%...
if not exist "%DEST%" mkdir "%DEST%"
echo ✓ Pasta criada!
echo.

REM Copiar arquivo
echo [2/3] Copiando arquivo...
copy /Y "%SOURCE%" "%DEST%\cloudflared.exe" >nul
if errorlevel 1 (
    echo ✗ Erro ao copiar
    pause
    exit /b 1
)
echo ✓ Arquivo copiado!
echo.

REM Testar
echo [3/3] Testando instalação...
"%DEST%\cloudflared.exe" --version
if errorlevel 1 (
    echo.
    echo ✗ ERRO: Arquivo incompatível!
    echo.
    echo Certifique-se de baixar: cloudflared-windows-amd64.exe
    echo Não use: cloudflared.exe (genérico)
    echo.
    pause
    exit /b 1
)
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
pause
