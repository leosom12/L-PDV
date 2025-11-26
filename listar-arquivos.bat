@echo off
echo ============================================
echo  Listando arquivos em Downloads\Programs
echo ============================================
echo.

set "DIR=C:\Users\pc\Downloads\Programs"

if not exist "%DIR%" (
    echo Pasta nao existe: %DIR%
    pause
    exit /b 1
)

echo Arquivos encontrados:
echo.
dir /b "%DIR%\*cloudflared*" 2>nul
if errorlevel 1 (
    echo Nenhum arquivo cloudflared encontrado.
    echo.
    echo Listando TODOS os arquivos:
    echo.
    dir /b "%DIR%"
)

echo.
echo ============================================
pause
