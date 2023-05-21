const express = require('express');
const router = express.Router();

router.get('/points', function(req,res){
  const store = res.locals.store ;
  res.render('points',{store: store});
})

module.exports = router;
