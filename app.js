var express = require("express");
var path = require("path")
var app = express();
var compress = require("compression")
var multer = require("multer");
var xlJson = require("./index.js")
var fs = require("fs");
const port = process.env.PORT || 3000;
app.set('port', port);
app.listen(port);
app.use(compress());
console.log("listening on port 3000");
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
})




/* benchmarking apis start: Only temporary*/
app.get("/display", function (req, res) {
    console.log("req received");
    fs.readFile("./" + req.query.param + ".json", "utf8", function (err, data) {
        res.send(data);
    });

})

app.get("/download", function (req, res) {
    console.log("req received");
    fs.readFile("./" + req.query.param + ".json", "utf8", function (err, data) {
        responseObj = { fileContent: data, fileName: req.query.param + ".json" }
        res.send(responseObj);
    });

})
/* benchmarking apis end: Only temporary*/


var storage = multer.diskStorage({
    destination: function (req, res, callback) {
        callback(null, "./uploads");
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
})
var upload = multer().single("myFile");
app.post("/upload", function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            var FileReader = require('filereader')
            var reader = new FileReader();
            var JSZip = require("jszip")

            var File = require("File");
            res.req.file.name = req.file.originalname;
            reader.readAsDataURL(new File(res.req.file));
            reader.on('data', function (data) {
                console.log("chunkSize:", data.length);
                var zip = new JSZip(data.buffer);
                new xlJson(zip).then(function (resolveParams) {
                    console.log(resolveParams);
                    res.send(resolveParams.sheetJson);
                });
            });
        }
    });
});