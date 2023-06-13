const express = require('express');
const app =  express();
const session = require('express-session');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
var cors = require("cors");
const mongoose = require('mongoose');
const port = process.env.PORT || 8080
const multer = require('multer');
const fs = require('fs');
const http = require('http');
const server = http.createServer();
const path = require("path")

const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'ar'],
  directory: __dirname + '/locales',
  defaultLocale: 'en'
});


// Set up session middleware
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000
  }
}));


app.use(cookieParser());
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(i18n.init);


const bcrypt = require('bcrypt');

app.set('view engine', 'ejs')

const mongURL = "mongodb+srv://admin:bK9oZDsnBMNuGf91@checkfier.bywera9.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(mongURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000 // 1 minute timeout

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
 require('./models/Notification')




 const User = mongoose.model("user")
 const Reward = mongoose.model("reward")
 const Store = mongoose.model("store")
 const Ad = mongoose.model("ad")
 const Campaign = mongoose.model("campaign")
 const Rating = mongoose.model("rating")
 const Question = mongoose.model("question")
 const Redeem = mongoose.model("redeem")
 const Admin = mongoose.model("admin")
 const Notification = mongoose.model("notification")

 
 app.use(bodyParser.json())
 app.use(express.json());
 app.use(cors());
 app.use(express.urlencoded({ extended: true }));
 app.use(express.static('assets'));
 app.use(i18n.init);
 



 mongoose.connection.on("connected",()=>{
    console.log("Connected Successfully!")
 })
 mongoose.connection.on("error",(err)=>{
    console.log("error", err)
 })

// Language //
 // Choose language 
 app.post('/language', function(req, res) {
  const language = req.body.language || 'en';
  res.cookie('language', language, { maxAge: 900000, httpOnly: true });
  res.redirect('/dashboard');
});

// Set language preferences in cookies
app.use(function(req, res, next) {
  const language = req.cookies.language || 'en';
  req.setLocale(language);
  next();
});

// End Language //

//  retrieve store data from database
async function getStoreData(req, res, next) {
  try {
    const adminId = req.session.adminId;
    const storeName = 'Checkfier';

    let store;

    if (adminId) {
      store = await Store.findOne({ adminId });
    }

    if (!store) {
      const storeId = req.cookies.store;
      if (storeId) {
        store = await Store.findById(storeId);
      }
    }

    if (!store) {
      store = await Store.findOne({ name: storeName });
    }

    if (!store) {
      throw new Error('No store found');
    }

    console.log('Store data retrieved successfully:');

    const binaryData = Buffer.from(store.logo, 'base64');
    const dataUrl = `data:image/png;base64,${binaryData.toString('base64')}`;
    const storeWithLogo = { ...store.toObject(), logo: dataUrl };
    res.locals.store = storeWithLogo;

    // Create a cookie with the store ID
    res.cookie('store', store._id);

    next();
  } catch (error) {
    console.error('Error fetching store data', error);
    res.redirect('/error');
  }
}


// Use the middleware function for all routes that need to access store data
app.use(getStoreData);



