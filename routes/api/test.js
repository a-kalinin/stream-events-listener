var express = require('express');
var router = express.Router();

/* GET test listing. */
router.get('/:id', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.format({
    //     'text/plain': function(){
    //         res.send('hey');
    //     },
    //
    //     'text/html': function(){
    //         res.send('<p>hey</p>');
    //     },
    //
    //     'application/json': function(){
    //         res.send({ message: 'hey' });
    //     },
    //
    //     'default': function() {
    //         // log the request and respond with 406
    //         res.status(406).send('Not Acceptable');
    //     }
    // });

    res.json({ status: 'ok', id: req.params.id } );
});
router.get('/', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ status: 'error', error: 'ID parameter missed' } );
});

module.exports = router;
