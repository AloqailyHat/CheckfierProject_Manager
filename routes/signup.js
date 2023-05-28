const express = require('express');
const router = express.Router();

router.get('/signup', function(req,res){
  const store = res.locals.store ;
  res.render('signup',{store: store});
})

module.exports = router;