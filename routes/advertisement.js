const express = require('express');
const router = express.Router();

router.get('/advertisement', function(req,res){
  const store = res.locals.store ;
  res.render('advertisement',{store: store});
})

module.exports = router;
