const express = require('express');
const router = express.Router();

router.get('/rewards', function(req,res){
  const store = res.locals.store ;
  res.render('rewards',{store: store});
})

module.exports = router;
