@echo off
chcp 65001 >nul
echo ============================================
echo  Procurando Cloudflared
echo ============================================
echo.

echo Procurando em locais comuns...
echo.

REM Lista de diretórios para procurar
set "SEARCH_DIRS=C:\Users\pc\Downloads C:\Users\pc\Downloads\Programs C:\Users\pc\Desktop %USERPROFILE%\Downloads"

for %%D in (%SEARCH_DIRS%) do (
    if exist "%%D" (
        echo Procurando em: %%D
        
        if exist "%%D\cloudflared-windows-amd64.exe" (
            echo ✓ ENCONTRADO: %%D\cloudflared-windows-amd64.exe
            set "FOUND_FILE=%%D\cloudflared-windows-amd64.exe"
            goto :install
        )
        
        if exist "%%D\cloudflared.exe" (
            echo ✓ ENCONTRADO: %%D\cloudflared.exe
            set "FOUND_FILE=%%D\cloudflared.exe"
            goto :install
        )
        
        if exist "%%D\cloudflared-windows-amd64.tar.gz" (
            echo ✓ ENCONTRADO: %%D\cloudflared-windows-amd64.tar.gz
            set "FOUND_TAR=%%D\cloudflared-windows-amd64.tar.gz"
            goto :extract
        )
        
        REM Procurar em subpastas
        for /r "%%D" %%F in (cloudflared*.exe cloudflared*.tar.gz) do (
            if exist "%%F" (
                echo ✓ ENCONTRADO: %%F
                set "FOUND_FILE=%%F"
                goto :install
            )
        )
    )
)

echo.
echo ✗ Arquivo não encontrado!
echo.
echo Por favor, baixe o arquivo de:
echo https://github.com/cloudflare/cloudflared/releases/latest
echo.
echo Procure por: cloudflared-windows-amd64.exe
echo.
pause
exit /b 1

:extract
echo.
echo Extraindo arquivo tar.gz...
tar -xzf "%FOUND_TAR%" -C "%TEMP%"
if exist "%TEMP%\cloudflared.exe" (
    set "FOUND_FILE=%TEMP%\cloudflared.exe"
    goto :install
)
echo ✗ Falha ao extrair
pause
exit /b 1

:install
echo.
echo ============================================
echo  Instalando Cloudflared
echo ============================================
echo.

echo [1/3] Criando pasta C:\cloudflared\...
if not exist "C:\cloudflared\" mkdir "C:\cloudflared\"
echo ✓ Pasta criada!
echo.

echo [2/3] Copiando arquivo...
copy /Y "%FOUND_FILE%" "C:\cloudflared\cloudflared.exe" >nul
if errorlevel 1 (
    echo ✗ Erro ao copiar
    pause
    exit /b 1
)
echo ✓ Arquivo copiado!
echo.

echo [3/3] Testando...
C:\cloudflared\cloudflared.exe --version
echo.

echo ============================================
echo  ✓ INSTALAÇÃO COMPLETA!
echo ============================================
echo.
echo Para iniciar o túnel público:
echo   1. Execute: iniciar-tunel.bat
echo   2. Ou: C:\cloudflared\cloudflared.exe tunnel --url http://localhost:3000
echo.
pause
exit /b 0
