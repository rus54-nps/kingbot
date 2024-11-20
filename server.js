const express = require('express');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const BOT_TOKEN = process.env.BOT_TOKEN;

function checkTelegramAuth(data) {
  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  const hash = data.hash;
  delete data.hash;
  const checkString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join('\n');
  const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex');
  return hmac === hash;
}

app.get('/auth', (req, res) => {
  const data = req.query;

  if (checkTelegramAuth(data)) {
    res.redirect(`/App?username=${data.username}&photo_url=${data.photo_url}&id=${data.id}`);
  } else {
    res.status(403).send('Invalid data');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
