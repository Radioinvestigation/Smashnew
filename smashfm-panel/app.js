const express = require('express');
const passport = require('passport');
const config = require('./config.json');
const path = require('path');
const cookieParser = require('cookie-parser');
const chalk = require("chalk")
const bodyParser = require('body-parser')
const http = require("http")
var cors = require('cors')

const indexRouter = require('./routers/page');
const apiRouter = require('./routers/api');

const expressSession = require("express-session");
const database = require('./modules/database');
const sessionMiddleware = expressSession({
  name: "SmashFM Panel",
  secret: "smashfmsecret-123893497213489",
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
});

require('./routers/passport')(passport);
const app = express()
  .use(sessionMiddleware)
  .use(passport.initialize())
  .use(passport.session())
  .use(cors());

app.set('trust proxy', true);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views/static')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

var server = http.createServer(app).listen(config.port, function(){
  console.log(`${chalk.magentaBright("[WEB]")}${chalk.greenBright("[INFO]")} Web Server Started!`);
});

var io = require("socket.io")(server, {
  cors: {
      origin: "*",
      methods: ["GET", "POST"],
      transports: ['websocket', 'polling'],
      credentials: true
  },
  allowEIO3: true
});
io.sockets.on('connection', function (r) {
  console.log(`${chalk.cyanBright("[SOCKET]")}${chalk.greenBright("[INFO]")} Socket Connected!`);
});

io.on('connection', (socket) => {
  socket.on('timetable:book', (msg) => {
    io.emit('timetable:book', msg);
  });
  socket.on('timetable:unbook', (msg) => {
    io.emit('timetable:unbook', msg)
  })
});

app.use(function(req, res) {
  if(res.statusCode == 404) {
    res.send(`Cannot find that page, <a href="/Core.Home">go home</a>`)
  };
});

module.exports = app;