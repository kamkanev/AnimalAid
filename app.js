var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var sessions = require('express-session');
var md5 = require('md5');
const sgMail = require('@sendgrid/mail');
//var MemoryStore = require('memorystore')(sessions)
sgMail.setApiKey("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");//process.env.SENDGRID_API_KEY);
var MailListener = require("mail-listener-fixed");

var upload = multer({
  dest: 'uploads/' // this saves your file into a directory called "uploads"
}); 
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var session;

var signali = [];
var users = [
{username: 'admin', email: 'kamkanev@gmail.com', password: md5('admin')},
{username: 'admin2', email: 'burborko2@abv.bg', password: md5('admin2')},
{username: 'pesho', password: md5('1234')},
{username: 'gosho', password: md5('01234')}
];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(sessions({
  store: new (require('connect-pg-simple')(sessions))(),
  secret: '^%^RTfgVuyigYReT%&^$#%*&Rd',
  // store: new MemoryStore({
  //   checkPeriod: 86400000 // prune expired entries every 24h
  // }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days

}));

app.get('/', (req, res) => {
  session = req.session;
  if(session.uniqueID){
    res.redirect('/redirects')
  }else{
  res.sendFile(__dirname + '/index.html');
}
});

app.get('/checked', (req, res) => {
  session = req.session;
  if(!session.uniqueID){
    res.end("Unauthorized access");
  }else{
  res.sendFile(__dirname + '/send.html');
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
app.get('/main3.js', (req, res) => {
  res.sendFile(__dirname + '/main3.js');
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
    if(req.body.username == users[i].username && md5(req.body.password) == users[i].password){
      session.uniqueID = req.body.username;
      //console.log(session.uniqueID , req.body);
   }
  }
  res.redirect('/redirects');

});

app.post('/checked', function(req, res){

if(req.body.x == ''){
	res.redirect('/checked');
}else{
//console.log(signali);
	for (var i = signali.length - 1; i >= 0; i--) {
		if(signali[i].coords.lat == req.body.x && signali[i].coords.lng == req.body.y){
			//console.log(signali[i].coords.lat+' - '+req.body.x);
				signali.splice(i, 1);
		}
	}
	//console.log(req.body.x+' , '+req.body.y);
	//console.log(signali);
	io.emit("delSignal", signali);
	res.redirect('/karta');

}

});

app.post('/signup', function(req, res){
	if(req.body.firstname != '' && req.body.lastname != '' && req.body.username != '' && req.body.email != '' && req.body.password != '' && req.body.confirmpassword != ''){

var sign = true;
  for (var i = users.length - 1; i >= 0; i--) {
    if(users[i].username == req.body.username){
      //res.render('ViewMode', {data: req.body});
      sign = false;
      break;
  }
      if(users[i].email == req.body.email){
      	sign = false;
      	break;
      }
      

  }
  // console.log(req);
  if(sign && req.body.password == req.body.confirmpassword){
  	users.push({username: req.body.username,
  		name: req.body.firstname,
  		familia: req.body.lastname,
  		email: req.body.email,
  		password: md5(req.body.password)
  	});
    var msg = {
      to: ''+req.body.email+'',
      from: 'DevTeam@animalaid.com',
      subject: 'Регистрация AnimalAid',
      templateId: 'd-aa9cafe984ab45398a96b76c9435be8c',
    };
    sgMail.send(msg);
  res.redirect('/login');
}else{

	res.redirect('/');
}
//console.log(users);
}else{

	res.redirect('/');
}
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

  if(req.body.x == '' && req.body.animal == '' && req.body.problem == ''){
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
