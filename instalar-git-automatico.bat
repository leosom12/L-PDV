@echo off
chcp 65001 >nul
echo ========================================
echo   INSTALAÇÃO AUTOMÁTICA DO GIT
echo ========================================
echo.

echo 🔍 Verificando se Git já está instalado...
git --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Git já está instalado!
    git --version
    echo.
    choice /C SN /M "Deseja reinstalar o Git"
    if errorlevel 2 goto :configurar
)

echo.
echo 📥 Baixando Git para Windows...
echo.

REM Criar pasta temporária
if not exist "%TEMP%\git-installer" mkdir "%TEMP%\git-installer"

REM URL do instalador Git (versão mais recente)
set GIT_URL=https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe
set GIT_INSTALLER=%TEMP%\git-installer\Git-installer.exe

echo Baixando de: %GIT_URL%
echo.

REM Baixar usando PowerShell
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%GIT_URL%' -OutFile '%GIT_INSTALLER%' -UseBasicParsing}"

if %errorlevel% neq 0 (
    echo.
    echo ❌ Erro ao baixar o Git!
    echo.
    echo Por favor, baixe manualmente em:
    echo https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo ✅ Download concluído!
echo.

echo 🔧 Instalando Git...
echo.
echo ⚠️  IMPORTANTE: Durante a instalação:
echo    - Aceite todas as opções padrão
echo    - Clique em "Next" até finalizar
echo.
pause

REM Instalar Git silenciosamente
start /wait "" "%GIT_INSTALLER%" /VERYSILENT /NORESTART /NOCANCEL /SP- /CLOSEAPPLICATIONS /RESTARTAPPLICATIONS /COMPONENTS="icons,ext\reg\shellhere,assoc,assoc_sh"

if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Instalação pode ter falhado.
    echo    Tente instalar manualmente.
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Git instalado com sucesso!
echo.

REM Limpar arquivo temporário
del "%GIT_INSTALLER%" >nul 2>&1

echo 🔄 Atualizando variáveis de ambiente...
echo.

REM Adicionar Git ao PATH da sessão atual
set "PATH=%PATH%;C:\Program Files\Git\cmd"

echo ⚠️  IMPORTANTE: Você precisa REINICIAR este terminal!
echo.
echo Após reiniciar, execute: git-configurar.bat
echo.

:configurar
echo.
choice /C SN /M "Deseja configurar o repositório agora"
if errorlevel 2 goto :fim

echo.
echo ========================================
echo   CONFIGURANDO REPOSITÓRIO GIT
echo ========================================
echo.

REM Verificar se Git está disponível
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git ainda não está disponível no PATH
    echo.
    echo Por favor:
    echo 1. Feche este terminal
    echo 2. Abra um novo terminal
    echo 3. Execute: git-configurar.bat
    echo.
    goto :fim
)

echo ✅ Git está disponível!
echo.

REM Verificar se já é um repositório Git
if exist ".git" (
    echo ℹ️  Este diretório já é um repositório Git.
    echo.
    git remote -v
    echo.
    choice /C SN /M "Deseja reconfigurar o repositório remoto"
    if errorlevel 2 goto :fim
    git remote remove origin >nul 2>&1
)

echo Inicializando repositório Git...
git init

echo.
echo Configurando repositório remoto...
git remote add origin https://github.com/leosom12/L-PDV.git

echo.
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
    git config --global user.name "%nome%"
    git config --global user.email "%email%"
    echo ✅ Configuração de usuário salva!
)

echo.
echo ========================================
echo   CONFIGURAÇÃO CONCLUÍDA!
echo ========================================
echo.
echo Próximos passos:
echo 1. Execute: git-commit-inicial.bat
echo 2. Execute: git-push.bat
echo.

:fim
pause
