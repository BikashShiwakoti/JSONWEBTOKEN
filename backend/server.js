const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userCredential = require('./credentials');
const jwt = require('jsonwebtoken');
const path = require('path'); // Import the path module

require('dotenv').config();
const session = require('express-session');
const app = express();
const cookieParser = require('cookie-parser');
const secretKey = 'f382f65ce8cb785b5f094411b59ece18bd30224613d92324ddfe3d66b419332cff45a9f665b457b7c1a5f12831d5d24eb4747024a3198e52dc425d786ccd6945';
app.use(cookieParser());
const multer = require('multer');
const userPhotos = require('./photos');
app.use(session({
    secret:'bikashissecret',
    saveUninitialized:false,
    resave:false,
    cookie: {secure:false,
        maxAge: 1000*24*60*60
    }
}));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(express.json());
app.use(cors());


const storage = multer.diskStorage({
    destination: function(req, res, cb){
        cb (null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, + Date.now() + '-' +file.originalname )
    }
});
 const upload = multer ({storage: storage});
 

//database connection
mongoose.connect(process.env.URI)
.then(()=>{
    console.log("Database connected")
    app.listen(process.env.PORT || 5000, ()=>{
        console.log("Server is listening to port", process.env.PORT);
    })
})

//api endpoints for signup
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await userCredential.findOne({ email: email });
        if (existingUser) {
             res.status(400).send("Email already exists. Please try another email.");
             return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user document
        const newUser = new userCredential({
            email: email,
            password: hashedPassword
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Send success response
        res.status(200).send("User created successfully");
    } catch (error) {
        // Handle errors
        console.error("Error creating user:", error);
        res.status(500).send("An error occurred while creating user.");
    }
});


//api endpoint for logging

app.post('/login', async(req, res) => {

    const {email, password} = req.body;
   try {
    const user = await userCredential.findOne({email:email});
    if(user && await bcrypt.compare(password, user.password)){
        const accessToken = jwt.sign(user.toJSON(), secretKey)
        res.status(200).json({ accessToken: accessToken, message: 'Login Successful' });

    }else{
        res.status(400).send("Email or Password incorrect. Try again!!")
    }
   } catch (error) {
    res.status(500).send("An error occurred while logging user.");
}
})


app.post('/saveData', authenticateToken,upload.single('photo'), async(req, res) => {

    const userId = req.user._id;
    if(!req.file){
        return res.status(400).send('No file uploaded.');

    }

    const imagePath = req.file.path;
    const userPhoto = new userPhotos({
        imagePath,
        userId
    });
    try {
        await userPhoto.save();
        console.log('Item data saved successfully.');
        res.status(200).send('Item data saved successfully.');
      } catch (error) {
        console.error('Could not save item data:', error);
        res.status(500).send('Could not save item data.');
      }
})

app.get('/getUserData', authenticateToken, async (req, res) => {
    try {
      const data = await userPhotos.find();
      
      if (data.length > 0) {
        const imagePath = data.map(item => item.imagePath);
        

        res.status(200).json({ imagePath });
      } else {
        res.status(404).send({ message: 'No data found' });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  });
  




app.get('/home', authenticateToken  , (req, res) =>{
       // res.status(200).send("Autheticated")
 
})


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (typeof authHeader !== 'undefined') {
        const bearer = authHeader.split(' ');
        const token = bearer[1]; // Access the token from the split array

        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                res.status(403).send({ result: "Token is not valid" });
            } else {
                req.user = user;
                next();
            }
        });
    } else {
        res.status(401).send({ result: "Token is not provided" });
    }
}

 
