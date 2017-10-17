var express = require("express");
var path = require("path")
var app = express();
var multer = require("multer");
var xlJson = require("./index.js")
const port = process.env.PORT || 3000;
app.set('port', port);
console.log("listening on port 3000");
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
})

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
            var JSZip = require("JSZip")

            var File = require("file");
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