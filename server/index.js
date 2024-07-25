const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const {mongoose} = require('mongoose')
const cookieParser = require('cookie-parser')
const app = express();
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userDetails = require('./routes/userDetailsRoutes');
const authRoutes = require('./routes/authRoutes')
const path = require("path");


dotenv.config({path: './config.env'})

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log('connected to db'))
.catch((err)=>console.log(err))

//middleware
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))

app.use('/' , authRoutes)
app.use('/api/projects', projectRoutes);

//task
app.use('/api', taskRoutes);

//user details
app.use('/api/userDetails',userDetails);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
});
const port = 8000;
app.listen(port,()=>console.log(`server running on port ${port}`))
