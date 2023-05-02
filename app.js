const express = require('express');
const app =  express();
const bodyParser = require('body-parser');
var cors = require("cors");
const mongoose = require('mongoose');
const port = process.env.PORT || 8080
const multer = require('multer');
const fs = require('fs');
const path =require('path')
app.set('view engine', 'ejs')


const mongURL = "mongodb+srv://admin:bK9oZDsnBMNuGf91@checkfier.bywera9.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(mongURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
 } )
 // models
 require('./models/User')
 require('./models/Reward')
 require('./models/Store')
 require('./models/Adds')
 require('./models/Campaigns')
 const User = mongoose.model("user")
 const Reward = mongoose.model("reward")
 const Store = mongoose.model("store")
 const Ad = mongoose.model("ad")
 const Campaign = mongoose.model("campaign")
 app.use(bodyParser.json())
 app.use(express.json());
 app.use(cors());
 app.use(express.urlencoded({ extended: true }));
 app.use(express.static('assets'));

 mongoose.connection.on("connected",()=>{
    console.log("Connected Successfully!")
 })
 mongoose.connection.on("error",(err)=>{
    console.log("error", err)
 })

  //all users api //
 app.get('/allUsers', async (req, res) => {
   try {
     const users = await User.find();
     res.send(users);
   } catch (error) {
     res.status(500).send({ message: error.message });
   }
 });
 
 //add points api //
 app.put('/users', async (req, res) => {
   try {
      console.log(req.body.phone)
      const phone = req.body.phone;

     const user = await User.findOne({ phone });
     if (!user) {
       return res.status(404).send({ message: 'User not found' });
     }
     // update user status, date, and points
     user.status = req.body.status;
     user.date = req.body.date;
     const currentPoints = user.points;
     const newPoints = parseInt(req.body.points);
     const totalPoints = currentPoints + newPoints;
     user.points = totalPoints;

     await user.save();
     res.send(user);
   } catch (error) {
     res.status(500).send({ message: error.message });
   }
 });
 
  //add rewards api //
  app.post('/rewards', async (req, res) => {
   try {
      const reward = new Reward(req.body);
     reward.name = req.body.name;
     reward.type = req.body.type;
     reward.date = req.body.date;
     reward.points = req.body.points;

     await reward.save();
     res.send(reward);
   } catch (error) {
     res.status(500).send({ message: error.message });
   }
 });
  
 // Set up Multer storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'public/uploads/');
  },
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize Multer upload
const upload = multer({ storage: storage });
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware function to retrieve store data from database
async function getStoreData(req, res, next) {
  try {
    const store = await Store.findOne().sort({ createdAt: -1 });
    console.log('Store data retrieved successfully:', store);
    res.locals.store = store;
    next();
  } catch (error) {
    console.error('Error fetching store data', error);
    res.redirect('/error');
  }
};
// Use the middleware function for all routes that need to access store data
app.use(getStoreData);


app.get('/essential', function(req,res){
  const store = res.locals.store;
  res.render('essential',{store: store});
})
app.get('/storeset', function(req,res){
  const store = res.locals.store ;
  res.render('storeset',{store: store});
});
app.get('/', function(req,res){
  const store = res.locals.store ;
  res.render('dashboard',{store: store});
})
app.get('/dashboard', function(req,res){
  const store = res.locals.store ;
  res.render('dashboard',{store: store});
})
app.get('/loyality', function(req,res){
  const store = res.locals.store ;
  res.render('loyality',{store: store});
})
app.get('/campaigns', function(req,res){
  const store = res.locals.store ;

  res.render('campaigns',{store: store});
})
app.get('/queseval', function(req,res){
  const store = res.locals.store ;

  res.render('queseval',{store: store});
})
app.get('/advertisement', function(req,res){
  const store = res.locals.store ;
  res.render('advertisement',{store: store});
})
app.get('/campaignset', function(req,res){
  const store = res.locals.store ;
  res.render('campaignset',{store:store});
})
app.get('/rewards', function(req,res){
  const store = res.locals.store ;
  res.render('rewards',{store: store});
})
app.get('/points', function(req,res){
  const store = res.locals.store ;
  res.render('points',{store: store});
})
app.get('/allusers', function(req,res){
  const store = res.locals.store ;
  res.render('allusers',{store: store});
})

//routing to notification settings interface
app.get('/notif', (req, res) => {
  res.render('notif');
  
  });

//routing to langauge settings interface
  app.get('/language', (req, res) => {
    res.render('language');
    
    });

//routing to personal settings interface
  app.get('/settings', (req, res) => {
      res.render('settings');
      
      });

  //routering of notif-admin settings 
  app.get('/notifAdmin', (req, res) => {
    res.render('notifAdmin');
    
    });
    
  //routering of notif-user settings 
  app.get('/notifUser', (req, res) => {
    res.render('notifUser');
    
    });
/////////////////

// Upload image api
app.post('/upload', upload.single('logo'), function(req, res) {
  const store = new Store({
      name: req.body.storeName,
      logo: '/uploads/' + req.file.filename,
      color: req.body.storeColor
  });

  store.save().then(() => {
      res.redirect('/essential');
  }).catch((error) => {
      console.error('Error saving store data', error);
      res.redirect('/error');
  });
});

app.get('/store', function(req, res) {
  if (!res.locals.store) {
      return res.redirect('/essential');
  }
  res.render('store');
});


// Adds

const add = multer({ dest: 'advertisement/' });

app.post('/add', add.single('image'), function(req, res) {
  const { type, link } = req.body;
  const image = req.file;

  // Save the data to the database
  const newAd = new Ad({
    type,
    link,
    image: {
      data: fs.readFileSync(image.path),
      contentType: image.mimetype
    }
  });

  newAd.save()
  .then(() => {
    console.log("done")
    res.send("Ad was added successfully ✔");
  })
  .catch(err => {
    console.error(err);
    res.sendStatus(500);
  });

});

// Adds

const addCam = multer({ dest: 'campaigns/' });

app.post('/new', addCam.single('image'), function(req, res) {
  const { type, name } = req.body;
  const image = req.file;

  // Save the data to the database
  const newCampaign = new Campaign({
    type,
    name,
    image: {
      data: fs.readFileSync(image.path),
      contentType: image.mimetype
    }
  });

  newCampaign.save()
  .then(() => {
    console.log("done")
    res.send("Campaign was added successfully ✔");
  })
  .catch(err => {
    console.error(err);
    res.sendStatus(500);
  });

});


 



 

 app.listen(port,()=>{
    console.log(`Listening on ${port} `)
})
