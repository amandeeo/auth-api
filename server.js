import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import passport from 'passport';
import multer from 'multer';
import logger from 'morgan';
import cors from 'cors';
import path from 'path';
import config from './config/config';



// import routes module from routes folder 
import userRoutes from './routes/userRoutes';

//create a new express instance
const app = express();

//connection to database
var uri = config.database.connectionString;

mongoose.connect(uri,function(err){
	if(err){
		console.log(err.message);
	}
	else{
		console.log('database connected');
	}
})

//body-parser middleware to handle form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));

//morgan middleware to log requests
app.use(logger('dev'));

//passport configuration
require('./config/passport')(passport);
app.use(require('express-session')({
    secret: 'adminPanel',
    cookie: {
        'maxAge': 1209600000
    },
    resave: true,
    saveUninitialized: true
}));
// app.use(passport.session());//persistent login session
// app.use(passport.initialize());

//cors middleware to handle cross-origin request
app.use(cors());

// serving static files to the client    
app.use('/public', express.static(path.join(__dirname + '/public')));
app.get("/", (req, res) => {
	res.send("Welcome to authentication API.")
})
// Api Routes For application 

app.use('/api', userRoutes);

//setting a port 
const port = 3000;

app.listen(port,function(){
	console.log(`server starts running on port ${port}`);
});

//exporting an app
module.exports = app;
