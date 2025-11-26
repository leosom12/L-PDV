// ==================== TELEGRAM BOT ====================
// Bot para notificar o administrador sobre cadastros e pagamentos

const TelegramBot = require('node-telegram-bot-api');

// Configurações do Bot
// IMPORTANTE: Substitua pelo seu token do BotFather
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'SEU_TOKEN_AQUI';
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || 'SEU_CHAT_ID_AQUI';

// Inicializar bot (apenas se o token estiver configurado)
let bot = null;
let botEnabled = false;

function initTelegramBot() {
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_BOT_TOKEN !== 'SEU_TOKEN_AQUI') {
        try {
            bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
            botEnabled = true;
            console.log('✅ Bot Telegram inicializado com sucesso!');

            // Comando /start para obter o Chat ID
            bot.onText(/\/start/, (msg) => {
                const chatId = msg.chat.id;
                bot.sendMessage(chatId,
                    `🤖 *Bot L-PDV Ativo!*\n\n` +
                    `📋 Seu Chat ID: \`${chatId}\`\n\n` +
                    `ℹ️ Use este ID na configuração do servidor para receber notificações.\n\n` +
                    `Comandos disponíveis:\n` +
                    `/start - Informações do bot\n` +
                    `/status - Status do sistema`,
                    { parse_mode: 'Markdown' }
                );
            });

            // Comando /status
            bot.onText(/\/status/, (msg) => {
                const chatId = msg.chat.id;
                bot.sendMessage(chatId,
                    `✅ *Sistema L-PDV Online*\n\n` +
                    `🕐 Horário: ${new Date().toLocaleString('pt-BR')}\n` +
                    `📡 Servidor ativo e funcionando!`,
                    { parse_mode: 'Markdown' }
                );
            });

        } catch (error) {
            console.error('❌ Erro ao inicializar bot Telegram:', error.message);
            botEnabled = false;
        }
    } else {
        console.log('⚠️  Bot Telegram não configurado. Configure TELEGRAM_BOT_TOKEN e ADMIN_CHAT_ID.');
    }
}

// Função para enviar notificação de novo cadastro
async function notifyNewRegistration(userData) {
    if (!botEnabled || !bot) return;

    try {
        const message =
            `🆕 *NOVO CADASTRO*\n\n` +
            `👤 Nome: ${userData.username}\n` +
            `📧 Email: ${userData.email}\n` +
            `🕐 Data: ${new Date().toLocaleString('pt-BR')}\n\n` +
            `💡 O usuário precisa fazer a assinatura para acessar o sistema.`;

        await bot.sendMessage(ADMIN_CHAT_ID, message, { parse_mode: 'Markdown' });
        console.log('✅ Notificação de cadastro enviada ao admin');
    } catch (error) {
        console.error('❌ Erro ao enviar notificação de cadastro:', error.message);
    }
}

// Função para enviar notificação de pagamento
async function notifyPaymentProof(userData) {
    if (!botEnabled || !bot) return;

    try {
        const message =
            `💰 *COMPROVANTE DE PAGAMENTO RECEBIDO*\n\n` +
            `👤 Nome: ${userData.username}\n` +
            `📧 Email: ${userData.email}\n` +
            `🕐 Data: ${new Date().toLocaleString('pt-BR')}\n\n` +
            `⚠️ *AÇÃO NECESSÁRIA:*\n` +
            `Acesse o painel admin para verificar o comprovante e aprovar a assinatura.`;

        await bot.sendMessage(ADMIN_CHAT_ID, message, { parse_mode: 'Markdown' });
        console.log('✅ Notificação de pagamento enviada ao admin');
    } catch (error) {
        console.error('❌ Erro ao enviar notificação de pagamento:', error.message);
    }
}

// Função para enviar notificação de assinatura aprovada
async function notifySubscriptionApproved(userData) {
    if (!botEnabled || !bot) return;

    try {
        const message =
            `✅ *ASSINATURA APROVADA*\n\n` +
            `👤 Nome: ${userData.username}\n` +
            `📧 Email: ${userData.email}\n` +
            `🕐 Data: ${new Date().toLocaleString('pt-BR')}\n\n` +
            `💎 O usuário agora tem acesso completo ao sistema!`;

        await bot.sendMessage(ADMIN_CHAT_ID, message, { parse_mode: 'Markdown' });
        console.log('✅ Notificação de aprovação enviada ao admin');
    } catch (error) {
        console.error('❌ Erro ao enviar notificação de aprovação:', error.message);
    }
}

// Função para enviar notificação personalizada
async function sendCustomNotification(message) {
    if (!botEnabled || !bot) return;

    try {
        await bot.sendMessage(ADMIN_CHAT_ID, message, { parse_mode: 'Markdown' });
        console.log('✅ Notificação personalizada enviada');
    } catch (error) {
        console.error('❌ Erro ao enviar notificação:', error.message);
    }
}

module.exports = {
    initTelegramBot,
    notifyNewRegistration,
    notifyPaymentProof,
    notifySubscriptionApproved,
    sendCustomNotification,
    isBotEnabled: () => botEnabled
};
