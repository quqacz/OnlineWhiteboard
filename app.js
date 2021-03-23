const app = require('express')(),
    express = require('express');

// express setup
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

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
app.listen(3000, ()=>{
    console.log("app runs on port 3000");
})