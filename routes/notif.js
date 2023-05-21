const express = require('express');
const router = express.Router();

router.get('/notif', function(req,res){
  const store = res.locals.store ;
  res.render('notif',{store: store});
})


router.get('/notifUser', function(req,res){
  const store = res.locals.store ;
  res.render('notifUser',{store: store});
})

router.get('/notifAdmin', function(req,res){
  const store = res.locals.store ;
  res.render('notifAdmin',{store: store});
})


module.exports = router;
