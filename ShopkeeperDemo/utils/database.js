const mongoose = require('mongoose')

mongoose
.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{console.log('Connected to MongoDB!!')})
.catch(()=>{console.log('Something went wrong with connection!!')})