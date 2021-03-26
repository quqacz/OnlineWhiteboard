const express = require('express');
const mongoose = require('mongoose');

const User = require('./models/user');
const Group = require('./models/group');

const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

//połączenie do bazy danych
mongoose.connect('mongodb://localhost:27017/inzynieria-projekt', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//połączenie do bazy i ustanowienie połączenia
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once("open", ()=>{
    console.log("Database connected");
})


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// routes
app.get('/', (req,res)=>{
    res.render("mainPage");
})

app.get('/login', (req, res)=>{
    res.send("login page");
})

app.post('/login', (req, res)=>{
    res.redirect('/');
})

app.get('/register', (req, res)=>{
    res.send('register page');
})

app.post('/register', (req, res)=>{
    res.redirect('/');
})

app.get('/user/:id', (req, res)=>{
    res.render('user', {info: req.params.id + " to jest numer tej strony"})
})

app.get('/group/:id', (req, res)=>{
    res.send(`strona info grupy ${req.params.id}`);
})

app.delete('/group/:id/delete', (req, res)=>{
    res.send('strona do usuwania usera z grupy')
})

app.post('/group/:id/add', (req, res)=>{
    res.send('strona do dodawnia usera do grupy')
})

app.get('/group/:id/board', (req, res)=>{
    res.send(`strona grupy ${req.params.id} do rysowania`);
})

app.listen(3000, ()=>{
    console.log("app runs on port 3000");
})