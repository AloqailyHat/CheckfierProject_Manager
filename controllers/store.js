const fs = require('fs');
const multer = require('multer');
const Store = require('../models/store');

const upload = multer();

exports.upload = (req, res) => {
  const store = new Store({
    name: req.body.storeName,
    logo: '',
    color: req.body.storeColor,
  });

  fs.readFile(req.file.path, (err, data) => {
    if (err) {
      console.error('Error reading logo image:', err);
      res.status(500).send('Error reading logo image');
    } else {
      const base64Data = Buffer.from(data).toString('base64');
      store.logo = base64Data;
      store
        .save()
        .then(() => {
          res.redirect('/essential');
        })
        .catch((error) => {
          console.error('Error saving store data', error);
          res.redirect('/error');
        });
    }
  });
};

exports.getStore = (req, res) => {
  if (!res.locals.store) {
    return res.redirect('/essential');
  }
  res.render('store');
};
