const express = require('express');
const path = require('path');
const port = 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async function (req, res) {
    res.render('index')
})

app.listen(port, () => {
    console.log(`YelpCamp app now serving on port ${port}`)
})