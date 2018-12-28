var express = require('express');
var router = express.Router();
var _ = require('lodash');
var MongoClient = require('mongodb').MongoClient;

var mongoUrl = "mongodb://127.0.0.1:27017/testjobs";


router.get('/', function (req, res, next) {

    try {
        MongoClient.connect(mongoUrl, (err, client) => {
            var db = client.db("testjobs");
            console.log("connected to the db");

            let allJobs = [];
            let cursor = db.collection('jobs').find();
            cursor.forEach((doc) => {
                if(doc !==  null){
                    allJobs.push(doc);
                    console.log(doc._id);
                }
            }, (err)=> {
                console.log('--RETURNING--');
                res.send(allJobs);
                client.close();
            })

        })
    } catch (e) {
        console.log(e);
    }


});

module.exports = router;
