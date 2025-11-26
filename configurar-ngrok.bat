@echo off
chcp 65001 >nul
cls
echo ============================================
echo  🔧 CONFIGURAÇÃO AUTOMÁTICA DO NGROK
echo ============================================
echo.
echo Este script vai te ajudar a configurar o ngrok
echo em apenas 3 passos simples!
echo.
echo ============================================
echo.

REM Verificar se ngrok existe
if not exist "C:\ngrok\ngrok.exe" (
    echo ❌ ERRO: ngrok não encontrado em C:\ngrok\
    echo.
    pause
    exit /b 1
)

echo ✅ ngrok encontrado!
echo.
echo ============================================
echo  📋 PASSO 1: ABRIR PÁGINA DO TOKEN
echo ============================================
echo.
echo Vou abrir o navegador para você pegar o token...
echo.
timeout /t 3 >nul

REM Abrir página do token no navegador
start https://dashboard.ngrok.com/get-started/your-authtoken

echo.
echo ============================================
echo  🔑 PASSO 2: COPIAR O TOKEN
echo ============================================
echo.
echo 1. Faça login no ngrok (se necessário)
echo 2. Copie o AUTHTOKEN que aparece na página
echo    (algo como: 2abc123def456ghi789jkl)
echo.
echo ============================================
echo  ⌨️  PASSO 3: COLAR O TOKEN AQUI
echo ============================================
echo.
set /p TOKEN="Cole o token aqui e pressione ENTER: "

if "%TOKEN%"=="" (
    echo.
    echo ❌ Token vazio! Tente novamente.
    pause
    exit /b 1
)

echo.
echo ============================================
echo  ⚙️  CONFIGURANDO...
echo ============================================
echo.

REM Configurar o token
C:\ngrok\ngrok.exe config add-authtoken %TOKEN%

if errorlevel 1 (
    echo.
    echo ❌ Erro ao configurar token!
    echo Verifique se o token está correto.
    pause
    exit /b 1
)

echo.
echo ============================================
echo  ✅ CONFIGURAÇÃO COMPLETA!
echo ============================================
echo.
echo O ngrok está pronto para usar!
echo.
echo 🚀 PRÓXIMO PASSO:
echo    Execute: iniciar-ngrok.bat
echo.
echo Isso vai criar um link público para seu app!
echo.
pause
