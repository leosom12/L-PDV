@echo off
chcp 65001 >nul
echo ========================================
echo   Configurar Git - Sistema PDV
echo ========================================
echo.

REM Verificar se o Git está instalado
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git não está instalado!
    echo.
    echo Por favor, instale o Git primeiro:
    echo 1. Acesse: https://git-scm.com/download/win
    echo 2. Baixe e instale o Git
    echo 3. Reinicie o terminal
    echo 4. Execute este script novamente
    echo.
    pause
    exit /b 1
)

echo ✅ Git está instalado!
echo.

REM Verificar se já é um repositório Git
if exist ".git" (
    echo ℹ️  Este diretório já é um repositório Git.
    echo.
    git remote -v
    echo.
    choice /C SN /M "Deseja reconfigurar o repositório remoto"
    if errorlevel 2 goto :fim
    if errorlevel 1 goto :configurar_remoto
) else (
    echo Inicializando repositório Git...
    git init
    echo ✅ Repositório inicializado!
    echo.
    goto :configurar_remoto
)

:configurar_remoto
echo.
echo Configurando repositório remoto...

REM Remover origin existente se houver
git remote remove origin >nul 2>&1

REM Adicionar novo origin
git remote add origin https://github.com/leosom12/L-PDV.git
echo ✅ Repositório remoto configurado!
echo.

REM Verificar configuração do usuário
git config user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Configuração de usuário Git não encontrada.
    echo.
    set /p nome="Digite seu nome: "
    set /p email="Digite seu email: "
    git config --global user.name "!nome!"
    git config --global user.email "!email!"
    echo ✅ Configuração de usuário salva!
)

echo.
echo ========================================
echo   Configuração Concluída!
echo ========================================
echo.
echo Próximos passos:
echo 1. Execute: git-commit-inicial.bat
echo 2. Para enviar ao GitHub: git-push.bat
echo 3. Para atualizar do GitHub: git-pull.bat
echo.

:fim
pause
