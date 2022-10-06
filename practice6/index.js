const { red } = require('color-name');
const express = require('express');
const app = express();
const path = require('path')
const redditData = require('./data.json')

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/cats', (req, res) => {
    const cats = ['bule', 'rocket', 'non']
    res.render('cats', { cats })
})
app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    const data = redditData[subreddit];

    res.render(`subreddit`, { ...data });
})
app.get('/rand', (req, res) => {
    const num = Math.floor(Math.random() * 10) + 1;
    res.render('random', { num: num })
})
app.listen(3000, () => {
    console.log('listening')
})