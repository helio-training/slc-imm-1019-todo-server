var express = require('express');
var router = express.Router();
// var taskDal = require('../dal/taskDal');

router.get('/', function (req, res, next) {
    // taskDal.testConnection()
    res.send('success');
});



module.exports = router;