var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var sessions = require('express-session');
var upload = multer({
  dest: 'uploads/' // this saves your file into a directory called "uploads"
}); 
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var session;

var signali = [];
var users = [
{username: 'admin', password: 'admin'},
{username: 'pesho', password: '1234'},
{username: 'gosho', password: '01234'}
];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(sessions({
  secret: '^%^RTfgVuyigYReT%&^$#%*&Rd',
  resave: false,
  saveUninitialized: false
}));

app.get('/', (req, res) => {
  session = req.session;
  if(session.uniqueID){
    res.redirect('/redirects')
  }else{
  res.sendFile(__dirname + '/index.html');
}
});
app.get('/upload', (req, res) => {

session = req.session;
  if(!session.uniqueID){
    res.end("Unauthorized access");
  }else{
  res.sendFile(__dirname + '/upload.html');
}
});
app.get('/karta', (req, res) => {
  if(!session.uniqueID){
    res.end("Unauthorized access");
  }else{
  res.sendFile(__dirname + '/map.html');
}
});
app.get('/main.js', (req, res) => {
  res.sendFile(__dirname + '/main.js');
});
app.get('/main2.js', (req, res) => {
  res.sendFile(__dirname + '/main2.js');
});
app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/style.css');
});
app.get('/Style.css', (req, res) => {
  res.sendFile(__dirname + '/Style.css');
});
app.get('/login', (req, res) => {
  session = req.session;
  if(session.uniqueID){
    res.redirect('/redirects')
  }else{
  res.sendFile(__dirname + '/login.html');
}
});

app.post('/login', function(req, res){

  session = req.session;
  if(session.uniqueID){
    res.redirect('/redirects')
  }

  for(var i=0; i<users.length; i++){
    if(req.body.username == users[i].username && req.body.password == users[i].password){
      session.uniqueID = req.body.username;
      //console.log(session.uniqueID , req.body);
   }
  }
  res.redirect('/redirects');

});

app.post('/signup', function(req, res){

  for (var i = users.length - 1; i >= 0; i--) {
    if(users[i].username == req.body.username){
      //res.render('ViewMode', {data: req.body});
    }
  }
  // console.log(req);
  res.redirect('/login');

});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.get('/redirects', (req, res) => {
  session = req.session;
  if(session.uniqueID){
    res.redirect('/karta');
  }else{
    res.redirect('/login');
    //res.send(req.session.uniqueID +' not found <a href="/logout">log off</a>');
  }
});


app.use('/uploads', express.static(__dirname + '/uploads')); 

// It's very crucial that the file name matches the name attribute in your html
app.post('/upload', upload.single('file-to-upload'), (req, res) => {

  if(req.body.x == ''){
    res.redirect('/upload');
//     io.on('connection', function(socket){

//       socket.emit("coordsP", "Error skupa!!!");
  
// });
  }else{
  res.redirect('/karta');
  if(req.file == undefined){
    signali.push({
      koi: req.session.uniqueID,
    name: req.body.animal,
    file: "/uploads/dog-paw.jpg",
    coords: {lat: req.body.x, lng: req.body.y}, // още статове за кръга
    r: parseInt(req.body.rad),
    text: req.body.problem
  });
    console.log("loading default image");
  }else{
  signali.push({
    koi: req.session.uniqueID,
  	name: req.body.animal,
  	file: req.file.path,
  	coords: {lat: req.body.x, lng: req.body.y}, // още статове за кръга
    r: parseInt(req.body.rad),
  	text: req.body.problem
  });
  
}
//console.log(signali);

	    io.emit("signal", signali[signali.length-1]);

  }
  // console.log(req.file, req.body);
  // s push da vkaram vsichko v signali[]
  
});

io.on('connection', function(socket){

	    socket.emit("signali", signali);
	
});

http.listen(process.env.PORT || 3000, function(){
	console.log("Server started at port 3000");
});
