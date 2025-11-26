# Script para configurar o Firewall do Windows para o PDV
# Execute como Administrador

$PORT = 3000
$RULE_NAME = "PDV Supermercado - Porta $PORT"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔥 Configurando Firewall do Windows" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se a regra já existe
$existingRule = Get-NetFirewallRule -DisplayName $RULE_NAME -ErrorAction SilentlyContinue

if ($existingRule) {
    Write-Host "⚠️  Regra já existe. Removendo regra antiga..." -ForegroundColor Yellow
    Remove-NetFirewallRule -DisplayName $RULE_NAME
}

# Adicionar nova regra
Write-Host "➕ Adicionando regra de firewall..." -ForegroundColor Green
New-NetFirewallRule -DisplayName $RULE_NAME `
                    -Direction Inbound `
                    -Action Allow `
                    -Protocol TCP `
                    -LocalPort $PORT `
                    -Profile Any `
                    -Description "Permite acesso externo ao Sistema PDV Supermercado"

Write-Host ""
Write-Host "✅ Firewall configurado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📡 Porta $PORT agora está acessível externamente" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para verificar a regra criada, execute:" -ForegroundColor Yellow
Write-Host "Get-NetFirewallRule -DisplayName '$RULE_NAME'" -ForegroundColor White
Write-Host ""
Write-Host "Para remover a regra no futuro, execute:" -ForegroundColor Yellow
Write-Host "Remove-NetFirewallRule -DisplayName '$RULE_NAME'" -ForegroundColor White
Write-Host ""
