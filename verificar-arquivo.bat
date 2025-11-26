@echo off
chcp 65001 >nul
echo ============================================
echo  Verificando arquivos em Downloads\Programs
echo ============================================
echo.

set "DIR=C:\Users\pc\Downloads\Programs"

if not exist "%DIR%" (
    echo ✗ Pasta não existe: %DIR%
    pause
    exit /b 1
)

echo Pasta: %DIR%
echo.
echo Arquivos relacionados ao Cloudflared:
echo.
dir /b "%DIR%\*cloudflared*" 2>nul

if errorlevel 1 (
    echo   (Nenhum arquivo cloudflared encontrado)
    echo.
    echo ----------------------------------------
    echo Listando TODOS os arquivos .exe:
    echo ----------------------------------------
    echo.
    dir /b "%DIR%\*.exe" 2>nul
    
    if errorlevel 1 (
        echo   (Nenhum arquivo .exe encontrado)
    )
)

echo.
echo ============================================
echo.
echo Se você já baixou o arquivo, ele pode estar em:
echo   - C:\Users\pc\Downloads\
echo   - C:\Users\pc\Desktop\
echo.
echo Nome correto do arquivo:
echo   cloudflared-windows-amd64.exe
echo.
pause
