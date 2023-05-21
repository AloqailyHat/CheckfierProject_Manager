const express = require('express');
const router = express.Router();

router.get('/settings', function(req,res){
  const store = res.locals.store ;
  res.render('settings',{store: store});
})


module.exports = router;
