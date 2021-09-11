// Load Node modules
var express = require('express');
const ejs = require('ejs');

const axios = require('axios');
// Initialise Express
var app = express();
// Render static files
app.use(express.static('public'));
// Set the view engine to ejs
app.set('view engine', 'ejs');
// Port website will run on
module.exports = app.listen(8888);
const path = require('path');

//Importing jimp module
var Jimp = require("jimp");
// Importing filesystem module
var fs = require('fs')
// Importing qrcode-reader module
var qrCode = require('qrcode-reader');
var bodyParser = require('body-parser')
// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

const multer = require('multer');

const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'images', 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
      fileSize: 1000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg)$/)) { 
         // upload only png and jpg format
         return cb(new Error('Please upload a Image'))
       }
     cb(undefined, true)
  }
}) 



// *** GET Routes - display pages ***
// Root Route
app.get('/', function (req, res) {
    res.render('index');

});
app.get('/aboutproject', function (req, res) {
    res.render('about');
});
app.get('/login', function (req, res) {
    res.render('login', {error:'no'});
});
app.get('/register', function (req, res) {
  res.render('register');
});

app.post('/login', function (req, res) {
    console.log(req.body.password);

    axios.post('http://localhost:4000/users/login', {
        //...data
        
        'token': req.body.password.toString()
      })
      .then((resp) => {
        console.log(resp.data.success)
        if(resp.data.success.toString() == 'false')
            res.render('login', {error:'yes'});
        else
            res.redirect('insert');
      })
      .catch((error) => {
        console.error(error)
      })

      
    //   res.redirect('login?error');
    
});
app.post('/register', function (req, res) {
  console.log(req.body.regUser)
 

  axios.post('http://localhost:4000/users', {
      //...data
      'username':req.body.regUser.toString()
      
    },{
        headers:{

          'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjUxNzgzNjMsInVzZXJuYW1lIjoiZ292ZXJubWVudDEiLCJvcmdOYW1lIjoiT3JnMiIsImlhdCI6MTYyMTU3ODM2M30.-GUucBzvFtvDUsyG5bQvxI8wYoKoFuCBYnUrC1-fx-U'
        }
    })
    .then((resp) => {
      console.log(resp.data.token)
      res.render('successRegister',{gToken:resp.data.token.toString()});
    })
    .catch((error) => {
      console.error(error)
    })
  

});
app.get('/insert', function (req, res) {

 var serverResponse;
    
    // axios.get('http://localhost:4000/read/medicine?args=["9a6350cc9d34f72c86f6a4e4bdbd88a19be5857a"]')
    //         .then(function (response) {
    //             console.log(response);
                
    //         });
    res.render('insert');
});

app.get('/updateowner', function (req, res) {
    res.render('updateowner');
});

app.get('/updatestate', function (req, res) {
    res.render('updatestate');
});

app.post('/insert', function (req, res) {
    console.log(req.body)
    var a = [req.body.medicineName.toString(),req.body.mfgLicno.toString(),req.body.expDate.toString(),req.body.serialNo.toString(),req.body.batchNo.toString(),req.body.currentOwner.toString(),(new Date()).toLocaleDateString() + '-' +req.body.currentState.toString(),req.body.gstNo.toString()]
    console.log(req.body.medicineName.toString(),req.body.mfgLicno.toString(),req.body.expDate.toString(),req.body.serialNo.toString(),req.body.batchNo.toString(),req.body.currentOwner.toString(),(new Date()).toLocaleDateString() + '-' +req.body.currentState.toString(),req.body.gstNo.toString())
    console.log(a)


    axios.post('http://localhost:4000/insert/medicine', {
        //...data
        
        'args': ['1',req.body.medicineName.toString(), req.body.mfgLicno.toString(), req.body.expDate.toString(), req.body.serialNo.toString(),req.body.batchNo.toString() ,req.body.currentOwner.toString(), (new Date()).toLocaleDateString() + '-' +req.body.currentState.toString(), req.body.gstNo.toString()]
      },{
          headers:{

            'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjYyMTcwMDAsInVzZXJuYW1lIjoiTWFudWZhY3R1cmVOZXciLCJvcmdOYW1lIjoiT3JnMSIsImlhdCI6MTYyMjYxNzAwMH0.T7JrF4egg1oFQiQv2wXAp5GttInXZrvwRmmZOXmhhhY'
          }
      })
      .then((resp) => {
        console.log(resp.data.result.message.toString().split(":")[1])
        res.render('success',{hash:resp.data.result.message.toString().split(":")[1]});
      })
      .catch((error) => {
        console.error(error)
      })
    

});

