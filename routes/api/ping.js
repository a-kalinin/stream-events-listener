var express = require('express');
var router = express.Router();

/* GET test listing. */
router.get('/', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({status: 'ok'} );
});

module.exports = router;
