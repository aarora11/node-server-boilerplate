//#1

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const router = require('./router');
const mongoose = require('mongoose');


//DB Setup
mongoose.connect('mongodb://localhost:auth/auth');


//#3
//App Setup
app.use(morgan('combined')); //--midlleware --logging framework --used for debugging
app.use(bodyParser.json({type: '*/*'}));  //--midlleware any incoming request will passthrough these. -- parse incoming requests into json 
router(app);


//comment
//#2
//Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("Server Listening on ", port);
