const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

const ShortUrl = require('./models/url');

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const allData = await ShortUrl.find();

  res.render('index', {
    shortUrls: allData
  });
});

app.get('/:shortid', async (req, res) => {
  const { shortid } = req.params;
  const data = await ShortUrl.findOne({ short: shortid });

  if (!data) {
    return res.sendStatus(404)
  }

  data.clicks++;
  await data.save();

  res.redirect(data.full);
})

app.post('/short', async (req, res) => {
  const { fullUrl } = req.body;
  const record =  new ShortUrl({
    full: fullUrl,
  });

  await record.save();
  res.redirect('/');
});

(async function start() {
  try {
    await mongoose.connect(
      MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      }
    );
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}());
