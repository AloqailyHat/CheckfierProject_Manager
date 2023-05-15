const express = require('express');
const app =  express();
const session = require('express-session');
const bodyParser = require('body-parser');
var cors = require("cors");
const mongoose = require('mongoose');
const port = process.env.PORT || 8080
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcrypt');
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
 require('./models/Rating')
 require('./models/Question')
 require('./models/Redeem')
 require('./models/Admin')


 const User = mongoose.model("user")
 const Reward = mongoose.model("reward")
 const Store = mongoose.model("store")
 const Ad = mongoose.model("ad")
 const Campaign = mongoose.model("campaign")
 const Rating = mongoose.model("rating")
 const Question = mongoose.model("question")
 const Redeem = mongoose.model("redeem")
 const Admin = mongoose.model("admin")
 
 
 app.use(bodyParser.json())
 app.use(express.json());
 app.use(cors());
 app.use(express.urlencoded({ extended: true }));
 app.use(express.static('assets'));

 // Configure express-session middleware
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false
}));



 mongoose.connection.on("connected",()=>{
    console.log("Connected Successfully!")
 })
 mongoose.connection.on("error",(err)=>{
    console.log("error", err)
 })

  //show users api //
 app.get('/showUsers', async (req, res) => {
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
     reward.code = req.body.code;
     await reward.save();
     console.log("reward saved:",reward);
     res.send(reward);
     console.log(reward);
   } catch (error) {
     res.status(500).send({ message: error.message });
   }
 });
  


//  retrieve store data from database
async function getStoreData(req, res, next) {
  try {
    const store = await Store.findOne().sort({ createdAt: -1 });
    console.log('Store data retrieved successfully:');

    // Decode the logo image data from base64 to binary data
    const binaryData = Buffer.from(store.logo, 'base64');
    // Convert the binary data to a data URL
    const dataUrl = `data:image/png;base64,${binaryData.toString('base64')}`;

    // Add the logo data URL to the store object
    const storeWithLogo = { ...store.toObject(), logo: dataUrl };
    res.locals.store = storeWithLogo;
    next();
  } catch (error) {
    console.error('Error fetching store data', error);
    res.redirect('/error');
  }
}
// Use the middleware function for all routes that need to access store data
app.use(getStoreData);


  //routering of essential view 

app.get('/essential', function(req,res){
  const store = res.locals.store;
  res.render('essential',{store: store});
})
  //routering of storeset view
app.get('/storeset', function(req,res){
  const store = res.locals.store ;
  res.render('storeset',{store: store});
});
  //routering of main view 
app.get('/', function(req,res){
  const store = res.locals.store ;
  res.render('signup',{store: store});
})
  //routering of dashboard 
app.get('/dashboard', function(req,res){
  const store = res.locals.store ;
  res.render('dashboard',{store: store});
})
  //routering of signup 
  app.get('/signup', function(req,res){
    const store = res.locals.store ;
    res.render('signup',{store: store});
  })
    //routering of login
app.get('/login', function(req,res){
  const store = res.locals.store ;
  res.render('login',{store: store});
})
  //routering of loyality view
app.get('/loyality', function(req,res){
  const store = res.locals.store ;
  res.render('loyality',{store: store});
})
  //routering of queseval view 


  //routering of advertisement settings 
app.get('/advertisement', function(req,res){
  const store = res.locals.store ;
  res.render('advertisement',{store: store});
})
  //routering of campains view 
app.get('/campaigns', function(req,res){
  const store = res.locals.store ;
  const campaigns = res.locals.campaigns;
  res.render('campaigns',{store, campaigns});
})
  //routering of rewards view 
app.get('/rewards', function(req,res){
  const store = res.locals.store ;
  res.render('rewards',{store: store});
})
  //routering of points view 
app.get('/points', function(req,res){
  const store = res.locals.store ;
  res.render('points',{store: store});
})
  //routering of users view 
app.get('/allusers', function(req,res){
  const store = res.locals.store ;
  res.render('allusers',{store: store});
})
  //routering of notification settings 
app.get('/notif', function(req,res){
  const store = res.locals.store ;
  res.render('notif',{store: store});
})
  //routering of language settings 
app.get('/language', function(req,res){
  const store = res.locals.store ;
  res.render('language',{store: store});
})
  //routering of settings settings 
app.get('/sttings', function(req,res){
  const store = res.locals.store ;
  res.render('sttings',{store: store});
})
  //routering of notif-admin settings 
app.get('/notifAdmin', function(req,res){
  const store = res.locals.store ;
  res.render('notifAdmin',{store: store});
})
  //routering of notif-user settings 
app.get('/notifUser', function(req,res){
  const store = res.locals.store ;
  res.render('notifUser',{store: store});
})
 
app.get('/stat', function(req,res){
  const store = res.locals.store ;
  res.render('stat',{store: store});
})

// Upload store data logo, name and color
const upload = multer();

app.post('/upload', upload.single('logo'), function(req, res) {
  const store = new Store({
      name: req.body.storeName,
      logo: '',
      color: req.body.storeColor
  });

  fs.readFile(req.file.path, function(err, data) {
    if (err) {
      console.error('Error reading logo image:', err);
      res.status(500).send('Error reading logo image');
    } else {
      const base64Data = Buffer.from(data).toString('base64');
      store.logo = base64Data;
      store.save().then(() => {
        res.redirect('/essential');
      }).catch((error) => {
        console.error('Error saving store data', error);
        res.redirect('/error');
      });
    }
  });
});


app.get('/store', function(req, res) {
  if (!res.locals.store) {
      return res.redirect('/essential');
  }
  res.render('store');
});


