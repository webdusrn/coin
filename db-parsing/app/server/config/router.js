var express = require('express');
var app = express();

var router = express.Router();
app.use('/', router);

router.get('/', function(req, res) {
    res.render('../views/contents/index');
});