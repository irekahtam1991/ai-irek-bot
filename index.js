const TelegramBot = require('node-telegram-bot-api');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

bot.on('message', async msg => {
  const chatId = msg.chat.id;
  const text = msg.text || '';

  if (/\/start/i.test(text)) {
    return bot.sendMessage(chatId, 'Привет, я Ирек. Ну что, по делу или поболтаем? 😎');
  }

  try {
    const resp = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: text }],
    });
    const reply = resp.data.choices[0].message.content;
    bot.sendMessage(chatId, reply);
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, 'Ошибка. Попробуем позже.');
  }
});
