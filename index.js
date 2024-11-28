const TelegramBot = require('node-telegram-bot-api');

const token = '7470517993:AAHPNHF6rv7ebtXDPXXGC29tnekjjTeY2k0';

const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});
