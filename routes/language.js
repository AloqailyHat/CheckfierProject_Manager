const express = require('express');
const router = express.Router();

router.get('/language', function(req,res){
  const store = res.locals.store ;
  res.render('language',{store: store});
})

module.exports = router;
