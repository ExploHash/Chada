/*
  Bestand om express en al zijn plugins te initalizeren.
  Hier geef ik de routes aan en importeer ik de modules die ik nodig heb 
*/
var express = require('express');
var session = require('express-session');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var parseCookie = require('cookie-parser');
var io = require('socket.io')(http);
var sockets = require('./modules/socket');

var cookieParser = parseCookie();
var MemoryStore = session.MemoryStore;
var store = new MemoryStore();

sockets.init(io, store); 

const api = require("./routes/api");
const index = require("./routes/index");
app.use(cookieParser);
app.use(session({
  store: store,
  secret: "i34bri635rci36498b398b5r3",
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', './pages');
app.use(express.static("public"));
app.use('/', index);
app.use("/api", api);
http.listen(80, function(){
  console.log('listening on localhost:80');
});