app.post('/updateowner',imageUpload.single('qr'), function (req, res) {
    var serverResponse;
    // var getHash = req.params.hash;
    console.log(req.file)

    var hash;

    // res.render('timeline', { getHash : getHash });
    var buffer = fs.readFileSync(__dirname + '/images/'+req.file.filename);
 
    // Parse the image using Jimp.read() method
    Jimp.read(buffer, function(err, image) {
        if (err) {
            console.error(err);
        }
        // Creating an instance of qrcode-reader module
        let qrcode = new qrCode();
        qrcode.callback = function(err, value) {
            if (err) {
                console.error(err);
            }
            // Printing the decrypted value
            
            console.log(value.result);
            hash = value.result;

            axios.post('http://localhost:4000/update/current/owner', {
        //...data
        
        'args': [hash,req.body.owner.toString()]
      },{
          headers:{

            'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjYyMTcwMDAsInVzZXJuYW1lIjoiTWFudWZhY3R1cmVOZXciLCJvcmdOYW1lIjoiT3JnMSIsImlhdCI6MTYyMjYxNzAwMH0.T7JrF4egg1oFQiQv2wXAp5GttInXZrvwRmmZOXmhhhY'
          }
      })
      .then((resp) => {
        
        
      })
      .catch((error) => {
        console.error(error)
      })
    res.render('successowner');
        };
    
        // Decoding the QR code
    qrcode.decode(image.bitmap);

});
try {
    fs.unlinkSync(__dirname + '/images/'+req.file.filename)
    //file removed
  } catch(err) {
    console.error(err)
  }
    
        
    
});

app.post('/updatestate',imageUpload.single('qr'), function (req, res) {
    var serverResponse;
    // var getHash = req.params.hash;
    console.log(req.file)

    var hash ;

    // res.render('timeline', { getHash : getHash });
    var buffer = fs.readFileSync(__dirname + '/images/'+req.file.filename);
 
    // Parse the image using Jimp.read() method
    Jimp.read(buffer, function(err, image) {
        if (err) {
            console.error(err);
        }
        // Creating an instance of qrcode-reader module
        let qrcode = new qrCode();
        qrcode.callback = function(err, value) {
            if (err) {
                console.error(err);
            }
            // Printing the decrypted value
            
            // console.log(value.result);
            hash = value.result;
            axios.post('http://localhost:4000/update/current/state', {
        //...data
        
         'args': [hash.toString(),(new Date()).toLocaleDateString() + '-' +req.body.state.toString()]
        // 'args': ['c87b60eabaf0b3701449039c125a52e2876c1468',(new Date()).toLocaleDateString() + '-' +req.body.state.toString()]
      },{
          headers:{

            'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjYyMTcwMDAsInVzZXJuYW1lIjoiTWFudWZhY3R1cmVOZXciLCJvcmdOYW1lIjoiT3JnMSIsImlhdCI6MTYyMjYxNzAwMH0.T7JrF4egg1oFQiQv2wXAp5GttInXZrvwRmmZOXmhhhY'
          }
      })
      .then((resp) => {
        
        console.log(resp.data)
        console.log(hash.toString(),req.body.state)
        
      })
      .catch((error) => {
        console.error(error)
      })
    res.render('successstate');
            
        };
    
        // Decoding the QR code
    qrcode.decode(image.bitmap);

});
try {
    fs.unlinkSync(__dirname + '/images/'+req.file.filename)
    //file removed
  } catch(err) {
    console.error(err)
  }
    
        
});

app.get('/logout', function (req, res) {
    res.redirect('/');
});

app.get('/p/:tagId', function(req, res) {
    res.send("tagId is set to " + req.params.tagId);
  });
/* read method */

/// Get Medicine



app.post('/medicine', imageUpload.single('qrcode'),function(req,res){
    var serverResponse;
    // var getHash = req.params.hash;
    console.log(req.file)
    // res.render('timeline', { getHash : getHash });
    var buffer = fs.readFileSync(__dirname + '/images/'+req.file.filename);
 
    // Parse the image using Jimp.read() method
    Jimp.read(buffer, function(err, image) {
        if (err) {
            console.error(err);
        }
        // Creating an instance of qrcode-reader module
        let qrcode = new qrCode();
        qrcode.callback = function(err, value) {
            if (err) {
                console.error(err);
            }
            // Printing the decrypted value
            // console.log(value.result);
            axios.get('http://localhost:4000/read/history/medicine?args=["'+ value.result.toString()+'"]')
            .then(function (response) {
                console.log(response.data.result[0].Value);

                
                var medicineName = JSON.stringify(response.data.result[0].Value.MedicineName)
                
                var medicineManufacturer = JSON.stringify(response.data.result[0].Value.MedicineManufacturer)

                // "ExpirationDate": response.data.result[0].Value
                // "SerialNo": response.data.result[0].Value
                // "BatchNo": response.data.result[0].Value
                // "CurrentOwner": response.data.result[0].Value
                // "CurrentState": response.data.result[0].Value
                var gstNo = JSON.stringify(response.data.result[0].Value.GSTNo)
                var serialNo = JSON.stringify(response.data.result[0].Value.SerialNo)

                var history = response.data.result

                res.render('timeline',{MedicineName:medicineName,MedicineManufacturer:medicineManufacturer,GSTNo:gstNo,SerialNo:serialNo,history:history});
                
            })
            .catch((error) => {
              console.error(error)
            });

            


        };
    
        // Decoding the QR code
    qrcode.decode(image.bitmap);
});

try {
    fs.unlinkSync(__dirname + '/images/'+req.file.filename)
    //file removed
  } catch(err) {
    console.error(err)
  }
    
    
            
});
