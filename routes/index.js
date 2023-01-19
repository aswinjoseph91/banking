var express = require('express');
var multer = require('multer');
var path = require('path');
var csv = require('csvtojson');
var fs = require('fs');
var moment=require('moment');
var stmt=require('../models/statement');
var router = express.Router();


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        var dir = './public/uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir,{ recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
var uploads = multer({storage: storage});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});
/* POST home page. */
router.post('/', uploads.single('csvfile'), function (req, res, next) {
    var datas=[],empResponse;    
    csv()
    .fromFile(req.file.path)
    .then((response) => {       
      for (var x = 0; x < response.length; x++) {
          var data={date:"",narration:"",withdrawal:"",deposit:"",closing_balance:""};
        empResponse = response[x].date;
        data.date = moment(empResponse, 'DD/MM/YYYY').format('YYYY-MM-DD');
        empResponse = response[x].narration;
        data.narration = empResponse;
        empResponse = (response[x].withdrawal!=="")?parseFloat(response[x].withdrawal):0;
        data.withdrawal = empResponse;
        empResponse = (response[x].deposit!=="")?parseFloat(response[x].deposit):0;
        data.deposit = empResponse;
        empResponse = (response[x].closing_balance)?parseFloat(response[x].closing_balance):0;
        data.closing_balance = empResponse;
        datas.push(data);         
      }   
      stmt.insertMany(datas, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/');
        }
      });
  });
    
});

/* GET home page. */
router.get('/statement', function (req, res, next) {
    stmt.find({}).then((data)=>{
      res.send(data);  
    });
        
});

module.exports = router;
