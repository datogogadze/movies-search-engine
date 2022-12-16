const express = require('express');
const search = require('./router/search');

const app = express();

app.use(express.json());
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/search', search);

const port = process.env.PORT | 3000;
app.listen(port, () => {
  console.log(`search_engine app listening on port ${port}`);
});
