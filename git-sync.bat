@echo off
chcp 65001 >nul
echo ========================================
echo   Sincronizar com GitHub
echo ========================================
echo.

REM Verificar se Git está instalado
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git não instalado!
    pause
    exit /b 1
)

REM Verificar se é um repositório Git
if not exist ".git" (
    echo ❌ Este não é um repositório Git!
    pause
    exit /b 1
)

echo 📊 Status atual:
git status --short
echo.

set /p mensagem="Digite a mensagem do commit: "

if "%mensagem%"=="" (
    echo ❌ Mensagem de commit é obrigatória!
    pause
    exit /b 1
)

echo.
echo 1️⃣ Adicionando arquivos...
git add .

echo 2️⃣ Fazendo commit...
git commit -m "%mensagem%"

echo 3️⃣ Enviando para GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ Sincronização concluída com sucesso!
    echo.
    echo Repositório: https://github.com/leosom12/L-PDV
) else (
    echo.
    echo ❌ Erro na sincronização.
    echo Tente executar os scripts separadamente:
    echo 1. git-commit-inicial.bat
    echo 2. git-push.bat
)

echo.
pause
