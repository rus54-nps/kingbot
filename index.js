require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

// Загружаем токен из переменных окружения
const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // отправляем сообщение в чат
  bot.sendMessage(chatId, 'Received your message');
});
