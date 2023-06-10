const express = require('express');
const search = require('./router/search');
const suggest = require('./router/suggest');

const app = express();

app.use(express.json());
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  const currentYear = new Date().getFullYear();
  res.render('index', { currentYear });
});

app.use('/search', search);
app.use('/suggest', suggest);

const port = process.env.PORT | 3000;
app.listen(port, () => {
  console.log(`search_engine app listening on port ${port}`);
});
