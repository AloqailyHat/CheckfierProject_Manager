const express = require('express');
const router = express.Router();

router.get('/', function(req,res){
  const store = res.locals.store ;
  res.render('signup',{store: store});
})
module.exports = router;
