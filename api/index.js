const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User  = require('./models/User');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const cookieParser = require('cookie-parser');
const download = require('image-downloader');
const multer= require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();


var salt = bcrypt.genSaltSync(10);
const jwtSecret = 'jhbnfjbsk6789HUFBU823HBJDJGJBHZHJGVBFZI7I2B8R3B'

mongoose.connect(process.env.MONGO_URL)
    .then((result)=> app.listen(4000))
    .catch((err)=> console.log(err))


app.use(express.json())
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://127.0.0.1:5173'  
}));


app.get('/test',(req,res)=>{
    res.json("ggHHHHggg")
})


app.post('/register', async(req,res)=>{
    const {name, email, password} = req.body;
    try {
        const userDoc = await User.create({
            name,
            email, 
            password: bcrypt.hashSync(password, salt)
        });
        res.json(userDoc);
    } catch (error) {
        res.status(422).json(error);
    } 
})

app.post('/login', async(req,res)=>{
    const {email, password} = req.body;
        const user = await User.findOne({email});
        if (user){
            const passOk= bcrypt.compareSync(password, user.password);
            if(passOk){
                jwt.sign({email: user.email, id: user._id}, jwtSecret, {} ,(err, token)=>{
                    if (err) throw err;
                    res.cookie('token', token,{ sameSite: 'None', secure: true }).json(user);
                })
            }else{
                res.status(422).json('pass not ok')
            }

        } else{
            res.status(401).json('email not found')
        }
    
})

app.get('/profile', (req,res)=>{
    const {token} = req.cookies;
    if(token){
        jwt.verify(token, jwtSecret, {}, async(err, user)=>{
            if(err) throw err;
            const {email, name, _id} = await User.findById(user.id)
            res.json({email, name, _id});
        })
    }else{
        res.json(null)
    }
})

app.post('/logout', (req, res)=>{
    res.cookie('token', '',{ sameSite: 'None', secure: true }).json(true);
})
console.log(__dirname)
app.post('/upload-by-link', async(req, res)=>{
    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg'
    await download.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName);
})

const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload',photosMiddleware.array('photos', 100),(req, res)=>{
    const uploadFiles = [];
    for (let i=0; i < req.files.length; i++){
        const {path, originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadFiles.push(newPath.replace('uploads\\',''));
    }
    res.json(uploadFiles);
})

app.post('/places',(req, res)=>{
    const {token} = req.cookies;
    const {
        title,address,photos,description,maxBaby,maxChilds,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
    } = req.body;
    if(token){
        jwt.verify(token, jwtSecret, {}, async(err, userData)=>{
        if(err) throw err;
        const placeDoc = await Place.create({
            owner:userData.id,
            title,address,photos,description,maxBaby,maxChilds,
            perks,extraInfo,checkIn,checkOut,maxGuests,price
        });
        res.json(placeDoc);
        })
    }else{
        res.json(null)
    }
})

app.get('/user-places', async(req, res)=>{
    const {token} = req.cookies;
    if(token){
        jwt.verify(token, jwtSecret, {}, async(err, userData)=>{
        if(err) throw err;
        const places = await Place.find({ owner: userData.id });
        res.json(places);
        })
    }else{
        res.json(null)
    }
})

app.get('/places', async(req, res)=>{
    const places = await Place.find();
    res.json(places);
})

app.get('/place/:id', async(req, res)=>{
    
        const id = req.params.id;
        const place = await Place.findById(id);
        res.json(place);
   
})

app.put('/place/:id', async(req, res)=>{
    const {token} = req.cookies;
    if(token){
        jwt.verify(token, jwtSecret, {}, async(err, userData)=>{
        if(err) throw err;
        const {
            title,address,photos,description,maxBaby,maxChilds,
            perks,extraInfo,checkIn,checkOut,maxGuests,price
        } = req.body;
        const id = req.params.id;
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()){
            const place = await Place.findByIdAndUpdate(id,{
                title,address,photos,description,maxBaby,maxChilds,
                perks,extraInfo,checkIn,checkOut,maxGuests,price
            });
            res.json(place);
        }
        })
    }else{
        res.json(null)
    }
})

app.post('/deletePhotos', (req, res) => {
    const { deletedPhotos } = req.body;
    for (let i = 0; i < deletedPhotos.length; i++) {
        fs.unlink(__dirname + '/uploads/' + deletedPhotos[i], (error) => {
            if (error) {
                console.error('Error deleting photo:', error);
            } else {
                console.log('Deleted photo:', __dirname + '/uploads/' + deletedPhotos[i]);
            }
        });
    }
    res.sendStatus(200);
});

app.post('/booking',(req, res)=>{
    const {token} = req.cookies;
    const {
        place, name, phone, allInfo: { checkIn, checkOut, totalOfGuests },
        price
    } = req.body;
    if(token){
        jwt.verify(token, jwtSecret, {}, async(err, userData)=>{
        if(err) throw err;
        const bookingDoc = await Booking.create({
            owner:userData.id,
            place, name, phone, checkIn, checkOut, totalOfGuests,price
        });
        res.json(bookingDoc);
        })
    }else{
        res.json(null)
    }
})

app.get('/booked-dates/:id', async(req, res)=>{
    const id = req.params.id;
    try {
        const bookings = await Booking.find({ place: new mongoose.Types.ObjectId(id) });
        res.json(bookings);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
function getUserDataFromToken(req){
    return new Promise((resolve, reject)=>{
        jwt.verify(req.cookies.token, jwtSecret, {}, async(err, userData)=>{
            if(err) throw err;
            resolve(userData)
        })
    })
}

app.get('/bookings', async(req, res)=>{
    const userData = await getUserDataFromToken(req);
    res.json(await Booking.find({owner: userData.id}).populate('place'));
})
