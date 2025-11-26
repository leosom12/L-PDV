# Script para corrigir a rota de atualização de assinatura
$serverPath = "C:\Users\pc\.gemini\antigravity\scratch\supermarket-pos\server.js"
$content = Get-Content $serverPath -Raw

# Remover a rota antiga (incorreta)
$oldRoute = @"
app.put('/api/admin/users/:userId/subscription', authenticateToken, checkAdmin, (req, res) => {
    const { subscriptionStatus } = req.body;
    const userId = req.params.userId;

    if (!['active', 'inactive', 'pending'].includes(subscriptionStatus)) {
        return res.status(400).json({ error: 'Status inválido' });
    }

    mainDb.run(
        ``UPDATE users SET subscriptionStatus = ? WHERE id = ?``,
        [subscriptionStatus, userId],
        function(err) {
            if (err) {
                console.error('Erro ao atualizar assinatura:', err);
                return res.status(500).json({ error: 'Erro ao atualizar assinatura' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            res.json({ 
                message: ``Assinatura `${subscriptionStatus === 'active' ? 'ativada' : 'desativada'}` com sucesso!``,
                userId: userId,
                newStatus: subscriptionStatus
            });
        }
    );
});
"@

# Nova rota (correta)
$newRoute = @"
app.put('/api/admin/users/:userId/subscription', authenticateToken, checkAdmin, (req, res) => {
    const { subscriptionStatus } = req.body;
    const userId = req.params.userId;

    if (!['active', 'inactive', 'pending'].includes(subscriptionStatus)) {
        return res.status(400).json({ error: 'Status inválido' });
    }

    // Atualizar ou criar assinatura na tabela subscriptions
    mainDb.run(
        `INSERT INTO subscriptions (user_id, status, start_date, end_date)
         VALUES (?, ?, datetime('now'), datetime('now', '+30 days'))
         ON CONFLICT(user_id) DO UPDATE SET status = ?, start_date = datetime('now'), end_date = datetime('now', '+30 days')`,
        [userId, subscriptionStatus, subscriptionStatus],
        function(err) {
            if (err) {
                console.error('Erro ao atualizar assinatura:', err);
                return res.status(500).json({ error: 'Erro ao atualizar assinatura' });
            }

            res.json({ 
                message: `Assinatura ${subscriptionStatus === 'active' ? 'ativada' : 'desativada'} com sucesso!`,
                userId: userId,
                newStatus: subscriptionStatus
            });
        }
    );
});
"@

# Substituir
if ($content -match [regex]::Escape("app.put('/api/admin/users/:userId/subscription'")) {
    # Encontrar o início e fim da rota antiga
    $startIndex = $content.IndexOf("app.put('/api/admin/users/:userId/subscription'")
    $endIndex = $content.IndexOf("});", $startIndex) + 3
    
    $before = $content.Substring(0, $startIndex)
    $after = $content.Substring($endIndex)
    
    $newContent = $before + $newRoute + $after
    Set-Content $serverPath -Value $newContent -NoNewline
    Write-Host "Rota corrigida com sucesso!"
}
else {
    Write-Host "Rota não encontrada"
}
