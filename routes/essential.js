const express = require('express');
const router = express.Router();

router.get('/essential', function(req,res){
  const store = res.locals.store;
  res.render('essential',{store: store});
})

module.exports = router;
