var express = require('express');
var router = express.Router();
var _ = require('lodash');
var MongoClient = require('mongodb').MongoClient;
var parseExcelDate = require('read-excel-file/node').parseExcelDate;
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
                    doc["Date Vendor Submissions Stop"] = parseExcelDate(parseInt(doc["Date Vendor Submissions Stop"]));
                    allJobs.push(doc);
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
