const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
dotenv.config();
//Connect to DB

mongoose.connect(
    process.env.DB_CONNECTION,
     { useNewUrlParser : true , useUnifiedTopology : true},
     ()=> console.log('Connection to DB established'),    
 );


// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes Middleware
const courseRoute = require('./routes/courses');
app.use('/courses' , courseRoute);
const userRoute = require('./routes/users');
app.use('/users', userRoute);


app.listen( process.env.PORT , ()=>{
    console.log('App running on port 3000');
});