// Return Users//

  //show users api //
  app.get('/showUsers', async (req, res) => {
    try {
      const store_id = req.cookies.store;
      const users = await User.find({ store: store_id });
      console.log('store id',store_id)
      res.send(users);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  

// Define the /users/filter endpoint
app.get('/users/filter', async (req, res) => {
  const store_id = req.cookies.store;
  console.log(store_id)
  const filter = req.query.filter;
  if (filter === 'oldest') {
    const oldestUsers = await User.find({ store: store_id }).sort({ createdAt: 1 }).limit(6);
    res.send({ users:oldestUsers});
    console.log({ users:oldestUsers})

  } else if (filter === 'latest') {
    const latestUsers = await User.find({ store: store_id }).sort({ createdAt: -1 }).limit(6);
    res.send({users:latestUsers});
    console.log(latestUsers)
  } else {
    res.status(400).send('Invalid filter parameter');
  }
});


///
app.get('/newMembers', async (req, res) => {
  try {
    const store_id = req.query.store_id; // Get the store_id query parameter
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
    const filter = store_id ? { createdAt: { $gte: startOfMonth, $lte: endOfMonth }, store: store_id } : { createdAt: { $gte: startOfMonth, $lte: endOfMonth } }; // Add the store_id filter if it exists
    const userCount = await User.countDocuments(filter);
    res.json({ count: userCount });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


// End Users //

//add rewards api //
app.post('/rewards', async (req, res) => {
  try {
    const store = req.cookies.store
    const reward = new Reward({
    name : req.body.name,
    type : req.body.type,
    date : req.body.date,
    points : req.body.points,
    code : req.body.code,
    store: store
  });
    await reward.save();
    console.log("reward saved:",reward);
    res.send(reward);
    console.log(reward);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
  


  //routering of essential view 

app.get('/essential', function(req,res){
  let store = res.locals.store;
  res.render('essential',{store: store});
})
  //routering of storeset view
app.get('/storeset', function(req,res){
  let store = res.locals.store ;
  res.render('storeset',{store: store});
});
  //routering of main view 
app.get('/', function(req,res){
  let store = res.locals.store ;
  res.render('signup',{store: store});
})
  //routering of dashboard 
  app.get('/dashboard', async (req, res) => {
    try {
      const store_id = req.cookies.store;
      const userCountResponse = await fetch(`http://localhost:8080/newMembers?store_id=${store_id}`);
      const userCountData = await userCountResponse.json();
      const userCount = userCountData.count;
      // Get total points and expired points for store_id
      const activePointsResponse = await User.aggregate([
        { $match: { store: store_id } }, // Filter by store_id
        { $group: { _id: null, total: { $sum: "$points" }, expired: { $sum: { $cond: [{ $lt: ["$pointsExpiration", new Date()] }, "$points", 0] } } } }
      ]);
      const totalPoints = activePointsResponse && activePointsResponse[0] && activePointsResponse[0].total || 0;
      const expiredPoints = activePointsResponse && activePointsResponse[0] && activePointsResponse[0].expired || 0;
      const usedPointsResponse = await Redeem.aggregate([
        { $match: { store: store_id } }, // Filter by store_id
        { $group: { _id: null, total: { $sum: "$points" }, expired: { $sum: { $cond: [{ $lt: ["$pointsExpiration", new Date()] }, "$points", 0] } } } }
      ]);
      const totalUsedPoints = usedPointsResponse && usedPointsResponse[0] && usedPointsResponse[0].total || 0;
  
      let store = res.locals.store;
      res.render('dashboard', { userCount, totalPoints, expiredPoints, totalUsedPoints, store });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  

  //routering of signup 
  app.get('/signup', function(req,res){
    let store = res.locals.store ;
    res.render('signup',{store: store});
  })
    //routering of login
app.get('/login', function(req,res){
  let store = res.locals.store ;
  res.render('login',{store: store});
})

  //routering of advertisement settings 
app.get('/advertisement', function(req,res){
  let store = res.locals.store ;
  res.render('advertisement',{store: store});
})
  //routering of personal settings 
  app.get('/settings', function(req,res){
    let store = res.locals.store ;
    res.render('settings',{store: store});
  })

  //routering of points view 
app.get('/points', function(req,res){
  let store = res.locals.store ;
  res.render('points',{store: store});
})
  //routering of users view 
app.get('/allusers', function(req,res){
  let store = res.locals.store ;
  res.render('allusers',{store: store});
})
  //routering of notification settings 
app.get('/notif', function(req,res){
  let store = res.locals.store ;
  res.render('notif',{store: store});
})
  //routering of language settings 
app.get('/language', function(req,res){
  let store = res.locals.store ;
  res.render('language',{store: store});
})
 
  //routering of notif-admin settings 
app.get('/notifAdmin', function(req,res){
  let store = res.locals.store ;
  res.render('notifAdmin',{store: store});
})
  //routering of notif-user settings 
app.get('/notifUser', function(req,res){
  let store = res.locals.store ;
  res.render('notifUser',{store: store});
})
 

//routering of loyality view
  app.get('/loyality', function(req,res){
    let store = res.locals.store ;
    res.render('loyality',{store});
  })

// Upload store data logo, name and color
const upload = multer();
app.post('/create-store', upload.single('logo'), function(req, res) {
  const adminId = req.session.adminId;
  const storeName = req.body.storeName;

  // Check if the store name already exists in the database
  Store.findOne({ name: storeName }).then(existingStore => {
    // If the store name already exists, return an error
    if (existingStore) {
      res.status(400).send('The store name is already used');
      return;
    }
       // Convert the logo image data to base64
       const base64Data = req.file.buffer.toString('base64');


    // Create a new store object
    const store = new Store({
      name: storeName,
      logo: base64Data,
      color: req.body.storeColor,
      adminId: adminId
    });
    // Save the store
    store.save().then(() => {
      // Check if req.file is defined before using it
      if (!req.file) {
        console.error('Error reading logo image: no file uploaded');
        res.status(400).send('No file uploaded');
        return;
      }

   
      // Redirect the user to the /essential page
      res.redirect('/essential');
    }).catch(err => {
      console.error('Error saving store:', err);
      res.status(500).send('Error saving store: ' + err.message);
    });
  }).catch(err => {
    console.error('Error finding store:', err);
    res.status(500).send('Error finding store: ' + err.message);
  });
});



 //add points api //
 app.put('/users', async (req, res) => {
  try {
    const phone = req.body.phone;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Update user status, date, and points
    user.status = req.body.status;
    user.date = req.body.date;
    const currentPoints = user.points;
    const newPoints = parseInt(req.body.points);
    const totalPoints = currentPoints + newPoints;
    user.points = totalPoints;

    // Set expiration date for points
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 2); // set expiration date to 2 months from now
    user.pointsExpiration = expirationDate;

    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

 
  

//add advertisement api
const ad = multer();
app.post('/ad', ad.single('image'), function(req, res) {
  const { type, link } = req.body;
  const imageData = req.file.buffer;
  const store = req.cookies.store;

  // Convert the image data to a base64-encoded string
  const base64Image = imageData.toString('base64');
   
  // Save the data to the database
  const newAd = new Ad({
    type,
    link,
    image: base64Image,
    store
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



const uploadCamp = multer();
app.post('/newCamp', uploadCamp.single('image'), function(req, res, next) {
  const { type, name, date } = req.body;
  const store = req.cookies.store;

  if (!req.file || !req.file.buffer) {
    return res.status(400).send('Image data is missing or incomplete');
  }

  const imageData = req.file.buffer;

  // Convert the image data to base64-encoded strings
  const base64Image = imageData.toString('base64');

  // Save the data to the database
  const newCampaign = new Campaign({
    type,
    name,
    image: base64Image,
    date,
    store
  });

  newCampaign.save()
    .then(() => {
      console.log("done", newCampaign)
      res.send("<script>alert('Campaign was added successfully ✔'); window.location.href='/campaigns';</script>");
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});




// show campaigns 
app.use(async function(req, res, next) {
  try {
    const store = req.cookies.store;
    const campaigns = await Campaign.find({store: store});
    res.locals.campaigns = campaigns;
    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

  //routering of campains view 
  app.get('/campaigns', function(req,res){
    let store = res.locals.store ;
    const campaigns = res.locals.campaigns;
    res.render('campaigns',{store, campaigns});
  })

   // show rewards
  app.use(async function(req, res, next) {
    try {
      const store_id = req.cookies.store;
      const rewards = await Reward.find({store: store_id});
      res.locals.rewards = rewards;
      next();
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });
    //routering of rewards view 
  app.get('/rewards', function(req,res){
    let store = res.locals.store ;
    const rewards = res.locals.rewards;
    res.render('rewards',{store, rewards});
  })

  // show evaluations

  app.use(function(req, res, next) {
    const store_id = req.cookies.store;
    Rating.find({store: store_id})
      .then(rows => {
        console.log('Retrieved ratings successfully:');
        res.locals.rows = rows;
        next();
      })
      .catch(err => {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      });
  });

  

  // Send a response to the user
  app.post('/reply', async function(req,res) {
    try {
      const ratingId = req.body.id;
      const reply = req.body.reply;
  
      // Update the rating in the database with the reply
      const result = await Rating.findByIdAndUpdate(ratingId, { reply: reply });
  
      if (result) {
        // If the rating was updated successfully, redirect the user back to the homepage
        req.session.messages = { success: 'Reply submitted successfully.' };
        return res.redirect('/queseval');
      } else {
        // If the rating was not updated, display an error message
        req.session.messages = { error: 'Failed to submit reply.' };
        return res.redirect('/queseval');
      }
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
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

 // logout
app.post('/logout', (req, res) => {
  req.session.destroy(error => {
      if (error) {
          console.error('Failed to destroy session:', error);
      }
      res.redirect('/login');
  });
});

 // update signup credintials
  app.post('/update', async (req, res) => {
    try {
      // Extract user input from the request body
      const { business_name, email, phone_number } = req.body;
  
      // Get the current admin's ID from the session
      const adminId = req.session.adminId;
  
      // Find the admin in the database by their ID
      const admin = await Admin.findById(adminId);
  
      // Update the admin's data with the new values
      admin.business_name = business_name;
      admin.email = email;
      admin.phone_number = phone_number;
  
      await admin.save();
  
      // Send a success response to the client
      res.send("<script>alert('User updated successfully ✔'); window.location.href='/settings';</script>");
  
    } catch (error) {
      res.send("<script>alert('Can not updating user'); window.location.href='/settings';</script>");
      ;
  
      // Send an error response to the client
      res.status(500).json({
        success: false,
        message: 'Error updating user'
      });
    }
  });

 // change password
  app.post('/changePassword', async (req, res) => {
    const newPassword = req.body.newPassword;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    const adminId = req.session.adminId;
    const admin = await Admin.findById(adminId);
    admin.password = hashedPassword;
    await admin.save();
  
    res.send("<script>alert('Password updated successfully ✔'); window.location.href='/settings';</script>");
  });
  
  ///// send-sms
  app.post('/send-sms', async (req, res) => {
    const messageBody = req.body['message-body'];
    const messageLink = req.body['sms-link'];
  
    try {
      const users = await User.find({}, { phone: 1, _id: 0 });
      if (users.length === 0) {
        console.log('No users found!');
        res.send('No users found!');
      } else {
        const phoneNumbers = users.map(user => user.phone);
  
  
        // Send SMS messages here
        // You can use a third-party SMS service like Twilio to send SMS messages to the phone numbers
        // You will need to sign up for an account and obtain an API key and phone number to use this service
        const accountSid = 'AC1c83fa71b763cb14c6183845915dbcc1';
        const authToken = 'c0874076d2fa0eaee739c334ccde6d2e';
        const client = require('twilio')(accountSid, authToken);
        phoneNumbers.forEach(phoneNumber => {
          const formattedPhoneNumber = `+966${phoneNumber}`;
          client.messages
            .create({
              body: `${messageBody} ${messageLink}`,
              from: '+17122145878',
              to: formattedPhoneNumber
            })
            .then(message => console.log(`SMS message sent to ${formattedPhoneNumber}: ${message.sid}`))
            .catch(error => console.error(`Error sending SMS message to ${formattedPhoneNumber}: ${error.message}`));
        });
  
        res.send("<script>alert('SMS message sent!'); window.location.href='/notifUser';</script>");

      }
    } catch (err) {
      console.error('Error retrieving users from database:', err);
      res.send('Error retrieving users from database!');
    }
  
  });

 

//routering of show-notif view
app.get('/showNotif', (req, res) => {
  const notification = res.locals.notification || {} ;
  let store = res.locals.store;

  res.render('showNotif', { 
    store : store,
    newQuestions: notification.newQuestions || [], 
    redeemData: notification.redeemData || [], 
    ratingData: notification.ratingData || [], 
    userData: notification.userData || [] 
  });
});
//// Notifications
// Save notifications preferences
app.post('/update-notif-preferences', (req, res) => {
  const { evalNotif, quesNotif, redeemNotif, pointsNotif } = req.body;
  console.log(evalNotif,quesNotif,redeemNotif, pointsNotif)
  res.status(200).send('Notification preferences updated successfully!');
});

// Return the notifications
app.get('/notifications', async (req, res) => {
  try {
    const store_id = req.cookies.store;
    const notifications = await Notification.find({store: store_id}).sort({ created: -1 }).exec();
    res.json({ success: true, notifications: notifications });
  } catch (error) {
    console.error('Error retrieving notifications:', error);
    res.json({ success: false, message: 'Error retrieving notifications.' });
  }
});
//
app.put('/notifications/:id/read', async (req, res) => {
  const { id } = req.params;

  try {
    // Update the notification's read field in the database
    const result = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });

    if (!result) {
      // If no notification was found with the given ID, send a 404 error
      res.status(404).json({ error: 'Notification not found' });
      return;
    }

    // Send a success response
    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating notification read status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieves all questions
app.use(async function(req, res, next) {
  try {
    const store_id = req.cookies.store;
    const questions = await Question.find({store: store_id}, 'question userPhone');
    console.log('The questions is:',questions)
    res.locals.questions = questions;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});

//Answer the user questions
app.post('/answer', async function(req, res) {
  try {
    const questionId = req.body.questionId;
    const answer = req.body.answer;
    
    // Update the answer for the specified question in the database
    const result = await Question.updateOne({ _id: questionId }, { answer: answer });
    
    if (result.nModified === 1) {
      // If the answer was updated successfully, redirect the user back to the /queseval page
      res.send("<script>alert('Answer submitted successfully ✔'); window.location.href='/queseval';</script>");

    } else {
      // If the answer was not updated, display an error message
      res.send("<script>alert('Unable to submit answer'); window.location.href='/queseval';</script>");

    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});

app.get('/queseval', function(req, res) {
  let store = res.locals.store;
  const rows = res.locals.rows;
  const questions = res.locals.questions;
  const messages = req.session.messages || {};
  req.session.messages = {};
  res.render('queseval', { store, rows, messages, questions });
});




  
  
  
  

  
  
  

  
  









 




 app.listen(port,()=>{
    console.log(`Listening on ${port} `)
})
