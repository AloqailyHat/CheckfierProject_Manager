const express = require('express');
const router = express.Router();

router.get('/allusers', function(req,res){
  const store = res.locals.store ;
  res.render('allusers',{store: store});
})

module.exports = router;
