@echo off
chcp 65001 >nul
echo ========================================
echo   Push para GitHub - Sistema PDV
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

echo Verificando branch atual...
git branch

echo.
echo Enviando alterações para o GitHub...
echo.

REM Tentar push normal primeiro
git push -u origin main 2>nul

if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Push normal falhou. Tentando com --force...
    echo.
    echo ATENÇÃO: Isso irá sobrescrever o repositório remoto!
    choice /C SN /M "Deseja continuar com push forçado"
    
    if errorlevel 2 (
        echo.
        echo ❌ Push cancelado pelo usuário.
        pause
        exit /b 1
    )
    
    if errorlevel 1 (
        git push -u origin main --force
        
        if %errorlevel% equ 0 (
            echo.
            echo ✅ Push realizado com sucesso!
        ) else (
            echo.
            echo ❌ Erro ao fazer push. Verifique suas credenciais do GitHub.
            echo.
            echo Dicas:
            echo 1. Certifique-se de ter permissão no repositório
            echo 2. Configure suas credenciais: git config --global credential.helper wincred
            echo 3. Ou use um token de acesso pessoal do GitHub
        )
    )
) else (
    echo.
    echo ✅ Push realizado com sucesso!
)

echo.
echo Repositório: https://github.com/leosom12/L-PDV
echo.
pause
