var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  res.render('index',{title:'Dynamic Page', books});

});

const dataToSend = {
  title: 'Express',
  isSpecial: false
}


const books = [
  {title: '1984', author: 'George Orwell'}, 
  {title: 'Physicall Prototyping Physics for Play',author:'Dr. Horn'},
  {title:'Cooperative Softare Development', author:'Amy Ko'}
]

module.exports = router;
