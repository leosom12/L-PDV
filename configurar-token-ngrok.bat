@echo off
chcp 65001 >nul
echo ============================================
echo  Configurar Token do ngrok
echo ============================================
echo.

REM Verificar se o ngrok existe
if not exist "C:\ngrok\ngrok.exe" (
    echo [ERRO] ngrok.exe não encontrado em C:\ngrok\
    echo.
    echo Por favor, instale o ngrok primeiro:
    echo 1. Baixe em: https://ngrok.com/download
    echo 2. Extraia para C:\ngrok\
    echo.
    pause
    exit /b 1
)

echo Este script irá configurar o token de autenticação do ngrok.
echo.
echo Para obter seu token:
echo 1. Acesse: https://dashboard.ngrok.com/signup
echo 2. Faça login (ou crie uma conta gratuita)
echo 3. Copie seu authtoken em: https://dashboard.ngrok.com/get-started/your-authtoken
echo.
echo ============================================
echo.

set /p NGROK_TOKEN="Cole seu token do ngrok aqui: "

if "%NGROK_TOKEN%"=="" (
    echo.
    echo [ERRO] Token não pode estar vazio!
    pause
    exit /b 1
)

echo.
echo [1/2] Configurando token no ngrok...
C:\ngrok\ngrok.exe config add-authtoken %NGROK_TOKEN%

if %ERRORLEVEL% EQU 0 (
    echo [OK] Token configurado com sucesso!
    echo.
    echo [2/2] Salvando token nas variáveis de ambiente...
    
    REM Criar arquivo .env se não existir
    if not exist ".env" (
        copy .env.example .env >nul 2>&1
    )
    
    REM Atualizar NGROK_AUTHTOKEN no .env
    powershell -Command "(Get-Content .env) -replace 'NGROK_AUTHTOKEN=.*', 'NGROK_AUTHTOKEN=%NGROK_TOKEN%' | Set-Content .env"
    
    echo [OK] Token salvo no arquivo .env
    echo.
    echo ============================================
    echo  Configuração Concluída!
    echo ============================================
    echo.
    echo PRÓXIMOS PASSOS:
    echo 1. Inicie o servidor: npm start
    echo 2. O ngrok será iniciado AUTOMATICAMENTE
    echo 3. A URL pública será exibida no console
    echo.
    echo Você NÃO precisa mais executar iniciar-ngrok.bat!
    echo.
) else (
    echo.
    echo [ERRO] Falha ao configurar token!
    echo Verifique se o token está correto.
    echo.
)

pause
