if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const session = require('express-session');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const flash = require('connect-flash');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/inzynieria-projekt';

const MongoStore = require('connect-mongo');

const Auth = require('./routes/auth');
const Users = require('./routes/user');
const Groups = require('./routes/group');

// 'mongodb://localhost:27017/inzynieria-projekt'
//połączenie do bazy danych
mongoose.connect(dbUrl, {
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

//express setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname+"/public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// session config
const secret = process.env.SECRET || 'thisisagoodsecretforfuckssake';

const store = new MongoStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 3600
})

store.on("error", function(e){
    console.log("SESSION STORE ERROR", e);
})

const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))


// passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash setup
app.use(flash());

// setting objects avaiable globally on the server
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

// socket connection
const socketConnetions = require('./socket')(io);

// routes
app.use('', Auth);
app.use('/user', Users);
app.use('/group', Groups);

app.get('*', (req, res)=>{
    res.render('404');
})

app.post('*', (req, res)=>{
    res.render('404');
})

app.put('*', (req, res)=>{
    res.render('404');
})

app.delete('*', (req, res)=>{
    res.render('404');
})

http.listen(3000, ()=>{
    console.log("app runs on port 3000");
})