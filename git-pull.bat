@echo off
chcp 65001 >nul
echo ========================================
echo   Pull do GitHub - Sistema PDV
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

echo Baixando alterações do GitHub...
echo.

git pull origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ Alterações baixadas com sucesso!
) else (
    echo.
    echo ⚠️  Erro ao fazer pull. Pode haver conflitos.
    echo.
    echo Para resolver conflitos:
    echo 1. Verifique os arquivos em conflito: git status
    echo 2. Edite os arquivos e resolva os conflitos
    echo 3. Adicione os arquivos resolvidos: git add .
    echo 4. Finalize: git commit -m "Resolvido conflitos"
)

echo.
pause
