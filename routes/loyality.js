const express = require('express');
const router = express.Router();

router.get('/loyality', function(req,res){
  const store = res.locals.store ;
  res.render('loyality',{store: store});
})



module.exports = router;