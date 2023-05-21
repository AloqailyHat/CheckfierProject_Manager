const express = require('express');
const router = express.Router();

router.get('/notifAdmin', function(req,res){
  const store = res.locals.store ;
  res.render('notifAdmin',{store: store});
})

module.exports = router;
