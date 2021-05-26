const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload')
const errorMiddleware = require('./middlewares/errors')
const dotenv = require('dotenv');
dotenv.config({path:'config/config.env'});

app.use(express.json());
app.use( bodyParser.urlencoded( { extended: true } ) );

app.use(cookieParser())
app.use(cors())
app.use(fileUpload())


//Import all route

const products = require('./routes/product')
const auth = require('./routes/auth')
const order = require('./routes/order');
const payment = require('./routes/payment')
const { countDocuments } = require('./model/product');
app.use('/api/v1',products)
app.use('/api/v1',auth)
app.use('/api/v1',order)
app.use('/api/v1',payment)
app.use(errorMiddleware)
module.exports = app;