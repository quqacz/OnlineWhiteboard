const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const session = require('express-session');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const User = require('./models/user');
const Group = require('./models/group');
const users = require('./users');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');


const roomsData = {};

//express setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname+"/public"));

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

const sessionConfig = {
    secret: 'dngdngmvmvcbmfgwgfejhfkjghkfghjkrsywrgreykiyt',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    next();
})

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

    socket.on('disconnecting', ()=>{
        let vievID, editID;
        if(roomsData[socket.roomId] && roomsData[socket.roomId].viewers)
            vievID = roomsData[socket.roomId].viewers.includes(socket.id) ? roomsData[socket.roomId].viewers.indexOf(socket.id) : undefined;

        if(roomsData[socket.roomId] && roomsData[socket.roomId].editors)
            editID = roomsData[socket.roomId].editors.includes(socket.id) ? roomsData[socket.roomId].editors.indexOf(socket.id) : undefined;

        if(vievID)
            roomsData[socket.roomId].viewers.splice(vievID, 1);

        if(editID)
            roomsData[socket.roomId].editors.splice(editID, 1);
    })

    socket.on('joinBoardGroup', (roomId, name, lastName)=>{
        socket.join(roomId);
        socket.room = roomId;
        socket.name = name;
        socket.lastName = lastName;
        if(roomsData[roomId]){
            roomsData[roomId].viewers.push(socket.id);
            socket.emit('joinedViewres');
            socket.emit('sendCanvasToViewers', roomsData[roomId].canvasDataBase64);
        }else{
            roomsData[roomId] = {};
            roomsData[roomId].editors = [];
            roomsData[roomId].viewers = [];
            roomsData[roomId].editors.push(socket.id);
            roomsData[roomId].canvasDataBase64 = '';
            roomsData[roomId].canvasDataJson = '';
            console.log(socket.id);
            socket.emit('joinedEditors');
        }
    })

    socket.on('sendMessage', (payload)=>{
        socket.to(socket.room).emit('sendMessage', payload, socket.name, socket.lastName);
        socket.emit('sendMessage', payload, socket.name, socket.lastName);
    })

    socket.on('sendCanvasToViewers', (canvasDataURI)=>{
        roomsData[socket.room].canvasDataBase64 = canvasDataURI;
        let viewer = roomsData[socket.room].viewers;
        for(let i = 0; i < viewer.length; i++){
            io.to(viewer[i]).emit('sendCanvasToViewers', canvasDataURI);
        }
    })

    socket.on('sendCanvasToEditors', (canvasDataURI)=>{
        roomsData[socket.room].canvasDataJson = canvasDataURI;
        let editors = roomsData[socket.room].editors;
        for(let i = 0; i < editors.length; i++){
            if(editors[i] !== socket.id)
                io.to(editors[i]).emit('sendCanvasToEditors', canvasDataURI);
        }
    })
});


// routes
app.get('/', (req,res)=>{
    res.render("mainPage");
})

app.get('/fake', async (req, res)=>{
    const user = new User({
        username: 'Q.q',
        name: 'Marcin',
        lastName: 'Nowak'
    });
    const newUser = await User.register(user, 'lol');
    res.send(newUser);
})

app.get('/login', (req, res)=>{
	res.render("login");
})

app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), (req, res)=>{
    res.redirect('/user/'+req.user._id);
})

app.get('/register', (req, res)=>{
	 res.render("register");
})

app.post('/register', async(req, res)=>{
    try{
    const {name, lastName, username, password} = req.body;
    const user = new User({ name, lastName, username});
    const regUser = await User.register(user, password);
    console.log(username, password);
    res.redirect('/user/'+regUser._id);
    }catch (e){
        console.log(e);
        res.redirect('/register');
    }
})

app.get('/user/:id', async(req, res)=>{
    const user = User.findOne({_id: req.params.id});
    res.render('user', {user})
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
    let dummyUsers = [];
    
    for(let i = 0; i < 15; i ++){
        dummyUsers.push(users[Math.floor(Math.random()*users.length)]);
    }
	res.render('board', {groupId: req.params.id, users: dummyUsers})
})

http.listen(3000, ()=>{
    console.log("app runs on port 3000");
})