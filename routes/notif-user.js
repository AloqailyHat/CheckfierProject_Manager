const express = require('express');
const router = express.Router();

router.get('/notifUser', function(req,res){
  const store = res.locals.store ;
  res.render('notifUser',{store: store});
})

module.exports = router;