//add advertisement api
const ad = multer();
app.post('/ad', ad.single('image'), function(req, res) {
  const { type, link } = req.body;
  const imageData = req.file.buffer;
  // Convert the image data to a base64-encoded string
  const base64Image = imageData.toString('base64');
   
  // Save the data to the database
  const newAd = new Ad({
    type,
    link,
    image: base64Image
  });

  newAd.save()
    .then(() => {
      console.log("done", newAd)
      res.send("<script>alert('Ad was added successfully ✔'); window.location.href='/advertisement';</script>");
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});


// Add campaigns
const addCamp = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'campaigns/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
}); 

const uploadCamp = multer({ storage: addCamp }).fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 }
]);

app.post('/newCamp', function(req, res, next) {
  uploadCamp(req, res, function (err) {
    if (err) {
      // Handle the error
      return next(err);
    }
    
    const { type, name } = req.body;
    const image1 = req.files['image1'][0];
    const image2 = req.files['image2'][0];

    // Save the data to the database
    const newCampaign = new Campaign({
      type,
      name,
      image1: image1.path,
      image2: image2.path
    });

    newCampaign.save()
    .then(() => {
      console.log("done",newCampaign)
      res.send("<script>alert('Campaign was added successfully ✔'); window.location.href='/campaigns';</script>");
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });

});
});
/*
// show campaigns 
app.use(function(req, res, next) {
  Campaign.find({})
    .then(campaigns => {
      res.locals.campaigns = campaigns;
      next();
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    });
});
*/
// show evaluations

app.use(function(req, res, next) {
  Rating.find({})
    .then(rows => {
      console.log('Retrieved ratings successfully:', rows);
      res.locals.rows = rows;
      next();
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    });
});

  //routering of queseval view 

  app.get('/queseval', function(req,res){
    const store = res.locals.store ;
    const rows = res.locals.rows ;
    res.render('queseval',{store, rows});
  })

  // Send a response to the user
  app.post('/reply', (req, res) => {
    const { id, reply } = req.body;
    Rating.findByIdAndUpdate(id, { reply }, { new: true })
      .then((rating) => {
        console.log(rating);
        res.send('Rating updated successfully');
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error updating rating');
      });
  });
  

  
  

  app.get('/queseval', function(req, res) {
    const store = res.locals.store;
    const rows = res.locals.rows;
    const messages = req.session.messages || {};
    req.session.messages = {};
    res.render('queseval', { store, rows, messages });
  });
  
  
  app.get('/notifications', (req, res) => {
    const notification = [];
    // Retrieve the last unanswered question
Question.findOne({
  where: { answered: false },
  order: [['createdAt', 'DESC']],
  attributes: ['question']
}).then(question => {
  if (question) {
    // Create a new notification for the last unanswered question
    Notification.create({
      type: 'question',
      message: question.question,
      read: false
    }).then(notification => {
      console.log('New notification created:', notification);
    }).catch(error => {
      console.error('Error creating notification:', error);
    });
  }
});

// Retrieve the last redeem record
Redeem.findOne({
  order: [['createdAt', 'DESC']],
  attributes: ['redeem']
}).then(redeem => {
  if (redeem) {
    // Create a new notification for the last redeem record
    Notification.create({
      type: 'redeem',
      message: redeem.redeem,
      read: false
    }).then(notification => {
      console.log('New notification created:', notification);
    }).catch(error => {
      console.error('Error creating notification:', error);
    });
  }
});

// Retrieve the last rating with a comment
Rating.findOne({
  where: { comment: { [Op.not]: null } },
  order: [['createdAt', 'DESC']],
  attributes: ['comment']
}).then(rating => {
  if (rating) {
    // Create a new notification for the last rating with a comment
    Notification.create({
      type: 'rating',
      message: rating.comment,
      read: false
    }).then(notification => {
      console.log('New notification created:', notification);
    }).catch(error => {
      console.error('Error creating notification:', error);
    });
  }
});

// Retrieve the last user with more than 100 points
User.findOne({
  where: { points: { [Op.gt]: 100 } },
  order: [['createdAt', 'DESC']],
  attributes: ['id', 'points']
}).then(user => {
  if (user) {
    // Create a new notification for the last user with more than 100 points
    Notification.create({
      type: 'points',
      message: `User ${user.id} has more than 100 points`,
      read: false
    }).then(notification => {
      console.log('New notification created:', notification);
    }).catch(error => {
      console.error('Error creating notification:', error);
    });
  }
});
  })


   //routering of show-notif view
 app.get('/showNotif', (req, res) => {
  const store = res.locals.store ;
  const notifications = res.locals.notifications;
  res.render('showNotif',{store: store, notifications});
  
  });
  // signup
  app.post('/signup', async (req, res) => {
    try {
      // Extract user input from the request body
      const { business_name, email, phone_number, password } = req.body;
  
      // Hash the user's password using a library like bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user in the database
      const admin = new Admin({
        business_name,
        email,
        phone_number,
        password: hashedPassword
      });
  
      await admin.save();
  
      // Set the user ID in the session to maintain authentication state
      req.session.adminId = admin._id;
  
      // Send a success response to the client
      res.send("<script>alert('User created successfully ✔'); window.location.href='/dashboard';</script>");

    } catch (error) {
      res.send("<script>alert('Can not creating user'); window.location.href='/';</script>");
      ;
  
      // Send an error response to the client
      res.status(500).json({
        success: false,
        message: 'Error creating user'
      });
    }
  });
  
 
  // login
  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Invalid login credentials'
        });
      }
  
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid login credentials'
        });
      }
  
      req.session.adminId = admin._id;
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).send('Error logging in');
    }
  });
  
  
  
  

  
  
  

  
  









 



 

 app.listen(port,()=>{
    console.log(`Listening on ${port} `)
})
