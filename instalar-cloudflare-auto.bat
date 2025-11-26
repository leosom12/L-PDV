@echo off
chcp 65001 >nul
echo ============================================
echo  Instalação Automática Cloudflare Tunnel
echo ============================================
echo.

REM Criar pasta de destino
echo [1/5] Criando pasta C:\cloudflared\...
if not exist "C:\cloudflared\" mkdir "C:\cloudflared\"
echo ✓ Pasta criada!
echo.

REM Procurar arquivo no Downloads\Programs
echo [2/5] Procurando arquivo cloudflared...
set "SOURCE_DIR=C:\Users\pc\Downloads\Programs"
set "DEST_DIR=C:\cloudflared"

REM Procurar arquivo .exe
if exist "%SOURCE_DIR%\cloudflared-windows-amd64.exe" (
    echo ✓ Encontrado: cloudflared-windows-amd64.exe
    set "SOURCE_FILE=%SOURCE_DIR%\cloudflared-windows-amd64.exe"
    goto :found
)

if exist "%SOURCE_DIR%\cloudflared.exe" (
    echo ✓ Encontrado: cloudflared.exe
    set "SOURCE_FILE=%SOURCE_DIR%\cloudflared.exe"
    goto :found
)

REM Procurar arquivo .tar.gz
if exist "%SOURCE_DIR%\cloudflared-windows-amd64.tar.gz" (
    echo ✓ Encontrado: cloudflared-windows-amd64.tar.gz
    echo.
    echo [3/5] Extraindo arquivo tar.gz...
    
    REM Usar tar nativo do Windows 10/11
    tar -xzf "%SOURCE_DIR%\cloudflared-windows-amd64.tar.gz" -C "%SOURCE_DIR%"
    
    if exist "%SOURCE_DIR%\cloudflared.exe" (
        set "SOURCE_FILE=%SOURCE_DIR%\cloudflared.exe"
        echo ✓ Arquivo extraído!
        goto :found
    ) else (
        echo [ERRO] Falha ao extrair arquivo
        goto :error
    )
)

echo [ERRO] Arquivo não encontrado em:
echo   %SOURCE_DIR%
echo.
echo Procurei por:
echo   - cloudflared-windows-amd64.exe
echo   - cloudflared.exe
echo   - cloudflared-windows-amd64.tar.gz
echo.
goto :error

:found
echo.
echo [3/5] Copiando arquivo para C:\cloudflared\...
copy /Y "%SOURCE_FILE%" "%DEST_DIR%\cloudflared.exe" >nul
if errorlevel 1 (
    echo [ERRO] Falha ao copiar arquivo
    goto :error
)
echo ✓ Arquivo copiado!
echo.

echo [4/5] Testando instalação...
"%DEST_DIR%\cloudflared.exe" --version
if errorlevel 1 (
    echo [ERRO] Falha ao executar cloudflared
    goto :error
)
echo.

echo [5/5] Configuração concluída!
echo.
echo ============================================
echo  ✓ INSTALAÇÃO COMPLETA!
echo ============================================
echo.
echo Cloudflared instalado em: C:\cloudflared\cloudflared.exe
echo.
echo Para criar o túnel público, execute:
echo   iniciar-tunel.bat
echo.
echo Ou manualmente:
echo   C:\cloudflared\cloudflared.exe tunnel --url http://localhost:3000
echo.
pause
exit /b 0

:error
echo.
echo ============================================
echo  ✗ ERRO NA INSTALAÇÃO
echo ============================================
echo.
echo Por favor, verifique:
echo 1. O arquivo foi baixado em: %SOURCE_DIR%
echo 2. O nome do arquivo está correto
echo 3. Você tem permissões de administrador
echo.
pause
exit /b 1
