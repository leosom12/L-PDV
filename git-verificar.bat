@echo off
chcp 65001 >nul
echo ========================================
echo   VERIFICAÇÃO GIT - Sistema PDV
echo ========================================
echo.

echo 🔍 Verificando instalação do Git...
echo.

REM Verificar se Git está instalado
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ GIT NÃO ESTÁ INSTALADO
    echo.
    echo 📥 Para instalar o Git:
    echo    1. Acesse: https://git-scm.com/download/win
    echo    2. Baixe e execute o instalador
    echo    3. Reinicie o terminal
    echo    4. Execute este script novamente
    echo.
    goto :fim
) else (
    echo ✅ Git está instalado!
    git --version
    echo.
)

echo 🔍 Verificando repositório local...
echo.

REM Verificar se é um repositório Git
if not exist ".git" (
    echo ❌ REPOSITÓRIO GIT NÃO CONFIGURADO
    echo.
    echo 📝 Esta pasta ainda não é um repositório Git.
    echo.
    echo Para configurar:
    echo    Execute: git-configurar.bat
    echo.
    goto :fim
) else (
    echo ✅ Repositório Git configurado!
    echo.
)

echo 🔍 Verificando repositório remoto...
echo.

git remote -v
if %errorlevel% neq 0 (
    echo ❌ Nenhum repositório remoto configurado
    echo.
) else (
    echo ✅ Repositório remoto configurado!
    echo.
)

echo 🔍 Verificando branch atual...
echo.
git branch
echo.

echo 🔍 Verificando status dos arquivos...
echo.
git status
echo.

echo 🔍 Verificando últimos commits...
echo.
git log --oneline -5 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Nenhum commit encontrado ainda
    echo.
    echo Para fazer o primeiro commit:
    echo    Execute: git-commit-inicial.bat
    echo.
)

echo.
echo 🔍 Verificando sincronização com GitHub...
echo.

git fetch origin >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Não foi possível conectar ao GitHub
    echo    Verifique sua conexão com a internet
    echo    ou suas credenciais do GitHub
    echo.
) else (
    git status -uno
    echo.
    echo ✅ Conectado ao GitHub!
)

echo.
echo ========================================
echo   RESUMO DA VERIFICAÇÃO
echo ========================================
echo.

git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ ] Git instalado
) else (
    echo [✓] Git instalado
)

if exist ".git" (
    echo [✓] Repositório configurado
) else (
    echo [ ] Repositório configurado
)

git remote -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ ] Repositório remoto
) else (
    echo [✓] Repositório remoto
)

git log --oneline -1 >nul 2>&1
if %errorlevel% neq 0 (
    echo [ ] Commits realizados
) else (
    echo [✓] Commits realizados
)

echo.
echo 🌐 Repositório GitHub: https://github.com/leosom12/L-PDV
echo.

:fim
pause
