const express = require('express');
const router = express.Router();

router.get('/login', function(req,res){
  const store = res.locals.store ;
  res.render('login',{store: store});
})

module.exports = router;