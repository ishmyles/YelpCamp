const express = require('express');
const app = express();
const port = 3000;

app.get('/', async function (req, res) {
    res.send('Welcome to YelpCamp!')
})

app.listen(port, () => {
    console.log(`YelpCamp app now serving on port ${port}`)
})