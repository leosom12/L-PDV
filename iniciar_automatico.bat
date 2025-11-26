@echo off
title Monitor L-PDV
color 0A

:LOOP
cls
echo ==========================================
echo      MONITOR DE SISTEMA L-PDV
echo ==========================================
echo.
echo Data/Hora: %date% %time%
echo.

:: Verifica se a porta 80 (servidor) está em uso
netstat -ano | findstr ":80" | findstr "LISTENING" >nul

if %errorlevel%==0 (
    echo [STATUS] O servidor esta ONLINE e rodando.
    echo.
    echo O monitor vai verificar novamente em 30 segundos...
) else (
    echo [ALERTA] O servidor parece estar OFFLINE.
    echo [ACAO] Iniciando o servidor agora...
    echo.
    
    :: Inicia o servidor em uma nova janela minimizada
    start "Servidor L-PDV" /min cmd /c "npm start"
    
    echo Servidor iniciado! Aguardando inicializacao...
    timeout /t 10 >nul
)

:: Aguarda 30 segundos antes da próxima verificação
timeout /t 30 >nul
goto LOOP
