var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    path = require('path'),
    config = require('./config'),
    mime = require('mime'),
    async = require('async'),
    gen = require('./gen');

express.static.mime.define({
    'application/x-font-woff': ['woff'],
    'application/font-woff': ['woff']
});

var app = express(),
    data = {},
    dataFile = path.normalize('data/data.json'),
    srcDir = path.join('..', 'dist'),
    imgDir = path.join('..','/server/img');

app.use(bodyParser.json());

app.use('/app', express.static(path.join(__dirname, srcDir, 'app')));
app.use('/css', express.static(path.join(__dirname, srcDir, 'css')));
app.use('/img', express.static(path.join(__dirname, srcDir, 'img')));
app.use('/font', express.static(path.join(__dirname, srcDir, 'font')));
app.use('/vendor', express.static(path.join(__dirname, srcDir, 'vendor')));

app.get('/init', function(req, res, next) {
   
    res.send(data);
});

app.get('/gen/:accCount/:trnCount/:monthsBack', function(req, res, next) {
    var trnCount = parseInt(req.params.trnCount, 0),
        accCount = parseInt(req.params.accCount, 0),
        monthsBack = parseInt(req.params.monthsBack, 0);

    gen.generateData(accCount, trnCount, monthsBack, function(err, generatedData) {
        if (err)
            return res.send(err);
        console.log('generate data');
        data = generatedData;
        res.send(data);
    });
});
app.get('/pictures', function(req, res, next){
    var fs = require('fs');
    var path = require('path');
    var dirPath = '../server/img/'+req.query.category;  //directory path
    var files = [];
    console.log(dirPath);
    fs.readdir(dirPath, function(err,list){
        if(err) throw err;
        for(var i=0; i<list.length; i++) {
           // if(path.extname(list[i])===fileType) {
              //  console.log(list[i]); //print the file
                files.push(list[i]); //store the file name into the array files
          //  }
        }
        res.send(files);
    });
    //console.log(files);
   // res.send(files);
});
var picName = '';
var scan = function(dir, callback) {
  fs.readdir(dir, function(err, files) {
    var returnFiles = [];
    async.each(files, function(file, next) {
      var filePath = dir + '/' + file;
      fs.stat(filePath, function(err, stat) {
        if (err) {
          return next(err);
        }
        if (stat.isDirectory()) {
          scan(filePath, function(err, results) {
            if (err) {
              return next(err);
            }
            returnFiles = returnFiles.concat(results);
            next();
          })
        }
        else if (stat.isFile()) {
          //if (file.indexOf(suffix, file.length - suffix.length) !== -1) {
            returnFiles.push(filePath);
          //}
          next();
        }
      });
    }, function(err) {
      callback(err, returnFiles);
    });
  });
};
var getFileNames = function(section){
    var dirPath = '../server/img/'+section;  //directory path
    scan(dirPath, function(err, files) {
    
        return files;
    });
   
}

var prepareName = function(name) {
        var propName = '';
        if(name.indexOf('.jpg') != -1){
            propName = name.replace('.jpg','').replace('(baz.)','').replace('(baz)','');
        }
        if(name.indexOf('.png') != -1){
            propName = name.replace('.png','');
        }
        propName = propName.replace('(baz.)','').replace('.','').replace(/\([0-9]\)/,'').trim().toLowerCase();
        if(propName.indexOf(',') != -1){
            propName.replace('.','');
            propNames = propName.split(',');
            for(var i =0;i<propNames.length;i++){
                propNames[i];
            }
            return propNames;
        } else {
            return propName;
        }
    }
app.post('/rand-picture', function(req, res, next){
   // console.log(req.query.section);
    var section = req.query.section; 
    var dirPath = '../server/img/'+section;  //directory path
    scan(dirPath, function(err, files) {
        randIndex = Math.floor((Math.random() * files.length) + 0);
        randPicture = files[randIndex];
        var splitedFileName = randPicture.split('/');
        console.log(splitedFileName[splitedFileName.length-1] + 'kokokok');
        //var file = randPicture;
        var img = fs.readFileSync(randPicture);
        var data = {file: img.toString('base64'), fileName: prepareName(splitedFileName[splitedFileName.length-1])};
        res.json(data);
        //res.writeHead(200, {'Content-Type': 'application/json'});
        //res.writeHead(200, {'Content-Type': 'image/gif'});
       // res.end(img.toString('base64'), 'binary');
       //res.end(data)
       //res.end(img, 'binary');
    });
    
   /* getFileNames(section,function(err, files){
       var files2 = files
       console.log('asas' +files2);
    });*/
   // console.log(files2);
    
});

app.get('/update', function(req, res, next) {
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
    var moreTransactions = [];

    for (var i = 0; i < data.transactions.length; ++i) {
        if ((fromDate < data.transactions[i].date) && (toDate > data.transactions[i].date)) {
            moreTransactions.push(data.transactions[i]);
        }
    }

    data.moreTransactions = moreTransactions;
    data.transactionsFromTime = fromDate;
    res.send(data);
});

app.get('/*', function(req, res, next) {
    res.sendfile(path.join(__dirname, srcDir, 'index.html'));
});


var runServer = function(err, generatedData) {
    if (err)
        throw err;

    data = generatedData;
    app.listen(config.listenPort || process.env.PORT);
    console.log('Listening on port: ' + config.listenPort);
}

if (!fs.existsSync(dataFile)) {
    gen.generateData(3, 100, 3, runServer);
} else {
    fs.readFile(dataFile, function(err, dataBuffer) {
        runServer(null, JSON.parse(dataBuffer));
    });
}
