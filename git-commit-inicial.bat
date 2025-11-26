@echo off
chcp 65001 >nul
echo ========================================
echo   Commit Inicial - Sistema PDV
echo ========================================
echo.

REM Verificar se Git está instalado
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git não instalado! Execute git-configurar.bat primeiro.
    pause
    exit /b 1
)

REM Verificar se é um repositório Git
if not exist ".git" (
    echo ❌ Este não é um repositório Git!
    echo Execute git-configurar.bat primeiro.
    pause
    exit /b 1
)

echo Adicionando arquivos ao Git...
git add .

echo.
echo Status dos arquivos:
git status --short

echo.
set /p mensagem="Digite a mensagem do commit (ou pressione Enter para usar padrão): "

if "%mensagem%"=="" (
    set mensagem=Initial commit - Sistema PDV Supermercado
)

echo.
echo Fazendo commit com mensagem: %mensagem%
git commit -m "%mensagem%"

if %errorlevel% equ 0 (
    echo.
    echo ✅ Commit realizado com sucesso!
    echo.
    echo Próximo passo: Execute git-push.bat para enviar ao GitHub
) else (
    echo.
    echo ⚠️  Nenhuma alteração para commit ou erro ocorreu.
)

echo.
pause
