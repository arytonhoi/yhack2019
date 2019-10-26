var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

var PORT = 10000;

var saveFilename = "somejsonthing.txt";
var writeStream = fs.createWriteStream(saveFilename);

app.post("/saveData", (req, res) => {
    console.log(req.body);    
    writeStream.write(JSON.stringify(req.body) + ",\n");    
    res.send("ok");
});


writeStream.once('open', () => {
    app.listen(PORT);
});



