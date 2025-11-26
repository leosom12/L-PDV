# Script para configurar o Firewall do Windows - Porta 80
# Execute como Administrador

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Configurando Firewall - Porta 80" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Remover regra antiga da porta 3000 (se existir)
Write-Host "[1/3] Removendo regra antiga (porta 3000)..." -ForegroundColor Yellow
try {
    Remove-NetFirewallRule -DisplayName "PDV Supermercado - Porta 3000" -ErrorAction SilentlyContinue
    Write-Host "      Regra antiga removida (se existia)" -ForegroundColor Green
}
catch {
    Write-Host "      Nenhuma regra antiga encontrada" -ForegroundColor Gray
}

Write-Host ""

# Criar nova regra para porta 80
Write-Host "[2/3] Criando regra para porta 80..." -ForegroundColor Yellow
try {
    New-NetFirewallRule -DisplayName "PDV Supermercado - Porta 80" `
        -Direction Inbound `
        -Action Allow `
        -Protocol TCP `
        -LocalPort 80 `
        -Profile Any `
        -ErrorAction Stop
    Write-Host "      Regra criada com sucesso!" -ForegroundColor Green
}
catch {
    Write-Host "      ERRO ao criar regra: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Tentando método alternativo (netsh)..." -ForegroundColor Yellow
    netsh advfirewall firewall add rule name="PDV Port 80" dir=in action=allow protocol=TCP localport=80
}

Write-Host ""

# Verificar regra criada
Write-Host "[3/3] Verificando regra..." -ForegroundColor Yellow
$rule = Get-NetFirewallRule -DisplayName "PDV Supermercado - Porta 80" -ErrorAction SilentlyContinue
if ($rule) {
    Write-Host "      Regra verificada e ativa!" -ForegroundColor Green
}
else {
    Write-Host "      Aviso: Não foi possível verificar a regra" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Configuração concluída!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Yellow
Write-Host "- A porta 80 agora está liberada no firewall" -ForegroundColor White
Write-Host "- Reinicie o servidor com 'npm start'" -ForegroundColor White
Write-Host "- Reinicie o ngrok com '.\iniciar-ngrok.bat'" -ForegroundColor White
Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
