const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const User = require('./models/user');
const Group = require('./models/group');

//express setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname+"/public"));

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


// socket connection
io.on('connection', (socket) => {
    console.log("user connected");
    socket.on('disconnect', () => {
        console.log("disconnect");
    });
});


// routes
app.get('/', (req,res)=>{
    res.render("mainPage");
})

app.get('/login', (req, res)=>{
	res.render("login");
})

app.post('/login', (req, res)=>{
    res.redirect('/');
})

app.get('/register', (req, res)=>{
	 res.render("register");
})

app.post('/register', (req, res)=>{
    res.redirect('/');
})

app.get('/user/:id', (req, res)=>{
    res.render('user', {info: req.params.id + " to jest numer tej strony"})
})

app.get('/group/:id', (req, res)=>{
	 res.render('group', {groupId: req.params.id})
})

app.delete('/group/:id/delete', (req, res)=>{
    res.send('strona do usuwania usera z grupy')
})

app.post('/group/:id/add', (req, res)=>{
    res.send('strona do dodawnia usera do grupy')
})

app.get('/group/:id/board', (req, res)=>{
	res.render('board', {groupId: req.params.id})
})

http.listen(3000, ()=>{
    console.log("app runs on port 3000");
})