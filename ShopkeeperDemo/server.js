const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
require('dotenv').config() 
require('./utils/database')
const auth = require('./routes/auth')
const users = require('./routes/users')
const shops = require('./routes/shop')
const customer = require('./routes/customer')
const transaction = require('./routes/transaction')

app.use(cors( {origin: 'http://192.168.1.250:3000'} ))
app.use(express.json())

app.use("/profile", express.static(path.join(__dirname, '/public/profile')));
app.use("/logo", express.static(path.join(__dirname, '/public/logo')));

// app.use((req, res, next) => {
//     // TODO: use cors package
//     res.setHeader("Access-Control-Allow-Origin", "http://192.168.1.250:3000");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     next();
// });

app.use('/api',auth)
app.use('/api/users',users)
app.use('/api/shop',shops)
app.use('/api/customer',customer)
app.use('/api/transaction',transaction)
const PORT =  process.env.PORT || 8080;
app.listen(PORT ,()=>{console.log(`Server is running on port ${PORT}`)})