var express = require('express');
var router = express.Router();
var _ = require('lodash');
var path = require('path');
var appDir = path.dirname(require.main.filename);
var readXlsxFile = require('read-excel-file/node');
var MongoClient = require('mongodb').MongoClient;

var mongoUrl = "mongodb://127.0.0.1:27017/quadrant";

/* POST file */
router.post('/', function (req, res, next) {
  if (_.isEmpty(req.files)) {
    return res.status(400).send("No files were found");
  }

  let uploadFile = req.files.file;
  const fileName = req.files.file.name;
  const fileLoc = `${appDir}/public/files/${fileName}`;
  //console.log(appDir);
  uploadFile.mv(
    fileLoc,
    function (err) {
      if (err) {
        return res.status(500).send(err);
      }

      try {
        console.log("---- read file ------", fileLoc);
        this.readFile( fileLoc );
      } catch (e) { console.log(e) }

      res.json({
        file: `public/${req.files.file.name}`,
      })
    },
  )
});

saveJobs = (jobs) => {
  MongoClient.connect(mongoUrl, (err, client)=> {
    var db = client.db("quadrant");
    console.log("connected to the db");
    
    db.collection('jobs').insertMany(jobs, (err, result)=> {
      if(err) throw err;
      console.log("Number of  documents inserted: " + result.insertedCount);
      client.close();
    });    
  })
}

readFile = async (fileLoc) => {
  try {
    console.log("----reading...");
    const result = await readXlsxFile(fileLoc);
    console.log("---- read complete -----");
    let headers = result.splice(0,1)[0];

    let jobs = _.map(result, (doc)=>{
      let job = {};
      _.each(headers, (i, idx)=>{
        job[i] = doc[idx];
      });
      //console.log("--JOB--", job);
      return job;
    })

    //console.log("--jobs--", jobs);

    /* const jobs = _.map( result, i => {
      return {
        "name" : i[0],
        "loc" : i[1],
        "val" : i[2]
      }
    }) */
    saveJobs(jobs);

    //console.log(jobs);
    /*.then((rows) => {
      console.log(rows);
      // `rows` is an array of rows
      // each row being an array of cells.
      //res.send("successful");
    })*/
  } catch (e) { console.log(e) }

}

/* router.get('/read', (req, res) => {
  try {
    console.log("--------about to read-----------");
    readXlsxFile(`${appDir}/public/files/test.xlsx`).then((rows) => {
      console.log(rows);
      // `rows` is an array of rows
      // each row being an array of cells.
      res.send("successful");
    })
  } catch (e) { console.log(e) }


})
 */
module.exports = router;
