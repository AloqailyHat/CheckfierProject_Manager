const express = require('express');
const router = express.Router();

router.get('/storeset', function(req,res){
  const store = res.locals.store ;
  res.render('storeset',{store: store});
});

module.exports = router;