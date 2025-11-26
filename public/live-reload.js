// Sistema de Live Reload - Atualização automática quando o código muda
(function () {
    'use strict';

    let lastUpdate = Date.now();
    const CHECK_INTERVAL = 2000; // Verifica a cada 2 segundos

    // Função para verificar se houve atualização
    async function checkForUpdates() {
        try {
            const response = await fetch('/api/version', {
                method: 'GET',
                cache: 'no-cache'
            });

            if (response.ok) {
                const data = await response.json();

                // Se a versão mudou, recarrega a página
                if (data.timestamp && data.timestamp > lastUpdate) {
                    console.log('🔄 Nova versão detectada! Atualizando página...');

                    // Mostra notificação visual
                    showUpdateNotification();

                    // Aguarda 1 segundo e recarrega
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            }
        } catch (error) {
            // Ignora erros silenciosamente
            console.debug('Verificação de atualização falhou:', error.message);
        }
    }

    // Mostra notificação de atualização
    function showUpdateNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            animation: slideIn 0.3s ease-out;
        `;
        notification.innerHTML = '🔄 Atualizando aplicação...';
        document.body.appendChild(notification);

        // Adiciona animação
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Inicia verificação periódica apenas em desenvolvimento
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🔄 Live Reload ativado - Verificando atualizações a cada 2 segundos');
        setInterval(checkForUpdates, CHECK_INTERVAL);
    }
})();
