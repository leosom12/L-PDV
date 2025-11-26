@echo off
chcp 65001 >nul
echo.
echo ============================================================
echo 🌐 CONFIGURAÇÃO DE ACESSO PÚBLICO - PDV SUPERMERCADO
echo ============================================================
echo.
echo Este script irá configurar o firewall do Windows para
echo permitir acesso externo ao servidor PDV na porta 3000.
echo.
echo ⚠️  IMPORTANTE: Execute este arquivo como ADMINISTRADOR!
echo.
echo Pressione qualquer tecla para continuar...
pause >nul

echo.
echo 🔥 Configurando Firewall...
echo.

netsh advfirewall firewall delete rule name="PDV Port 3000" >nul 2>&1
netsh advfirewall firewall add rule name="PDV Port 3000" dir=in action=allow protocol=TCP localport=3000

if %errorlevel% equ 0 (
    echo.
    echo ✅ Firewall configurado com sucesso!
    echo.
    echo 📡 A porta 3000 agora está acessível externamente.
    echo.
    echo 🚀 Próximos passos:
    echo    1. Execute: npm start
    echo    2. Anote o IP PÚBLICO mostrado no console
    echo    3. Acesse de outros dispositivos usando esse IP
    echo.
    echo 📖 Para mais informações, leia: ACESSO_PUBLICO.md
    echo.
) else (
    echo.
    echo ❌ Erro ao configurar firewall!
    echo.
    echo ⚠️  Certifique-se de executar este arquivo como ADMINISTRADOR:
    echo    1. Clique com botão direito no arquivo
    echo    2. Selecione "Executar como administrador"
    echo.
)

echo.
echo Pressione qualquer tecla para sair...
pause >nul
