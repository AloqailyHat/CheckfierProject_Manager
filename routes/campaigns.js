const express = require('express');
const router = express.Router();

router.get('/campaigns', function(req,res){
  const store = res.locals.store ;
  const campaigns = res.locals.campaigns;
  res.render('campaigns',{store, campaigns});
})

module.exports = router;
