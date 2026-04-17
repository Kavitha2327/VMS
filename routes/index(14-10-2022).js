var express = require('express');
var router = express.Router();
var monk = require('monk');
var moment = require('moment');
var path = require('path');
var multer=require('multer');
var db = monk('localhost:27017/vms');
var dbs = monk('localhost:27017/bus');
var bus=dbs.get('bus');
var data=dbs.get('data');
var test = dbs.get('test');
var routedata=dbs.get('route');
var login = db.get('login');
var society = db.get('society');
var branch = db.get('branch');
var Designation = db.get('Designation');
var vehiclemake = db.get('vehiclemake');
var officestaff = db.get('officestaff');
var busstaff = db.get('busstaff');
var staffmeeting = db.get('staffmeeting');
var busoptstaff = db.get('busoptstaff');
var vehicleinfo = db.get('vehicleinfo'); 
var branchvehicle = db.get('branchvehicle'); 
var transfer = db.get('transfer');
var stages = db.get('stages');
var route = db.get('route');
var fuel = db.get('fuel');
var fuelbunk = db.get('fuelbunk');
var fuelfill = db.get('fuelfill');
var busfill = db.get('busfill');
var vehicletrip = db.get('vehicletrip');
var vehicletripdata = db.get('vehicletripdata')
var routedetails = db.get('routedetails');
var busremarks = db.get('busremarks');
var vehicleaccident = db.get('vehicleaccident');
var vehicleservice = db.get('vehicleservice');
var rta = db.get('rta');
var pollution = db.get('pollution');
var fitness = db.get('fitness');
var roadtax = db.get('roadtax');
var roadpermit = db.get('roadpermit');
var insurance = db.get('insurance');
var insuranceclaim = db.get('insuranceclaim');
var vehiclechallan = db.get('vehiclechallan');
var vehicletyres = db.get('vehicletyres');
var replacedvehicle = db.get('replacedvehicle');
var categories = db.get('categories');
var subcategories = db.get('subcategories');
var subitems = db.get('subitems');
var dailyvehicle = db.get('dailyvehicle');
var vehiclerepair = db.get('vehiclerepair');
var vcr = db.get('vcr');
var bunkservicing = db.get('bunkservicing');
var vehiclewisebattery = db.get('vehiclewisebattery')
var batterychangereport = db.get('batterychangereport')
var busbreakdown = db.get('busbreakedown')
var contenttesting = db.get('contenttesting')
var tyrestatus = db.get('tyrestatus');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");

//Power BI sql connections
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '172.7.67.45',
  user     : 'root',
  password : 'Adminroot@1112',
  database : 'vms'
});


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});
//login page
router.get('/login',function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    res.redirect('/home');
  }
  else{
    req.session.reset();
    res.render('login');
  }
});
//post login details
router.post('/login',function(req,res){
  login.findOne({"username":req.body.username,"password":req.body.password},function(err,user){
    if(!user){
      res.render('login', { error: 'Invalid username or password.' });
    }
    else if((user.username == "fuel") && (user.password=="Aditya@123")){
      delete user.password;
      req.session.user = user;
      res.redirect('/fuelpage');
    }
    else{
        delete user.password;
        req.session.user = user;
          res.redirect('/home');
      }
  });
});
//logout
router.get('/logout', function(req, res){
  req.session.reset();
  res.redirect('/login');
});
//Home page for fuels
router.get('/fuelpage',function(req,res){
  if(req.session && req.session.user){
    res.render('copy')
  }
})

//home
router.get('/home', function(req, res) {
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    var date= moment().format('DD-MM-YYYY')
    //console.log(date);
    var time= moment().format('HH:mm:ss')
    //console.log(time);
    data.find({"Date":date, "Status":"IN"},function(err,docs10){
    data.find({"Date":date, "Status":"OUT"},function(err,docs1){
    routedata.find({}, function(err,data1){
    bus.find({"Status":"IN","IN":1}, function(err,docs8){
    bus.find({"Status":"OUT","OUT":1},function(err,docs9){
    //dashboard
      society.find({}, function(err,docs11){
      branch.find({}, function(err,docs12){
      transfer.find({}, function(err,docs){
      stages.find({}, function(err,docs13){
      route.find({}, function(err,docs14){
      routedetails.find({}, function(err,docs15){
      busstaff.find({}, function(err,docs16){
      busstaff.find({"remainderdate":date}, function(err,docs21){
      officestaff.find({}, function(err,docs17){
      branchvehicle.find({}, function(err,docs18){
      vehicleaccident.find({}, function(err,docs19){
      if(req.session.user.branch=="VMS" || req.session.user.branch=="Aditya Academy"){
        busfill.find({}, function(err,docs20){        
        res.locals.busf = docs20.length;
        });
        vehiclewisebattery.aggregate([{"$group":{"_id":{"Status":"$status"},Count:{$sum:1}}},{$sort: {"_id.Status": 1}}], function(err,docs49){
          res.locals.battery = docs49;
        });
        tyrestatus.aggregate([{"$group":{"_id":{"Status":"$status"},Count:{$sum:1}}},{$sort: {"_id.Status": 1}}], function(err,docs50){
          res.locals.tyres = docs50;
        });
      }
      else{
        busfill.find({"branch":{$regex:req.session.user.name}}, function(err,docs20){
        if(docs20 != undefined){
          res.locals.busf = docs20.length;
        }else{
          res.locals.busf = 0;
        }
          
        });
        vehiclewisebattery.aggregate([{$match:{"branch":{$regex:req.session.user.name}}},{"$group":{"_id":{"Status":"$status"},Count:{$sum:1}}},{$sort: {"_id.Status": 1}}], function(err,docs49){
          res.locals.battery = docs49;
        });
        tyrestatus.aggregate([{$match:{"branch":{$regex:req.session.user.name}}},{"$group":{"_id":{"Status":"$status"},Count:{$sum:1}}},{$sort: {"_id.Status": 1}}], function(err,docs50){
          res.locals.tyres = docs50;
        });
      }
      vehicleservice.find({}, function(err,docs27){

      //vehicletrip.find({"remarks":/exceed/},function(err,docs32){

      res.locals.tot = data1.length;
      res.locals.inbus=docs10;
      //console.log(docs10)
      res.locals.outbus=docs1;
      res.locals.indata=docs8.length;
      res.locals.outdata=docs9.length;
      //dashboard
      res.locals.society = docs11.length;
      res.locals.branch = docs12.length;
      res.locals.transfer = docs.length;
      res.locals.stages = docs13.length;
      res.locals.route = docs14.length;
      res.locals.routedetails = docs15.length;
      res.locals.busstaff = docs16.length;
      res.locals.officestaff = docs17.length;
      res.locals.branchvehicle = docs18.length;
      res.locals.vehicleaccident = docs19.length;
      res.locals.vehicleservice = docs27.length;
      res.locals.vehicleservicedata = docs27;
      //res.locals.exceed = docs32;
      res.locals.liciense = docs21;
      //res.locals.exceeddata = docs32.length;
      res.render('home');
    });
    });
    });
    //});
    });
    });
    });
    });
    });
    });
    });
    });
    });
    });
    });
    });
    });
    });
  }
});

//----------------------------------------Society Data-----------------------------------------------------
// adding society
router.post('/SocietyData', function(req,res){
  //console.log(req.body)
  var name = req.body.name;
  //console.log(name);
  society.insert(req.body, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

//editing sociecty
router.post('/EditSociety', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  society.update({"_id":id},{$set:{"name":req.body.name}}, function(err,docs){
    res.send(docs)
  })
});

// removeing
router.post('/RemoveSociety', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  society.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})
// getting society data
router.get('/getSocietydata', function(req,res){
  society.find({}, function(err,docs){
    res.send(docs)
  })
})


//----------------------------------------------Branch Data---------------------------------------------------
// adding Branch
router.post('/BranchData', function(req,res){
  //console.log(req.body)
  var name = req.body.name;
  //console.log(name);

  


  branch.insert(req.body, function(err,docs){
    console.log(docs);
    connection.query('INSERT INTO `branch` SET `_id`="'+docs._id+'", `name`="'+req.body.name+'", `test`="'+req.body.test+'"', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });
    res.send(docs);
  });
});

// router.get('/getBranchdata', function(req,res){
//   branch.find({}, function(err,docs){
//     res.send(docs)
//   })
// })

router.get('/getBranchdata', function(req,res){
  // branch.find({}, function(err,docs){
  //   res.send(docs)
  // })
  if(req.session && req.session.user){
    res.locals.user = req.session.user
    // console.log(req.session.user)
    if(req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc' || req.session.user.username=='fuel') {
      branch.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      branch.find({"name":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      branch.find({"name":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      branch.find({"name":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      branch.find({"name":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      branch.find({"name":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      branch.find({"name":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      branch.find({"name":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      branch.find({"name":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      branch.find({"name":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      branch.find({"name":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      branch.find({"name":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      branch.find({"name":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      branch.find({"name":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      branch.find({"name":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      branch.find({"name":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      branch.find({"name":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      branch.find({"name":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      branch.find({"name":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      branch.find({"name":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      
      branch.find({"name":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
        console.log(docs);
        res.send(docs)
      });
    }
}
})


//editing brach
router.post('/EditBranch', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  branch.update({"_id":id},{$set:{"name":req.body.name,"test":req.body.test}}, function(err,docs){
    connection.query('UPDATE `branch` SET `name`="'+req.body.name+'", `test`="'+req.body.test+'" WHERE `_id`="'+id+'"', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });
    res.send(docs)

  })
});

// removeing branch
router.post('/RemoveBranch', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  branch.remove({"_id":id}, function(err,docs){
    connection.query('DELETE FROM `branch` WHERE `_id`="'+id+'"', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });
    res.send(docs);
  });


})


//----------------------------------------------Stage Data---------------------------------------------------
// adding Stage
router.post('/StageData', function(req,res){
  stages.insert(req.body, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

router.get('/getStagedata', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user
    console.log(req.session.user)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      stages.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      stages.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      stages.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      stages.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      stages.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      stages.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      stages.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      stages.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      stages.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      stages.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      stages.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      stages.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      stages.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      stages.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      stages.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      stages.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      stages.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      stages.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      stages.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      stages.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      stages.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

//editing Stage
router.post('/EditStage', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  stages.update({"_id":id},{$set:req.body}, function(err,docs){
    res.send(docs)
  })
});

// removeing Stage
router.post('/RemoveStage', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  stages.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})

router.post('/getVehiclestage', function(req,res){
  console.log(req.body)
  stages.find({"regno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})
//----------------------------------------------Route Data---------------------------------------------------
// adding Route
router.post('/RouteData', function(req,res){
  route.insert(req.body, function(err,docs){
    //console.log(docs);
     connection.query('INSERT INTO `route` SET `_id`="'+docs._id+'", `society`="'+req.body.society+'", `branch`="'+req.body.branch+'",  `routename`="'+req.body.routename+'", `distance`="'+req.body.distance+'", `routeregno`="'+req.body.routeregno+'"', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });
    res.send(docs);
  });
});

router.get('/getRoutedata', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      route.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      route.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      route.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      route.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      route.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      route.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      route.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      route.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      route.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      route.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      route.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      route.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      route.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      route.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      route.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      route.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      route.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      route.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      route.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      route.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      route.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

//editing Route
router.post('/EditRoute', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  route.update({"_id":id},{$set:{"routename":req.body.routename,"society":req.body.society,"branch":req.body.branch,"routeregno":req.body.routeregno,"distance":req.body.distance}}, function(err,docs){
    connection.query('UPDATE  `route` SET `society`="'+req.body.society+'", `branch`="'+req.body.branch+'",  `routename`="'+req.body.routename+'", `distance`="'+req.body.distance+'", `routeregno`="'+req.body.routeregno+'" WHERE `_id`="'+id+'"', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });
    res.send(docs)
  })
});

// removeing Route
router.post('/RemoveRoute', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  route.remove({"_id":id}, function(err,docs){
    connection.query('DELETE FROM `route` WHERE `_id`="'+id+'"', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });
    res.send(docs)
  })
})

router.post('/getVehicleroute', function(req,res){
  console.log(req.body)
  route.find({"routeregno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})
//----------------------------------------------Routedetails Data---------------------------------------------------
// adding Routedetails
router.post('/RoutedetailsData', function(req,res){
  var data = {
    society:req.body.society,
    branch:req.body.branch,
    routename:req.body.routename,
    startpoint:req.body.startpoint,
    distance:req.body.distance,
    regno:req.body.regno,
    starttime:moment(req.body.starttime).format("hh:mm:ss a")
  }
  routedetails.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

router.get('/getRoutedetailsdata', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      routedetails.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      routedetails.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      routedetails.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      routedetails.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      routedetails.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      routedetails.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      routedetails.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      routedetails.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      routedetails.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      routedetails.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      routedetails.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      routedetails.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      routedetails.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      routedetails.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      routedetails.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      routedetails.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      routedetails.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      routedetails.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      routedetails.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      routedetails.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      routedetails.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

//editing Routedetails
router.post('/EditRoutedetails', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  routedetails.update({"_id":id},{$set:{"starttime":moment(req.body.starttime).format("hh:mm:ss a"),"startpoint":req.body.startpoint,"routename":req.body.routename,"society":req.body.society,"branch":req.body.branch,"regno":req.body.regno,"distance":req.body.distance}}, function(err,docs){
    res.send(docs)
  })
});

// removeing Routedetails
router.post('/RemoveRoutedetails', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  routedetails.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})

router.post('/getVehicleroutedetails', function(req,res){
  console.log(req.body)
  routedetails.find({"regno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})

//----------------------------------------------Transfer Data---------------------------------------------------
// adding Transfer
router.post('/TransferData', function(req,res){
  //console.log(req.body)
  var data1 = {
    society:req.body.society,
    branch:req.body.branch,
    cmr:req.body.cmr,
    make:req.body.make,
    model:req.body.model,
    regno:req.body.regno,
    service:req.body.service,
    transferbranch:req.body.transferbranch,
    transferdate:moment(req.body.transferdate).format('DD-MM-YYYY')
  }
  //console.log(name);
  transfer.insert(data1, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

router.get('/getTransferdata', function(req,res){
  transfer.find({}, function(err,docs){
    res.send(docs)
  })
})

//editing Transfer
router.post('/EditTransfer', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  transfer.update({"_id":id},{$set:{"society":req.body.society,"branch":req.body.branch,"cmr":req.body.cmr,"make":req.body.make,"model":req.body.model,"regno":req.body.regno,"service":req.body.service,"transferbranch":req.body.transferbranch,"transferdate":req.body.transferdate}}, function(err,docs){
    res.send(docs)
  })
});

// removeing Transfer
router.post('/RemoveTransfer', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  transfer.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})

router.post('/getvehicletransfer', function(req,res){
  console.log(req.body)
  transfer.find({"regno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})
//---------------------------------------------------Designation Data-------------------------------------------
// adding Designation
router.post('/DesignationData', function(req,res){
  //console.log(req.body)
  var name = req.body.name;
  //console.log(name);
  Designation.insert(req.body, function(err,docs){
    //console.log(docs);
    connection.query('INSERT INTO `Designation` SET `_id`="'+docs._id+'", `name`="'+req.body.name+'"', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });
    res.send(docs);
  });
});

//editing Designation
router.post('/EditDesignation', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  Designation.update({"_id":id},{$set:{"name":req.body.name}}, function(err,docs){
    connection.query('UPDATE `Designation` SET `name`="'+req.body.name+'" WHERE `_id`="'+id+'"', function (error, results, fields) {
     if (error) throw error;
    // connected!
    });
    res.send(docs)
  })
});

// removeing Designation
router.post('/RemoveDesignation', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  Designation.remove({"_id":id}, function(err,docs){
    connection.query('DELETE FROM `Designation` WHERE `_id`="'+id+'"', function (error, results, fields) {
      if (error) throw error;
    // connected!
    });
    res.send(docs)
  })
})
// getting Designation data
router.get('/getDesignationdata', function(req,res){
  Designation.find({}, function(err,docs){
    res.send(docs)
  })
})
//---------------------------------------------------Office Staff Data-------------------------------------------
var storage = multer.diskStorage({
  destination: '../public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })
var cpUpload = upload.fields([{ name: 'file', maxCount: 1 }, { name: 'adharfile', maxCount: 1 }])
router.post('/officefiledata',cpUpload, function(req,res){
    var data = {
    staffname:req.body.staffname,
    society:req.body.society,
    branch:req.body.branch,
    dateofjoin:moment(req.body.dateofjoin).format('DD-MM-YYYY'),
    mobile:req.body.mobile,
    aadharno:req.body.aadharno,
    designation:req.body.designation,
    profilepic:req.files['file'][0].filename,
    aadharpic:req.files['adharfile'][0].filename
  }
  officestaff.insert(data, function(err,docs){
    if(err){
      console.log(err);
    }
    else{
      console.log(docs);
      res.send(docs);
    }
  });
});

//editing Office
router.post('/editofficefiledata',cpUpload, function(req,res){
  var id = req.body._id;
  console.log(req.files)
  var data = {
    staffname:req.body.staffname,
    society:req.body.society,
    branch:req.body.branch,
    dateofjoin:req.body.dateofjoin,
    mobile:req.body.mobile,
    aadharno:req.body.aadharno,
    designation:req.body.designation,
    profilepic:req.files['file'][0].filename,
    aadharpic:req.files['adharfile'][0].filename
  }
  officestaff.update({"_id":id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});

// removeing Office
router.post('/RemoveOffice', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  officestaff.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})
// getting Office data
router.get('/getOfficedata', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
  officestaff.find({}, function(err,docs){
    res.send(docs)
  })
}    else if (req.session.user.username=='adcjkpur') {
  officestaff.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
  res.send(docs)
  });
}
    else if (req.session.user.username=='adcamp') {
      officestaff.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      officestaff.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      officestaff.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      officestaff.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      officestaff.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      officestaff.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      officestaff.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      officestaff.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      officestaff.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      officestaff.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      officestaff.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      officestaff.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      officestaff.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      officestaff.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      officestaff.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      officestaff.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      officestaff.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      officestaff.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      officestaff.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})
//----------------------------------------------Staffmeeting Data---------------------------------------------------
// adding Pollution
var storage = multer.diskStorage({
  destination: '../public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })
router.post('/Staffmeetingfiledata',upload.single('file'), function(req,res){
  // console.log(req.body);
  // console.log(req.file);
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    date : moment(req.body.date).format('DD-MM-YYYY'),
    points : req.body.points,
    file : req.file.filename
  }
  staffmeeting.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

router.get('/getStaffmeetingdata', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      staffmeeting.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      staffmeeting.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      staffmeeting.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      staffmeeting.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      staffmeeting.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      staffmeeting.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      staffmeeting.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      staffmeeting.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      staffmeeting.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      staffmeeting.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      staffmeeting.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      staffmeeting.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      staffmeeting.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      staffmeeting.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      staffmeeting.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      staffmeeting.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      staffmeeting.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      staffmeeting.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      staffmeeting.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      staffmeeting.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      staffmeeting.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

//editing staffmeeting
router.post('/EditStaffmeeting', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    date : req.body.date,
    points : req.body.points
  }
  staffmeeting.update({"_id":id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});

// removeing staffmeeting
router.post('/RemoveStaffmeeting', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  staffmeeting.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})
//---------------------------------------------------Bus Opt Staff-------------------------------------------
// adding BusOptStaff

var cpUpload1 = upload.fields([{ name: 'pic', maxCount: 1 }, { name: 'aadharpic', maxCount: 1 }, { name: 'liciensepic', maxCount: 1 }])
router.post('/busoptfiledata',cpUpload1,function(req,res){
  // console.log(req.body)
  // console.log(req.files['pic'][0].filename)
  // console.log(req.files['aadharpic'][0].filename)
  // console.log(req.files['liciensepic'][0].filename)
  // console.log(req.files['esi'][0].filename)
  var data = {
    staffname:req.body.staffname,
    society:req.body.society,
    branch:req.body.branch,
    mobile:req.body.mobile,
    aadharno:req.body.aadharno,
    badge:req.body.badge,
    licienseno:req.body.licienseno,
    valid:moment(req.body.valid).format('DD-MM-YYYY'),
    vehicleno:req.body.vehicleno,
    pic:req.files['pic'][0].filename,
    aadharpic:req.files['aadharpic'][0].filename,
    liciensepic:req.files['liciensepic'][0].filename
  }
  var name = req.body.name;
  //console.log(name);
  busoptstaff.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

//editing BusOptStaff
router.post('/editbusoptfiledata',cpUpload1, function(req,res){
  console.log(req.files)
  var data = {
    staffname:req.body.staffname,
    society:req.body.society,
    branch:req.body.branch,
    mobile:req.body.mobile,
    aadharno:req.body.aadharno,
    badge:req.body.badge,
    licienseno:req.body.licienseno,
    valid:req.body.valid,
    vehicleno:req.body.vehicleno,
    pic:req.files['pic'][0].filename,
    aadharpic:req.files['aadharpic'][0].filename,
    liciensepic:req.files['liciensepic'][0].filename
  }
  var id = req.body._id;
  busoptstaff.update({"_id":id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});





// removeing BusOptStaff
router.post('/RemoveBusOptStaff', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  busoptstaff.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})
// getting BusOptStaff data
router.get('/getBusOptStaffdata', function(req,res){
  busoptstaff.find({}, function(err,docs){
    res.send(docs)
  })
})
//---------------------------------------------------Bus Staff-------------------------------------------
// adding BusStaff

var cpUpload1 = upload.fields([{ name: 'pic', maxCount: 1 }, { name: 'aadharpic', maxCount: 1 }, { name: 'liciensepic', maxCount: 1 }])
router.post('/busfiledata',cpUpload1,function(req,res){
  console.log(req.body)
  // console.log(req.files['pic'][0].filename)
  // console.log(req.files['aadharpic'][0].filename)
  // console.log(req.files['liciensepic'][0].filename)
  // console.log(req.files['esi'][0].filename)
  var data = {
    staffname:req.body.staffname,
    society:req.body.society,
    branch:req.body.branch,
    dateofjoin:moment(req.body.dateofjoin).format('DD-MM-YYYY'),
    mobile:req.body.mobile,
    aadharno:req.body.aadharno,
    designation:req.body.designation,
    badge:req.body.badge,
    licienseno:req.body.licienseno,
    valid:moment(req.body.valid).format('DD-MM-YYYY'),
    rdate:moment(req.body.rdate).format('DD-MM-YYYY'),
    vehicleno:req.body.vehicleno,
    salary:req.body.salary,
    pic:req.files['pic'][0].filename,
    aadharpic:req.files['aadharpic'][0].filename,
    liciensepic:req.files['liciensepic'][0].filename
  }
  var name = req.body.name;
  //console.log(name);
  busstaff.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

//editing BusStaff
router.post('/editbusfiledata',cpUpload1, function(req,res){
  console.log(req.body)
  var data = {
    staffname:req.body.staffname,
    society:req.body.society,
    branch:req.body.branch,
    dateofjoin:moment(req.body.dateofjoin).format('DD-MM-YYYY'),
    mobile:req.body.mobile,
    aadharno:req.body.aadharno,
    designation:req.body.designation,
    badge:req.body.badge,
    licienseno:req.body.licienseno,
    valid:moment(req.body.valid).format('DD-MM-YYYY'),
    rdate:moment(req.body.rdate).format('DD-MM-YYYY'),
    vehicleno:req.body.vehicleno,
    salary:req.body.salary
  }
  var id = req.body._id;
  busstaff.update({"_id":id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});


// removeing BusStaff
router.post('/RemoveBusStaff', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  busstaff.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})
// getting BusStaff data
// router.get('/getBusStaffdata', function(req,res){

//   busstaff.find({}, function(err,docs){
//     console.log(docs)
//     res.send(docs)
//   })
// })

router.get('/getBusStaffdata', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
  busstaff.find({}, function(err,docs){
    res.send(docs)
  })
}    else if (req.session.user.username=='adcjkpur') {
  busstaff.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
  res.send(docs)
  });
}
    else if (req.session.user.username=='adcamp') {
      busstaff.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      busstaff.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      busstaff.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      busstaff.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      busstaff.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      busstaff.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      busstaff.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      busstaff.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      busstaff.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      busstaff.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      busstaff.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      busstaff.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      busstaff.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      busstaff.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      busstaff.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      busstaff.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      busstaff.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      busstaff.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      busstaff.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})


router.post('/getvehiclebusstaffinfo', function(req,res){
  console.log(req.body)
  busstaff.find({"vehicleno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})
//--------------------------------------------------Vehicle Data--------------------------------------------
// adding Vehicle
router.post('/VehicleData', function(req,res){
  console.log(req.body)
  var name = req.body.name;
  //console.log(name);
  vehiclemake.insert(req.body, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

router.get('/getVehicledata', function(req,res){
  vehiclemake.find({}, function(err,docs){
    //console.log(docs);
    res.send(docs);
  })
})

router.post('/EditVehicle', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  vehiclemake.update({"_id":id},{$set:{"name":req.body.name,"type":req.body.type,"model":req.body.model}}, function(err,docs){
    res.send(docs)
  })
});

router.post('/RemoveVehicle', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  vehiclemake.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})

//--------------------------------------------------Vehicle info Data--------------------------------------------
// adding Vehicle
router.post('/VehicleinfoData', function(req,res){
  //console.log(req.body)
  //console.log(name);
  vehicleinfo.insert(req.body, function(err,docs){
    //console.log(docs);
    connection.query('INSERT INTO `vehicalinfo` SET `_id`="'+docs._id+'", `capacity`="'+req.body.capacity+'", `ekmpl`="'+req.body.ekmpl+'", `fuel`="'+req.body.fuel+'", `fueltank`="'+req.body.fueltank+'", `make`="'+req.body.make+'", `model`="'+req.body.model+'", `regno`="'+req.body.regno+'", `servicemilaege`="'+req.body.servicemilaege+'", `serviceperiod`="'+req.body.serviceperiod+'", `status`="'+req.body.status+'", `type`="'+req.body.type+'", `tyres`="'+req.body.tyres+'"', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });
    res.send(docs);
  });
});

router.get('/getVehicleinfodata', function(req,res){
  vehicleinfo.find({}, function(err,docs){
    //console.log(docs)
    res.send(docs)
  })
})

router.get('/getHeavyVehicleinfo', function(req,res){
  vehicleinfo.find({"type":"BUS"}, function(err,docs){
    //console.log(docs)
    res.send(docs)
  })
})

router.get('/getLightVehicleinfo', function(req,res){
  vehicleinfo.find({"type":{$nin:["BUS"]}}, function(err,docs){
    // console.log(docs)
    res.send(docs)
  })
})


router.post('/EditVehicleinfo', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  vehicleinfo.update({"_id":id},{$set:{"make":req.body.make,"type":req.body.type,"fuel":req.body.fuel,"regno":req.body.regno,"model":req.body.model,"fueltank":req.body.fueltank,"capacity":req.body.capacity,"ekmpl":req.body.ekmpl,"serviceperiod":req.body.serviceperiod,"servicemilaege":req.body.servicemilaege,"tyres":req.body.tyres,"status":req.body.status}}, function(err,docs){
    connection.query('UPDATE `vehicalinfo` SET `capacity`="'+req.body.capacity+'", `ekmpl`="'+req.body.ekmpl+'",`fuel`="'+req.body.fuel+'", `fueltank`="'+req.body.fueltank+'", `make`="'+req.body.make+'", `model`="'+req.body.model+'", `regno`="'+req.body.regno+'", `servicemilaege`="'+req.body.servicemilaege+'", `serviceperiod`="'+req.body.serviceperiod+'", `status`="'+req.body.status+'", `type`="'+req.body.type+'", `tyres`="'+req.body.tyres+'" WHERE `_id`="'+id+'"', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });
    res.send(docs)
  })
});

router.post('/RemoveVehicleinfo', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  //console.log(id)
  vehicleinfo.remove({"_id":id}, function(err,docs){
    connection.query('DELETE FROM `vehicalinfo` WHERE `_id`="'+id+'"', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });

    res.send(docs)
  })
})

router.post('/getvehicleinfo', function(req,res){
  console.log(req.body)
  vehicleinfo.find({"regno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})

//--------------------------------------------------Branch vehicle Data--------------------------------------------
// adding Vehicle
router.post('/BranchvehicleData', function(req,res){
  //console.log(req.body)
  //console.log(name);
  var data = {
    society:req.body.society,
    branch:req.body.branch,
    staffname:req.body.staffname,
    vehicleregno:req.body.vehicleregno,
    model:req.body.model,
    purchasedate:moment(req.body.purchasedate).format('DD-MM-YYYY'),
    servicedate:moment(req.body.servicedate).format('DD-MM-YYYY')
  }
  var purdate = moment(req.body.purchasedate).format("YYYY-MM-DD");
  var serdate = moment(req.body.servicedate).format("YYYY-MM-DD");

  branchvehicle.insert(data, function(err,docs){
    //console.log(docs);

    connection.query('INSERT INTO `branchvehicle` SET `_id`="'+docs._id+'", `branch`="'+req.body.branch+'", `model`="'+req.body.model+'", `purchasedate`="'+purdate+'", `servicedate`="'+serdate+'", `society`="'+req.body.society+'", `staffname`="'+req.body.staffname+'", `vehicleregno`="'+req.body.vehicleregno+'"', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });

    res.send(docs);
  });
});

router.get('/getBranchvehicledata', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      branchvehicle.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      branchvehicle.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      branchvehicle.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      branchvehicle.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      branchvehicle.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      branchvehicle.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      branchvehicle.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      branchvehicle.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      branchvehicle.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      branchvehicle.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      branchvehicle.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      branchvehicle.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      branchvehicle.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      branchvehicle.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      branchvehicle.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      branchvehicle.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      branchvehicle.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      branchvehicle.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      branchvehicle.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      branchvehicle.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      branchvehicle.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

router.post('/EditBranchvehicle', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  var purdate = moment(req.body.purchasedate).format("YYYY-MM-DD");
  var serdate = moment(req.body.servicedate).format("YYYY-MM-DD");
  branchvehicle.update({"_id":id},{$set:{"society":req.body.society,"branch":req.body.branch,"staffname":req.body.staffname,"vehicleregno":req.body.vehicleregno,"model":req.body.model,"purchasedate":moment(req.body.purchasedate).format('DD-MM-YYYY'),"servicedate":moment(req.body.servicedate).format('DD-MM-YYYY')}}, function(err,docs){
    

    connection.query('UPDATE `branchvehicle` SET `branch`="'+req.body.branch+'", `model`="'+req.body.model+'", `purchasedate`="'+purdate+'", `servicedate`="'+serdate+'", `society`="'+req.body.society+'", `staffname`="'+req.body.staffname+'", `vehicleregno`="'+req.body.vehicleregno+'" WHERE `_id`="'+id+'"', function (error, results, fields) {
      if (error) throw error;
      // connected!
    });

    res.send(docs)
  })
});

router.post('/RemoveBranchvehicle', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  //console.log(id)
  branchvehicle.remove({"_id":id}, function(err,docs){
    connection.query('DELETE FROM `branchvehicle` WHERE `_id`="'+id+'"', function (error, results, fields) {
     if (error) throw error;
    // connected!
    });
    res.send(docs)
  })
})

router.post('/getvehiclebranchinfo', function(req,res){
  console.log(req.body)
  branchvehicle.find({"vehicleregno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})

//-----------------------------------------fuel suppliers----------------------------------------------------
// adding fuel
router.post('/FuelData', function(req,res){
  //console.log(req.body)
  var name = req.body.name;
  //console.log(name);
  fuel.insert(req.body, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

//editing sociecty
router.post('/EditFuel', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  fuel.update({"_id":id},{$set:{"name":req.body.name}}, function(err,docs){
    res.send(docs)
  })
});

// removeing
router.post('/RemoveFuel', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  fuel.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})
// getting fuel data
router.get('/getFueldata', function(req,res){
  fuel.find({}, function(err,docs){
    res.send(docs)
  })
})

//-----------------------------------------fuelbunk suppliers----------------------------------------------------
// adding fuel
router.post('/FuelbunkData', function(req,res){
  //console.log(req.body)
  var name = req.body.name;
  //console.log(name);
  fuelbunk.insert(req.body, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

//editing sociecty
router.post('/EditFuelbunk', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  fuelbunk.update({"_id":id},{$set:req.body}, function(err,docs){
    res.send(docs)
  })
});

// removeing
router.post('/RemoveFuelbunk', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  fuelbunk.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})
// getting fuel data
router.get('/getFuelbunkdata', function(req,res){
  fuelbunk.find({}, function(err,docs){
    res.send(docs)
  })
})
//-----------------------------------------bunkservicing suppliers----------------------------------------------------
// adding bunkservicing
router.post('/bunkservicingData', function(req,res){
  //console.log(req.body)
  var name = req.body.name;
  //console.log(name);
  var data = {
    branch : req.body.branch,
    company : req.body.company,
    reason : req.body.reason,
    date : moment(req.body.date).format('DD-MM-YYYY'),
    description : req.body.description,
    remarks : req.body.remarks
  }
  bunkservicing.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

//editing bunkservicing
router.post('/Editbunkservicing', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  var data = {
    branch : req.body.branch,
    company : req.body.company,
    reason : req.body.reason,
    date : req.body.date,
    description : req.body.description,
    remarks : req.body.remarks
  }
  bunkservicing.update({"_id":id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});

// removeing
router.post('/Removebunkservicing', function(req,res){
  console.log(req.body._id)
  var id = req.body._id;
  bunkservicing.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})
// getting bunkservicing data
router.get('/getbunkservicingdata', function(req,res){
  bunkservicing.find({}, function(err,docs){
    res.send(docs)
  })
})
//-----------------------------------------fuelfill suppliers----------------------------------------------------
// adding fuel
router.post('/FuelfillData', function(req,res){
  //console.log(req.body)
  var data = {
    bunkname : req.body.bunkname,
    bunksupplier : req.body.bunksupplier,
    billno : req.body.billno,
    billdate : moment(req.body.billdate).format('DD-MM-YYYY'),
    filldate : moment(req.body.filldate).format('DD-MM-YYYY'),
    tankerno : req.body.tankerno,
    quantity : req.body.quantity,
    rate : req.body.rate,
    trate : req.body.trate
  }

  var billdate = moment(req.body.billdate).format('YYYY-MM-DD');
  var filldate = moment(req.body.filldate).format('YYYY-MM-DD')

  fuelfill.insert(data, function(err,docs){
    //console.log(docs);
    connection.query('INSERT INTO `fuelfill` SET `_id`="'+docs._id+'", `billdate`="'+billdate+'", `billno`="'+req.body.billno+'", `bunkname`="'+req.body.bunkname+'", `bunksupplier`="'+req.body.bunksupplier+'", `filldate`="'+filldate+'", `quantity`="'+req.body.quantity+'", `rate`="'+req.body.rate+'", `tankerno`="'+req.body.tankerno+'", `trate`="'+req.body.trate+'"', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });

    res.send(docs);
  });
});
//editing Fuelfill
router.post('/EditFuelfill', function(req,res){
  //console.log(req.body._id)
  var data = {
    bunkname : req.body.bunkname,
    bunksupplier : req.body.bunksupplier,
    billno : req.body.billno,
    billdate : moment(req.body.billdate).format('DD-MM-YYYY'),
    filldate : moment(req.body.filldate).format('DD-MM-YYYY'),
    tankerno : req.body.tankerno,
    quantity : req.body.quantity,
    rate : req.body.rate,
    trate : req.body.trate
  }
  var id = req.body._id;
  if(req.body.billdate == undefined){
    var billdate = req.body.billdate;
  }
  else{
    var billdate = moment(req.body.billdate).format('YYYY-MM-DD');
  }
  
  if(req.body.filldate == undefined){
    var filldate = req.body.filldate;
  }
  else{
    var filldate = moment(req.body.filldate).format('YYYY-MM-DD');
  }
  
  fuelfill.update({"_id":id},{$set:data}, function(err,docs){
    //console.log(docs);

      connection.query('UPDATE `fuelfill` SET  `billdate`="'+billdate+'", `billno`="'+req.body.billno+'", `bunkname`="'+req.body.bunkname+'", `bunksupplier`="'+req.body.bunksupplier+'", `filldate`="'+filldate+'", `quantity`="'+req.body.quantity+'", `rate`="'+req.body.rate+'", `tankerno`="'+req.body.tankerno+'", `trate`="'+req.body.trate+'" WHERE `_id`="'+id+'"', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });
    res.send(docs)
  })
});
// removeing
router.post('/RemoveFuelfill', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  fuelfill.remove({"_id":id}, function(err,docs){

     connection.query('DELETE FROM `fuelfill` WHERE `_id`="'+id+'"', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });
    res.send(docs)
  })
})
// getting fuel data
router.get('/getFuelfilldata', function(req,res){
  fuelfill.find({}, function(err,docs){
    res.send(docs)
  })
})
//-----------------------------------------busfill suppliers----------------------------------------------------
// adding Busfill
router.post('/BusfillData', function(req,res){
  var dated = moment(req.body.date).format("DD-MM-YYYY")
  console.log(dated)
  var temp=moment().format('HH:mm');
  var timestam =gettimestamp(dated,temp)
  var data = {
    vehicletype : req.body.vehicletype,
    regno : req.body.regno,
    description : req.body.description,
    drivername : req.body.drivername,
    society:req.body.society,
    branch:req.body.branch,
    fuelsupplier : req.body.fuelsupplier,
    date : moment(req.body.date).format("DD-MM-YYYY"),
    Timestamp : timestam,
    frate : req.body.frate,
    model : req.body.model,
    fquantity : req.body.fquantity,
    total : req.body.total,
    token : req.body.token,
    issuedby : req.body.issuedby,
    omr : req.body.omr,
    cmr : req.body.cmr,
    kms : req.body.kms,
    grade : req.body.grade,
    avgkmpl : req.body.avgkmpl
  }
  var dated2 = moment(req.body.date).format("YYYY-MM-DD")

  busfill.insert(data, function(err,docs){
    //console.log(docs);
    connection.query('INSERT INTO `busfill` SET `_id`="'+docs._id+'", `vehicletype`="'+req.body.vehicletype+'", `regno`="'+req.body.regno+'", `description`="'+req.body.description+'", `drivername`="'+req.body.drivername+'", `society`="'+req.body.society+'", `branch`="'+req.body.branch+'", `fuelsupplier`="'+req.body.fuelsupplier+'", `date`="'+dated2+'", `Timestamp`="'+req.body.Timestamp+'", `frate`="'+req.body.frate+'", `model`="'+req.body.model+'", `fquantity`="'+req.body.fquantity+'", `total`="'+req.body.total+'", `token`="'+req.body.token+'", `issuedby`="'+req.body.issuedby+'", `omr`="'+req.body.omr+'", `cmr`="'+req.body.cmr+'", `kms`="'+req.body.cmr+'", `grade`="'+req.body.cmr+'", `avgkmpl`="'+req.body.avgkmpl+'"', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });
    res.send(docs);
  });
});
//editing Busfill
router.post('/EditBusfill', function(req,res){
  //console.log(req.body._id)
  var dated = moment(req.body.date).format("DD-MM-YYYY")
  console.log(dated)
  var temp=moment().format('HH:mm');
  var timestam =gettimestamp(dated,temp)
  var data = {
    vehicletype : req.body.vehicletype,
    regno : req.body.regno,
    description : req.body.description,
    drivername : req.body.drivername,
    society:req.body.society,
    branch:req.body.branch,
    fuelsupplier : req.body.fuelsupplier,
    date : moment(req.body.date).format("DD-MM-YYYY"),
    Timestamp : timestam,
    frate : req.body.frate,
    fquantity : req.body.fquantity,
    total : req.body.total,
    token : req.body.token,
    issuedby : req.body.issuedby,
    omr : req.body.omr,
    cmr : req.body.cmr,
    kms : req.body.kms,
    grade : req.body.grade,
    avgkmpl : req.body.avgkmpl
  }
  var id = req.body._id;
  var dated2 = moment(req.body.date).format("YYYY-MM-DD")
  
  busfill.update({"_id":id},{$set:data}, function(err,docs){
    //console.log(docs);
     connection.query('UPDATE  `busfill` SET  `vehicletype`="'+req.body.vehicletype+'", `regno`="'+req.body.regno+'", `description`="'+req.body.description+'", `drivername`="'+req.body.drivername+'", `society`="'+req.body.society+'", `branch`="'+req.body.branch+'", `fuelsupplier`="'+req.body.fuelsupplier+'", `date`="'+dated2+'", `Timestamp`="'+req.body.Timestamp+'", `frate`="'+req.body.frate+'", `model`="'+req.body.model+'", `fquantity`="'+req.body.fquantity+'", `total`="'+req.body.total+'", `token`="'+req.body.token+'", `issuedby`="'+req.body.issuedby+'", `omr`="'+req.body.omr+'", `cmr`="'+req.body.cmr+'", `kms`="'+req.body.cmr+'", `grade`="'+req.body.cmr+'", `avgkmpl`="'+req.body.avgkmpl+'" WHERE `_id`="'+_id+'",', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });
    res.send(docs)
  })
});
// removeing
router.post('/RemoveBusfill', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  busfill.remove({"_id":id}, function(err,docs){
    connection.query('DELETE FROM `busfill` WHERE `_id`="'+id+'"', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });
    res.send(docs)
  })
})

// Getting Total Busfill data
router.get('/getTotalBusfilldata', function(req,res){
  //console.log(req.body._id)
  var ftime =gettimestamp("06-01-2020","00:45");
  console.log(ftime)
  busfill.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]},"Timestamp":{$gte:ftime}}, function(err,docs){
    res.send(docs)
  })
})

// Getting Total Busfill data
router.get('/getTodayBusfilldata', function(req,res){
  //console.log(req.body._id)
  var date = moment().format("DD-MM-YYYY")
  busfill.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]},"date":date}, function(err,docs){
    res.send(docs)
  })
})


//var last_date = '';
// ss()
function ss(){
  var dates = moment().format("YYYY-MM-DD")
  busfill.findOne(
    {"date":{$lte: dates}},
    { sort: { date: -1 }},
    (err, data) => {
     console.log(data);
    },

  );
  }


// getting Bus data
router.get('/getBusfilldata', function(req,res){
  // var date = moment().format("DD-MM-YYYY")
  var dates = moment().format("YYYY-MM-DD")
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
       if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
          //   busfill.findOne(
          //     {"date":{$lte: dates},"grade":"A"},
          //     { sort: { date: -1 }},
          //     (err1, data) => {
    
          //       busfill.find({"date":data.date,"grade":"A"}, function(err2,docs1){
          //         res.send(docs1)
          //         console.log(docs1)
          //         });           
          //     },
          // )
          // busfill.find({"date":{$lte: dates}}, function(err,docs){
          //   res.send(docs)
          //   });
            busfill.find({"date":{$lte: dates}}, function(err,docs){
              res.send(docs)
              });
          
    }
    else if (req.session.user.username=='adcjkpur') {
      busfill.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      busfill.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      busfill.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      busfill.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      busfill.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      busfill.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      busfill.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      busfill.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      busfill.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      busfill.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      busfill.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      busfill.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      busfill.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      busfill.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      busfill.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg' ||  req.session.user.username=='fuel') {
      busfill.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      busfill.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      busfill.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      busfill.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      busfill.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})


router.post('/getBusfilldata1', function(req,res){
  // var date = moment().format("DD-MM-YYYY")
  var dates = moment().format("YYYY-MM-DD")
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
       if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
          //   busfill.findOne(
          //     {"date":{$lte: dates},"grade":"A"},
          //     { sort: { date: -1 }},
          //     (err1, data) => {
    
          //       busfill.find({"date":data.date,"grade":"A"}, function(err2,docs1){
          //         res.send(docs1)
          //         console.log(docs1)
          //         });           
          //     },
          // )
          // busfill.find({"date":{$lte: dates}}, function(err,docs){
          //   res.send(docs)
          //   });
            busfill.find({"regno":req.body.val}, function(err,docs){
              res.send(docs)
              });
          
    }
    else if (req.session.user.username=='adcjkpur') {
      busfill.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      busfill.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      busfill.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      busfill.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      busfill.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      busfill.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      busfill.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      busfill.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      busfill.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      busfill.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      busfill.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      busfill.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      busfill.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      busfill.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      busfill.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg' ||  req.session.user.username=='fuel') {
      busfill.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      busfill.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      busfill.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      busfill.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      busfill.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})



//search vehicle regno
router.post('/searchVehicleinfodata', function(req,res){
  var daat=req.body.value
  console.log(daat)
  vehicleinfo.find({"regno":{$regex:daat}}, function(err,docs){
    //console.log(docs)
    res.send(docs)
  })
})

// router.get('/busfill', function(req,res){
//   busfill.find({}, function(err,docs){
//     for(i=0;i<docs.length;i++){
//       var id = docs[i]._id
//       var date = docs[i].date
//       var from_x="05:00";
//       var det = gettimestamp(date,from_x)
//       console.log(det)
//       busfill.update({"_id":id},{$set:{"Timestamp":det}})
//     }
//   })
// })
router.post('/gettingbusfillsearchdata', function(req,res){
  busfill.find({"regno":req.body.reg}, function(err,docs){
    if(docs){
      // console.log(docs)
      res.send(docs)
    }
  })
})



router.post('/gettingbusfilldata', function(req,res){
    var fdate = moment(req.body.fdate).format("DD-MM-YYYY")
  var temp="00:00";
  var ftime =gettimestamp(fdate,temp)
  var tdate = moment(req.body.tdate).format("DD-MM-YYYY")
  var temp="23:59";
  var ttime =gettimestamp(tdate,temp)

  busfill.find({"Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
    if(docs){
      // console.log(docs)
      res.send(docs)
    }
  })
})

 function gettimestamp(currentdate,temp)
 {
   var timestamp=currentdate+" "+temp;
       dateTimeParts=timestamp.split(' '),
       timeParts=dateTimeParts[1].split(':'),
       dateParts=dateTimeParts[0].split('-');
 var date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);
 return date.getTime();
 }

router.post('/getvehiclebusfill', function(req,res){
  console.log(req.body)
  busfill.find({"regno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})


//-----------------------------------------Vehicle Trip----------------------------------------------------
// adding uploaddate
router.post('/postVehicleTrip', function(req,res){
  console.log(req.body)
  var a = parseInt(req.body.omr);
  var b = parseInt(req.body.cmr);
  // console.log(a)
  var kms = b-a;
  // console.log(kms)
  var c = req.body.distance;
  if(kms>c){
  var result="exceed" + (kms-c);
  }
  else{
   var result="";
  }
  var data = {
    society:req.body.society,
    branch:req.body.branch,
    regno:req.body.regno,
    routename:req.body.routename,
    date:moment(req.body.date).format("DD-MM-YYYY"),
    capacity: req.body.capacity,
    students:req.body.students,
    strength:req.body.strength,
    omr:parseInt(req.body.omr),
    cmr:parseInt(req.body.cmr),
    kms:kms,
    distance:parseInt(req.body.distance),
    result:result,
    remarks:req.body.remarks,
    uploaddate:moment().format("DD-MM-YYYY")
  }

  var date = moment(req.body.date).format("YYYY-MM-DD")
  var temp=moment().format('HH:mm');
  var timestamp =gettimestamp(date,temp)
  console.log(data)
  vehicletripdata.insert(data, function(err,docs){
    // console.log(docs);
    connection.query('INSERT INTO `vehicletripdata` SET `_id`="'+docs._id+'", `Timestamp`="'+timestamp+'", `branch`="'+req.body.branch+'", `capacity`="'+req.body.capacity+'", `cmr`="'+req.body.cmr+'", `date`="'+date+'", `distance`="'+req.body.distance+'", `kms`="'+req.body.kms+'", `omr`="'+req.body.omr+'", `regno`="'+req.body.regno+'", `remarks`="'+req.body.remarks+'", `result`="'+req.body.result+'", `routename`="'+req.body.routename+'", `society`="'+req.body.society+'", `strength`="'+req.body.strength+'", `students`="'+req.body.students+'", `uploaddate`="'+req.body.uploaddate+'"', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });

    res.send(docs);
  });
});


router.get('/vehicletripexceed', function(req,res){
  var date = moment().format("DD-MM-YYYY")
  if(req.session && req.session.user){
  res.locals.user = req.session.user;
    if(req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
        vehicletripdata.find({"result":/exceed/, "uploaddate":date}, function(err,docs32){
          res.send(docs32)
        });
      }
      else if (req.session.user.username=='adcjkpur') {
        vehicletripdata.find({"branch":/JAGANNAICKPUR/,"result":/exceed/ , "uploaddate":date}, function(err,docs32){
        res.send(docs32)
        });
      }
      else if (req.session.user.username=='adcamp') {
        vehicletripdata.find({"branch":/AMALAPURAM/,"result":/exceed/, "uploaddate":date}, function(err,docs32){
        res.send(docs32)
        });
      }
      else if (req.session.user.username=='adcbvrm') {
        vehicletripdata.find({"branch":/BHIMAVARAM/,"result":/exceed/, "uploaddate":date}, function(err,docs32){
        res.send(docs32)
        });
      }
      else if (req.session.user.username=='adceluru') {
        vehicletripdata.find({"branch":/ELURU/,"result":/exceed/, "uploaddate":date}, function(err,docs32){
        res.send(docs32)
        });
      }
      else if (req.session.user.username=='adcgmd') {
        vehicletripdata.find({"branch":/MAMIDADA/,"result":/exceed/, "uploaddate":date}, function(err,docs32){
        res.send(docs32)
        });
      }
      else if (req.session.user.username=='adcgwk') {
        vehicletripdata.find({"branch":/GAJUWAKA/,"result":/exceed/, "uploaddate":date}, function(err,docs32){
          res.send(docs32)
        });
      }
      else if (req.session.user.username=='adclakshya') {
        vehicletripdata.find({"branch":/LAKSHYA/,"result":/exceed/, "uploaddate":date}, function(err,docs32){
        res.send(docs32)
        });
      }
      else if (req.session.user.username=='adcmdp') {
        vehicletripdata.find({"branch":/MANDAPETA/,"result":/exceed/, "uploaddate":date}, function(err,docs32){
        res.send(docs32)
        });
      }
      else if (req.session.user.username=='adcnsp') {
        vehicletripdata.find({"branch":{$in:["AJCNSP",/NARASAPURAM/]},"result":/exceed/, "uploaddate":date}, function(err,docs32){
        res.send(docs32)
        });
      }
      else if (req.session.user.username=='adcpkl') {
        vehicletripdata.find({"branch":/PALAKOL/,"result":/exceed/, "uploaddate":date}, function(err,docs32){
        res.send(docs32)
        });
      }
      else if (req.session.user.username=='adcptp') {
        vehicletripdata.find({"branch":/PITHAPURAM/,"result":/exceed/, "uploaddate":date}, function(err,docs32){
        res.send(docs32)
        });
      }
      else if (req.session.user.username=='adcrjyd') {
        vehicletripdata.find({"branch":/RJY DEGREE/,"result":/exceed/, "uploaddate":date}, function(err,docs32){
        res.send(docs32)
        });
      }
      else if (req.session.user.username=='adcsklm') {
        vehicletripdata.find({"branch":/SRIKAKULAM/,"result":/exceed/, "uploaddate":date}, function(err,docs32){
        res.send(docs32)
        });
      }
      else if (req.session.user.username=='adctpg') {
        vehicletripdata.find({"branch":/TADEPALLIGUDEM/,"result":/exceed/, "uploaddate":date}, function(err,docs32){
        res.send(docs32)
        });
      }
      else if (req.session.user.username=='adctuni') {
        vehicletripdata.find({"branch":/TUNI/,"result":/exceed/, "uploaddate":date}, function(err,docs32){
        res.send(docs32)
        });
      }
      else if (req.session.user.username=='adcengg') {
        vehicletripdata.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]},"result":/exceed/, "uploaddate":date}, function(err,docs32){
        res.send(docs32)
        });
      }
      else if (req.session.user.username=='adckkd') {
        vehicletripdata.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
        res.send(docs)
        });
      }
      else if (req.session.user.username=='srikkd') {
        vehicletripdata.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
        res.send(docs)
        });
      }
      else if (req.session.user.username=='ajckkd') {
        vehicletripdata.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
        res.send(docs)
        });
      }
      else if (req.session.user.username=='adcpdp') {
        vehicletripdata.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]},"result":/exceed/, "uploaddate":date}, function(err,docs32){
        res.send(docs32)
        });
      }
  }
});
//editing Busfill
router.post('/EditVehicleTrip', function(req,res){
  //console.log(req.body._id)
    var dated = moment().format("DD-MM-YYYY")
  console.log(dated)
  var temp=moment().format('HH:mm');
  var timestam =gettimestamp(dated,temp)
  var a = parseInt(req.body.omr);
  var b = parseInt(req.body.cmr);
  var kms = b-a;
  var c = req.body.distance;
  if(kms>c){
    result="exceed" + (kms-c);
  }
  else{
    result="";
  }
  console.log(req.body.remarks)
  var data = {
    society:req.body.society,
    branch:req.body.branch,
    regno:req.body.regno,
    routename:req.body.routename,
    date:moment(req.body.date).format("DD-MM-YYYY"),
    Timestamp:timestam,
    capacity: req.body.capacity,
    students:req.body.students,
    strength:req.body.strength,
    omr:parseInt(req.body.omr),
    cmr:parseInt(req.body.cmr),
    kms:parseInt(kms),
    distance:parseInt(req.body.distance),
    result:result,
    remarks:req.body.remarks,
    uploaddate:dated
  }
  var id = req.body._id;
  console.log(id)

      vehicletripdata.update({"_id":id},{$set:data}, function(err,docs1){
        //console.log(docs);
        res.send(docs1)
      })
});
// removeing
router.post('/RemoveVehicleTrip', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  vehicletripdata.remove({"_id":id}, function(err,docs){
    connection.query('DELETE FROM `vehicletripdata` WHERE `_id`="'+id+'"', function (error, results, fields) {
    if (error) throw error;
    // connected!
    });
    res.send(docs)
  })
})
// getting Bus data
router.get('/getVehicleTripdata', function(req,res){
  if(req.session && req.session.user){
  res.locals.user = req.session.user;
  var date = moment().format('DD-MM-YYYY');
  // console.log(date);
    vehicletrip.find({}, function(err,docs){
       for(i=0;i<docs.length;i++){
        var Dated=docs[i].date;
        // console.log(Dated)
        var id=docs[i]._id;
        var cmrval=docs[i].cmr;
        if(Dated==date){
          vehicletrip.find({"date":date}, function(err,docs1){
            // console.log(docs1)
          })
        }
        else{
          vehicletrip.update({"_id":id},{$set:{"date":date,"students":"","omr":cmrval,"cmr":"","kms":"","remarks":""}}, function(err,docs2){
            // console.log(docs2)
          })
        }
      }
    });
    if((req.session.user.username=='vms') || (req.session.user.username=='vc')) {
      vehicletripdata.find({"uploaddate":date}, function(err,docs){
      console.log(docs)
      res.send(docs)
      });
    }
    else if (req.session.user.username=='vmskkd') {
      vehicletripdata.find({"uploaddate":date}, function(err,docs){
      // console.log(docs)
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      vehicletripdata.find({"branch":/JAGANNAICKPUR/, "uploaddate":date}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      vehicletripdata.find({"branch":/AMALAPURAM/, "uploaddate":date}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      vehicletripdata.find({"branch":/BHIMAVARAM/, "uploaddate":date}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      vehicletripdata.find({"branch":/ELURU/, "uploaddate":date}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      vehicletripdata.find({"branch":/MAMIDADA/, "uploaddate":date}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      vehicletripdata.find({"branch":/GAJUWAKA/, "uploaddate":date}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      vehicletripdata.find({"branch":/LAKSHYA/, "uploaddate":date}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      vehicletripdata.find({"branch":/MANDAPETA/, "uploaddate":date}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      vehicletripdata.find({"branch":{$in:["AJCNSP",/NARASAPURAM/]}, "uploaddate":date}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      vehicletripdata.find({"branch":/PALAKOL/, "uploaddate":date}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      vehicletripdata.find({"branch":/PITHAPURAM/, "uploaddate":date}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      vehicletripdata.find({"branch":/RJY DEGREE/, "uploaddate":date}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      vehicletripdata.find({"branch":/SRIKAKULAM/, "uploaddate":date}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      vehicletripdata.find({"branch":/TADEPALLIGUDEM/, "uploaddate":date}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      vehicletripdata.find({"branch":/TUNI/, "uploaddate":date}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      vehicletripdata.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}, "uploaddate":date}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      vehicletripdata.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      vehicletripdata.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      vehicletripdata.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      vehicletripdata.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}, "uploaddate":date}, function(err,docs){
      res.send(docs)
      });
    }
}

})


router.post('/gettingvehicletripdata', function(req,res){
  if(req.session && req.session.user){
    var fdate = moment(req.body.fdate).format("DD-MM-YYYY")
  var temp="00:00";
  var ftime =gettimestamp(fdate,temp)
  var tdate = moment(req.body.tdate).format("DD-MM-YYYY")
  var temp="23:59";
  var ttime =gettimestamp(tdate,temp)

  // vehicletripdata.find({"Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
  //   if(docs){
  //     // console.log(docs)
  //     res.send(docs)
  //   }
  // })
  console.log("fdate"+fdate+"tdate"+tdate)
  if(req.session.user.username=='vms') {
      vehicletripdata.find({"Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      //console.log(docs)
      res.send(docs)
      });
    }
    else if (req.session.user.username=='vc') {
      vehicletripdata.find({"Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      // console.log(docs)
      res.send(docs)
      });
    }
    else if (req.session.user.username=='vmskkd') {
      vehicletripdata.find({"Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      // console.log(docs)
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      vehicletripdata.find({"branch":/JAGANNAICKPUR/, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      vehicletripdata.find({"branch":/AMALAPURAM/, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      vehicletripdata.find({"branch":/BHIMAVARAM/, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      vehicletripdata.find({"branch":/ELURU/, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      vehicletripdata.find({"branch":/MAMIDADA/, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      vehicletripdata.find({"branch":/GAJUWAKA/, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      vehicletripdata.find({"branch":/LAKSHYA/, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      vehicletripdata.find({"branch":/MANDAPETA/, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      vehicletripdata.find({"branch":{$in:["AJCNSP",/NARASAPURAM/]}, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
        //console.log(docs)
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      vehicletripdata.find({"branch":/PALAKOL/, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      vehicletripdata.find({"branch":/PITHAPURAM/, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      vehicletripdata.find({"branch":/RJY DEGREE/, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      vehicletripdata.find({"branch":/SRIKAKULAM/, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      vehicletripdata.find({"branch":/TADEPALLIGUDEM/, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      vehicletripdata.find({"branch":/TUNI/, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      vehicletripdata.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      vehicletripdata.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]},"Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      vehicletripdata.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      vehicletripdata.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      vehicletripdata.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}, "Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
 }   
})

router.post('/getvehicletrip', function(req,res){
  console.log(req.body)
  vehicletripdata.find({"regno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})

//-----------------------------------------Staff Remarks ----------------------------------------------------
// adding Bus Remarks
router.post('/BusremarksData', function(req,res){
  //console.log(req.body)
  var data = {
    society:req.body.society,
    branch:req.body.branch,
    designation:req.body.designation,
    staffname:req.body.staffname,
    date:moment(req.body.date).format("DD-MM-YYYY"),
    remarks:req.body.remarks,
    description:req.body.description
  }
  busremarks.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});
//editing Bus Remarks
router.post('/editBusremarks', function(req,res){
  //console.log(req.body._id)
  var data = {
    society:req.body.society,
    branch:req.body.branch,
    designation:req.body.designation,
    staffname:req.body.staffname,
    date:req.body.date,
    remarks:req.body.remarks,
    description:req.body.description
  }
  var id = req.body._id;
  busremarks.update({"_id":id},{$set:data}, function(err,docs){
    //console.log(docs);
    res.send(docs)
  })
});
// removeing
router.post('/removeBusRemarks', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  busremarks.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})
// getting Bus Remarks
router.get('/getBusremarks', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      busremarks.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      busremarks.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      busremarks.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      busremarks.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      busremarks.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      busremarks.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      busremarks.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      busremarks.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      busremarks.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      busremarks.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      busremarks.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      busremarks.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      busremarks.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      busremarks.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      busremarks.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      busremarks.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      busremarks.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      busremarks.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      busremarks.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      busremarks.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      busremarks.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})
//-----------------------------------------Vehicle Accidents ----------------------------------------------------
var storage = multer.diskStorage({
  destination: '../public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })
// adding Vehicle Accidents
router.post('/accidentfiledata',upload.single('image'), function(req,res){
  console.log(req.body);
  console.log(req.file);
  console.log(req.file.filename);
  var data = {
    society:req.body.society,
    branch:req.body.branch,
    staffname:req.body.staffname,
    vehicleregno:req.body.vehicleregno,
    type:req.body.type,
    settlement:req.body.settlement,
    date:moment(req.body.date).format("DD-MM-YYYY"),
    place:req.body.place,
    action:req.body.action,
    amount:req.body.amount,
    from:req.body.from,
    description:req.body.description,
    image:req.file.filename,
    remarks:req.body.remarks
  }
  vehicleaccident.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});
//editing Vehicle Accidents
router.post('/editaccidentfiledata',upload.single('image'), function(req,res){
  //console.log(req.body._id)
  var data = {
    society:req.body.society,
    branch:req.body.branch,
    staffname:req.body.staffname,
    vehicleregno:req.body.vehicleregno,
    type:req.body.type,
    settlement:req.body.settlement,
    date:req.body.date,
    place:req.body.place,
    action:req.body.action,
    amount:req.body.amount,
    from:req.body.from,
    description:req.body.description,
    image:req.file.filename,
    remarks:req.body.remarks
  }
  var id = req.body._id;
  vehicleaccident.update({"_id":id},{$set:data}, function(err,docs){
    //console.log(docs);
    res.send(docs)
  })
});
// removeing
router.post('/removeVehicleAccident', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  vehicleaccident.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})
// getting Vehicle Accidents
router.get('/getVehicleAccident', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      vehicleaccident.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      vehicleaccident.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      vehicleaccident.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      vehicleaccident.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      vehicleaccident.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      vehicleaccident.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      vehicleaccident.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      vehicleaccident.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      vehicleaccident.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      vehicleaccident.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      vehicleaccident.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      vehicleaccident.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      vehicleaccident.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      vehicleaccident.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      vehicleaccident.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      vehicleaccident.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      vehicleaccident.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      vehicleaccident.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      vehicleaccident.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      vehicleaccident.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      vehicleaccident.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

router.post('/getvehicleaccident', function(req,res){
  console.log(req.body)
  vehicleaccident.find({"vehicleregno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})

//-----------------------------------------Vehicle Services ----------------------------------------------------
// adding Vehicle Services
router.post('/VehicleserviceData', function(req,res){
    var dated = moment(req.body.date).format("DD-MM-YYYY")
  var temp=moment().format('HH:mm');
  var timestamp =gettimestamp(dated,temp)
  //console.log(req.body)
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    model : req.body.model,
    vehicleregno : req.body.vehicleregno,
    date : dated,
    Timestamp : timestamp,
    serviceparts : req.body.serviceparts,
    duration : req.body.duration,
    lastreading : req.body.lastreading,
    presentreading : req.body.presentreading,
    kms : req.body.kms,
    remainder : req.body.remainder,
    remarks : req.body.remarks
  }
  vehicleservice.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});
//editing Vehicle Services
router.post('/EditVehicleservice', function(req,res){
  var dated = moment(req.body.date).format("DD-MM-YYYY")
  var temp=moment().format('HH:mm');
  var timestamp =gettimestamp(dated,temp)
  //console.log(req.body._id)
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    model : req.body.model,
    vehicleregno : req.body.vehicleregno,
    date : dated,
    Timestamp: timestamp,
    serviceparts : req.body.serviceparts,
    duration : req.body.duration,
    lastreading : req.body.lastreading,
    presentreading : req.body.presentreading,
    kms : req.body.kms,
    remainder : req.body.remainder,
    remarks : req.body.remarks
  }
  var id = req.body._id;
  vehicleservice.update({"_id":id},{$set:data}, function(err,docs){
    //console.log(docs);
    res.send(docs)
  })
});
// removeing
router.post('/RemoveVehicleservice', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  vehicleservice.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})

// router.get('/getVehicleservice1', function (req,res) {
//   vehicletripdata.find({}, function(err,docs){
//     for(i=0;i<docs.length;i++){
//       // console.log(docs[i])
//       var cmr=docs[i].cmr
//       var data={
//         "society":docs[i].society,
//         "branch":docs[i].branch,
//         "vehicleregno":docs[i].regno,
//         'presentreading':docs[i].cmr
//       }
//       var date = moment().format('DD-MM-YYYY');
//       // console.log(date)
//       if(docs[i].uploaddate==date){
//         // console.log(data)
//         // console.log(cmr)
        
//           vehicleservice.update({"vehicleregno":docs[i].regno}, {$set:{"presentreading":cmr}},{multi:true}, function (err2, docs2) {
//             console.log(docs2)
//           })
//         }
// }
//   // res.send(docs)
//   });
// })


// getting Vehicle Services
router.post('/getVehicleservice1', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      vehicleservice.find({"vehicleregno":req.body.val}, function(err,docs){
        res.send(docs)
        });
        
    }
    else if (req.session.user.username=='adcjkpur') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      vehicleservice.find({"vehicleregno":req.body.val, "branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

// getting Vehicle Services
router.get('/getVehicleservice', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      vehicleservice.find({}, function(err,docs){
        res.send(docs)
        });
        
    }
    else if (req.session.user.username=='adcjkpur') {
      vehicleservice.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      vehicleservice.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      vehicleservice.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      vehicleservice.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      vehicleservice.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      vehicleservice.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      vehicleservice.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      vehicleservice.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      vehicleservice.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      vehicleservice.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      vehicleservice.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      vehicleservice.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      vehicleservice.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      vehicleservice.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      vehicleservice.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      vehicleservice.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      vehicleservice.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      vehicleservice.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      vehicleservice.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      vehicleservice.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

//entire vehicleservice data update
router.post('/vehicleservices', function(req,res){
  var data = req.body
  for(i=0;i<data.length;i++){
    var id = data[i]._id
    var presentread = data[i].presentreading
    var kms = data[i].kms
    vehicleservice.update({"_id":id},{$set:{"presentreading":presentread,"kms":kms}}, function(err,docs){
      // console.log(docs)
    })
  }
  res.sendStatus(200)
});


router.post('/getvehicleservicesdata', function(req,res){
  console.log(req.body)
  vehicleservice.find({"vehicleregno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})
//----------------------------------------------Rta Data---------------------------------------------------
// adding Rta
var storage = multer.diskStorage({
  destination: '../public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })
router.post('/rtafiledata',upload.single('file'), function(req,res){
  // console.log(req.body);
  // console.log(req.file);
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    model : req.body.model,
    regno : req.body.regno,
    serviceno : req.body.serviceno,
    date : moment(req.body.date).format('DD-MM-YYYY'),
    expireddate : moment(req.body.expireddate).format('DD-MM-YYYY'),
    chasis : req.body.chasis,
    engine : req.body.engine,
    fuel : req.body.fuel,
    horsepower : req.body.horsepower,
    cc : req.body.cc,
    wheel : req.body.wheel,
    capacity : req.body.capacity,
    file:req.file.filename
  }
  rta.insert(data, function(err,docs){
    console.log(docs);
    res.send(docs);
  });
});

router.get('/getRtadata', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      
      rta.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      rta.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      rta.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      rta.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      rta.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      rta.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      rta.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      rta.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      rta.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      rta.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      rta.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      rta.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      rta.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      rta.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      rta.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      rta.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      rta.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      rta.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      rta.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      rta.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      rta.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

//editing Rta
router.post('/EditRta',upload.single('file'), function(req,res){
    console.log(req.body.date.length+ "  "+ req.body.expireddate.length)
    var file_upload
    var b_date 
    var expired_date
  if((req.file == undefined) || (req.file == "")){
     file_upload = req.body.file
  }
  else{
    file_upload = req.file.filename
  }

  if(req.body.date.length == 10){
      b_date =  req.body.date
  }
  else{
      b_date =moment(req.body.date).format('DD-MM-YYYY');
  }

  if(req.body.expireddate.length == 10){
      expired_date = req.body.expireddate
  }
  else{
      expired_date = moment(req.body.expireddate).format('DD-MM-YYYY');
  }
  //console.log(req.body._id)
  var id = req.body._id;
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    model : req.body.model,
    regno : req.body.regno,
    serviceno : req.body.serviceno,
    date : b_date,
    expireddate : expired_date,
    chasis : req.body.chasis,
    engine : req.body.engine,
    fuel : req.body.fuel,
    horsepower : req.body.horsepower,
    cc : req.body.cc,
    wheel : req.body.wheel,
    capacity : req.body.capacity,
    file : file_upload
  }
  rta.update({"_id":id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});

// removeing Rta
router.post('/RemoveRta', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  rta.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})

router.get('/RtaExpired', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    var date= moment().format('DD-MM-YYYY')
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      rta.find({"expireddate":date}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      rta.find({"expireddate":date,"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      rta.find({"expireddate":date,"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      rta.find({"expireddate":date,"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      rta.find({"expireddate":date,"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      rta.find({"expireddate":date,"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      rta.find({"expireddate":date,"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      rta.find({"expireddate":date,"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      rta.find({"expireddate":date,"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      rta.find({"expireddate":date,"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      rta.find({"expireddate":date,"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      rta.find({"expireddate":date,"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      rta.find({"expireddate":date,"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      rta.find({"expireddate":date,"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      rta.find({"expireddate":date,"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      rta.find({"expireddate":date,"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      rta.find({"expireddate":date,"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      rta.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      rta.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      rta.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      rta.find({"expireddate":date,"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

router.post('/getvehiclerta', function(req,res){
  console.log(req.body)
  rta.find({"regno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})

//----------------------------------------------Insurance Data---------------------------------------------------
// adding Insurance
var storage = multer.diskStorage({
  destination: '../public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })
router.post('/roadInsurancefiledata',upload.single('file'), function(req,res){
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    model : req.body.model,
    regno : req.body.regno,
    policy : req.body.policy,
    company : req.body.company,
    pdate : moment(req.body.pdate).format('DD-MM-YYYY'),
    sdate : moment(req.body.sdate).format('DD-MM-YYYY'),
    edate : moment(req.body.edate).format('DD-MM-YYYY'),
    rdate : moment(req.body.rdate).format('DD-MM-YYYY'),
    period : req.body.period,
    amount : req.body.amount,
    term : req.body.term,
    file:req.file.filename
  }
  insurance.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

router.get('/getInsurancedata', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      insurance.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      insurance.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      insurance.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      insurance.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      insurance.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      insurance.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      insurance.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      insurance.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      insurance.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      insurance.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      insurance.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      insurance.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      insurance.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      insurance.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      insurance.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      insurance.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      insurance.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      insurance.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      insurance.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      insurance.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      insurance.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

//editing Insurance
router.post('/EditInsurance',upload.single('file'), function(req,res){
  //console.log(req.body._id)

  var file_upload
    var Period_date 
    var Start_date
    var End_date
    var Remainder_date

  if((req.file == undefined) || (req.file == "")){
     file_upload = req.body.file
  }
  else{
    file_upload = req.file.filename
  }

  if(req.body.pdate.length <= 10){
      Period_date =  req.body.pdate
  }
  else{
      Period_date =moment(req.body.pdate).format('DD-MM-YYYY');
  }

  if(req.body.sdate.length <= 10){
      Start_date = req.body.sdate
  }
  else{
      Start_date = moment(req.body.sdate).format('DD-MM-YYYY');
  }

  if(req.body.edate.length <= 10){
      End_date = req.body.edate
  }
  else{
      End_date = moment(req.body.edate).format('DD-MM-YYYY');
  }

  if(req.body.rdate.length <= 10){
      Remainder_date = req.body.rdate
  }
  else{
      Remainder_date = moment(req.body.rdate).format('DD-MM-YYYY');
  }


  var id = req.body._id;
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    model : req.body.model,
    regno : req.body.regno,
    policy : req.body.policy,
    company : req.body.company,
    pdate : Period_date,
    sdate : Start_date,
    edate : End_date,
    rdate : Remainder_date,
    period : req.body.period,
    amount : req.body.amount,
    term : req.body.term,
    file : file_upload
  }
  insurance.update({"_id":id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});

// removeing Insurance
router.post('/RemoveInsurance', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  insurance.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})

//insurance expired data
router.get('/InsuranceExpired', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    var date= moment().format('DD-MM-YYYY')
    insurance.find({},function(err,data){
      for(i=0;i<data.length;i++){
        var id = data[i]._id
        if(date==data[i].rdate){
          insurance.update({"_id":id},{$set:{"status":"on"}})
        }
        else if(date==data[i].valid){
          insurance.update({"_id":id},{$set:{"status":"off"}})
        }
      }
    })
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      insurance.find({"status":"on"}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      insurance.find({"status":"on","branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      insurance.find({"status":"on","branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      insurance.find({"status":"on","branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      insurance.find({"status":"on","branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      insurance.find({"status":"on","branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      insurance.find({"status":"on","branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      insurance.find({"status":"on","branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      insurance.find({"status":"on","branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      insurance.find({"status":"on","branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      insurance.find({"status":"on","branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      insurance.find({"status":"on","branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      insurance.find({"status":"on","branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      insurance.find({"status":"on","branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      insurance.find({"status":"on","branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      insurance.find({"status":"on","branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      insurance.find({"status":"on","branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      insurance.find({"status":"on","branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      insurance.find({"status":"on","branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      insurance.find({"status":"on","branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      insurance.find({"status":"on","branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

router.post('/getvehicleinsurance', function(req,res){
  console.log(req.body)
  insurance.find({"regno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})

//----------------------------------------------Pollution Data---------------------------------------------------
// adding Pollution
var storage = multer.diskStorage({
  destination: '../public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })
router.post('/pollutionfiledata',upload.single('file'), function(req,res){
  // console.log(req.body);
  // console.log(req.file);
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    model : req.body.model,
    regno : req.body.regno,
    date : moment(req.body.date).format('DD-MM-YYYY'),
    valid : moment(req.body.valid).format('DD-MM-YYYY'),
    rdate : moment(req.body.rdate).format('DD-MM-YYYY'),
    file:req.file.filename
  }
  pollution.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

router.get('/getPollutiondata', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      pollution.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      pollution.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      pollution.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      pollution.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      pollution.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      pollution.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      pollution.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      pollution.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      pollution.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      pollution.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      pollution.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      pollution.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      pollution.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      pollution.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      pollution.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      pollution.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      pollution.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      pollution.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      pollution.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      pollution.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      pollution.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

//editing Pollution
router.post('/EditPollution',upload.single('file'), function(req,res){
  //console.log(req.body._id)

    // console.log(req.body.date.length+ "  "+ req.body.expireddate.length)
    var file_upload
    var date 
    var Valid_date
    var Remainder_date
  if((req.file == undefined) || (req.file == "")){
     file_upload = req.body.file
  }
  else{
    file_upload = req.file.filename
  }

  if(req.body.date.length <= 10){
      date =  req.body.date
  }
  else{
      date =moment(req.body.date).format('DD-MM-YYYY');
  }

  if(req.body.valid.length <= 10){
      Valid_date = req.body.valid
  }
  else{
      Valid_date = moment(req.body.valid).format('DD-MM-YYYY');
  }

  if(req.body.rdate.length <= 10){
      Remainder_date = req.body.rdate
  }
  else{
      Remainder_date = moment(req.body.rdate).format('DD-MM-YYYY');
  }

  var id = req.body._id;
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    model : req.body.model,
    regno : req.body.regno,
    date : date,
    valid : Valid_date,
    rdate : Remainder_date,
    file:file_upload
  }
  pollution.update({"_id":id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});

// removeing Pollution
router.post('/RemovePollution', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  pollution.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})

// pollution expired details
router.get('/PollutionExpired', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    var date= moment().format('DD-MM-YYYY')
    pollution.find({},function(err,data){
      for(i=0;i<data.length;i++){
        var id = data[i]._id
        if(date==data[i].rdate){
          pollution.update({"_id":id},{$set:{"status":"on"}})
        }
        else if(date==data[i].valid){
          pollution.update({"_id":id},{$set:{"status":"off"}})
        }
      }
    })
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      pollution.find({"status":"on"}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      pollution.find({"status":"on","branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      pollution.find({"status":"on","branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      pollution.find({"status":"on","branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      pollution.find({"status":"on","branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      pollution.find({"status":"on","branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      pollution.find({"status":"on","branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      pollution.find({"status":"on","branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      pollution.find({"status":"on","branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      pollution.find({"status":"on","branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      pollution.find({"status":"on","branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      pollution.find({"status":"on","branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      pollution.find({"status":"on","branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      pollution.find({"status":"on","branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      pollution.find({"status":"on","branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      pollution.find({"status":"on","branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      pollution.find({"status":"on","branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      pollution.find({"status":"on","branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      pollution.find({"status":"on","branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      pollution.find({"status":"on","branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      pollution.find({"status":"on","branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

router.post('/getvehiclepollution', function(req,res){
  console.log(req.body)
  pollution.find({"regno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})
//----------------------------------------------Fitness Data---------------------------------------------------
// adding Fitness
var storage = multer.diskStorage({
  destination: '../public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })
router.post('/fitnessfiledata',upload.single('file'), function(req,res){
    var data = {
      society : req.body.society,
      branch : req.body.branch,
      model : req.body.model,
      regno : req.body.regno,
      certificate : req.body.certificate,
      issueddate : moment(req.body.issueddate).format('DD-MM-YYYY'),
      valid : moment(req.body.valid).format('DD-MM-YYYY'),
      rdate : moment(req.body.rdate).format('DD-MM-YYYY'),
      file:req.file.filename
    }
  fitness.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

router.get('/getFitnessdata', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      fitness.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      fitness.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      fitness.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      fitness.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      fitness.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      fitness.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      fitness.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      fitness.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      fitness.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      fitness.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      fitness.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      fitness.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      fitness.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      fitness.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      fitness.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      fitness.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      fitness.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      fitness.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      fitness.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      fitness.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      fitness.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

//editing Fitness
router.post('/EditFitness',upload.single('file'), function(req,res){
  //console.log(req.body._id)
    var file_upload
    var issueddate 
    var Valid_date
    var Remainder_date
  if((req.file == undefined) || (req.file == "")){
     file_upload = req.body.file
  }
  else{
    file_upload = req.file.filename
  }

  if(req.body.issueddate.length <= 10){
      issueddate =  req.body.issueddate
  }
  else{
      issueddate =moment(req.body.issueddate).format('DD-MM-YYYY');
  }

  if(req.body.valid.length <= 10){
      Valid_date = req.body.valid
  }
  else{
      Valid_date = moment(req.body.valid).format('DD-MM-YYYY');
  }

  if(req.body.rdate.length <= 10){
      Remainder_date = req.body.rdate
  }
  else{
      Remainder_date = moment(req.body.rdate).format('DD-MM-YYYY');
  }
  var id = req.body._id;
  var data = {
      society : req.body.society,
      branch : req.body.branch,
      model : req.body.model,
      regno : req.body.regno,
      certificate : req.body.certificate,
      issueddate : issueddate,
      valid : Valid_date,
      rdate : Remainder_date,
      file: file_upload
    }
  fitness.update({"_id":id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});

// removeing Fitness
router.post('/RemoveFitness', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  fitness.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})

// fitness expired details
router.get('/FitnessExpired', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    var date= moment().format('DD-MM-YYYY')
    fitness.find({},function(err,data){
      for(i=0;i<data.length;i++){
        var id = data[i]._id
        if(date==data[i].rdate){
          fitness.update({"_id":id},{$set:{"status":"on"}})
        }
        else if(date==data[i].valid){
          fitness.update({"_id":id},{$set:{"status":"off"}})
        }
      }
    })
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      fitness.find({"status":"on"}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      fitness.find({"status":"on","branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      fitness.find({"status":"on","branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      fitness.find({"status":"on","branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      fitness.find({"status":"on","branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      fitness.find({"status":"on","branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      fitness.find({"status":"on","branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      fitness.find({"status":"on","branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      fitness.find({"status":"on","branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      fitness.find({"status":"on","branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      fitness.find({"status":"on","branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      fitness.find({"status":"on","branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      fitness.find({"status":"on","branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      fitness.find({"status":"on","branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      fitness.find({"status":"on","branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      fitness.find({"status":"on","branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      fitness.find({"status":"on","branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      fitness.find({"status":"on","branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      fitness.find({"status":"on","branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      fitness.find({"status":"on","branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      fitness.find({"status":"on","branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

router.post('/getvehiclefitness', function(req,res){
  console.log(req.body)
  fitness.find({"regno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})
//----------------------------------------------Roadtax Data---------------------------------------------------
// adding roadtax
var storage = multer.diskStorage({
  destination: '../public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })
router.post('/roadtaxfiledata',upload.single('file'), function(req,res){
  // console.log(req.body);
  // console.log(req.file);
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    model : req.body.model,
    regno : req.body.regno,
    certificate : req.body.certificate,
    issueddate : moment(req.body.issueddate).format('DD-MM-YYYY'),
    valid : moment(req.body.valid).format('DD-MM-YYYY'),
    ddate : moment(req.body.ddate).format('DD-MM-YYYY'),
    grace : req.body.grace,
    file:req.file.filename
  }
  roadtax.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

router.get('/getRoadtaxdata', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      roadtax.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      roadtax.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      roadtax.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      roadtax.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      roadtax.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      roadtax.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      roadtax.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      roadtax.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      roadtax.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      roadtax.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      roadtax.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      roadtax.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      roadtax.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      roadtax.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      roadtax.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      roadtax.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      roadtax.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      roadtax.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      roadtax.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      roadtax.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      roadtax.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

//editing roadtax
router.post('/EditRoadtax',upload.single('file') , function(req,res){
  //console.log(req.body._id)

   var file_upload
    var issueddate 
    var Valid_date
    var Remainder_date
  if((req.file == undefined) || (req.file == "")){
     file_upload = req.body.file
  }
  else{
    file_upload = req.file.filename
  }

  if(req.body.issueddate.length <= 10){
      issueddate =  req.body.issueddate
  }
  else{
      issueddate =moment(req.body.issueddate).format('DD-MM-YYYY');
  }

  if(req.body.valid.length <= 10){
      Valid_date = req.body.valid
  }
  else{
      Valid_date = moment(req.body.valid).format('DD-MM-YYYY');
  }

  if(req.body.ddate.length <= 10){
      Remainder_date = req.body.ddate
  }
  else{
      Remainder_date = moment(req.body.ddate).format('DD-MM-YYYY');
  }

  var id = req.body._id;
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    model : req.body.model,
    regno : req.body.regno,
    certificate : req.body.certificate,
    issueddate : issueddate,
    valid : Valid_date,
    ddate : Remainder_date,
    grace : req.body.grace,
    file : file_upload
  }
  roadtax.update({"_id":id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});

// removeing roadtax
router.post('/RemoveRoadtax', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  roadtax.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})

// Roadtax expired details
router.get('/RoadtaxExpired', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    var date= moment().format('DD-MM-YYYY')
    roadtax.find({},function(err,data){
      for(i=0;i<data.length;i++){
        var id = data[i]._id
        if(date==data[i].ddate){
          roadtax.update({"_id":id},{$set:{"status":"on"}})
        }
        else if(date==data[i].valid){
          roadtax.update({"_id":id},{$set:{"status":"off"}})
        }
      }
    })
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      roadtax.find({"status":"on"}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      roadtax.find({"status":"on","branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      roadtax.find({"status":"on","branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      roadtax.find({"status":"on","branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      roadtax.find({"status":"on","branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      roadtax.find({"status":"on","branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      roadtax.find({"status":"on","branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      roadtax.find({"status":"on","branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      roadtax.find({"status":"on","branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      roadtax.find({"status":"on","branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      roadtax.find({"status":"on","branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      roadtax.find({"status":"on","branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      roadtax.find({"status":"on","branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      roadtax.find({"status":"on","branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      roadtax.find({"status":"on","branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      roadtax.find({"status":"on","branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      roadtax.find({"status":"on","branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      roadtax.find({"status":"on","branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      roadtax.find({"status":"on","branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      roadtax.find({"status":"on","branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      roadtax.find({"status":"on","branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})


router.post('/getvehicleroadtax', function(req,res){
  console.log(req.body)
  roadtax.find({"regno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})
//----------------------------------------------roadpermit Data---------------------------------------------------
// adding roadpermit
var storage = multer.diskStorage({
  destination: '../public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })
router.post('/roadpermitfiledata',upload.single('file'), function(req,res){
  console.log(req.body);
  console.log(req.file);
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    model : req.body.model,
    regno : req.body.regno,
    certificate : req.body.certificate,
    issueddate : moment(req.body.issueddate).format('DD-MM-YYYY'),
    valid : moment(req.body.valid).format('DD-MM-YYYY'),
    ddate : moment(req.body.ddate).format('DD-MM-YYYY'),
    grace : req.body.grace,
    file:req.file.filename
  }
  roadpermit.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

router.get('/getRoadpermitdata', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      roadpermit.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      roadpermit.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      roadpermit.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      roadpermit.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      roadpermit.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      roadpermit.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      roadpermit.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      roadpermit.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      roadpermit.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      roadpermit.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      roadpermit.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      roadpermit.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      roadpermit.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      roadpermit.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      roadpermit.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      roadpermit.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      roadpermit.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      roadpermit.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      roadpermit.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      roadpermit.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      roadpermit.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

//editing roadpermit
router.post('/EditRoadpermit',upload.single('file'), function(req,res){
  //console.log(req.body._id)

  var file_upload
    var issueddate 
    var Valid_date
    var Remainder_date
  if((req.file == undefined) || (req.file == "")){
     file_upload = req.body.file
  }
  else{
    file_upload = req.file.filename
  }

  if(req.body.issueddate.length <= 10){
      issueddate =  req.body.issueddate
  }
  else{
      issueddate =moment(req.body.issueddate).format('DD-MM-YYYY');
  }

  if(req.body.valid.length <= 10){
      Valid_date = req.body.valid
  }
  else{
      Valid_date = moment(req.body.valid).format('DD-MM-YYYY');
  }

  if(req.body.ddate.length <= 10){
      Remainder_date = req.body.ddate
  }
  else{
      Remainder_date = moment(req.body.ddate).format('DD-MM-YYYY');
  }

  var id = req.body._id;
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    model : req.body.model,
    regno : req.body.regno,
    certificate : req.body.certificate,
    issueddate : issueddate,
    valid : Valid_date,
    ddate : Remainder_date,
    grace : req.body.grace,
    file : file_upload
  }
  roadpermit.update({"_id":id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});

// removeing roadpermit
router.post('/RemoveRoadpermit', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  roadpermit.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})

// Road permit expired details
router.get('/RoadpermitExpired', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    var date= moment().format('DD-MM-YYYY')
    
    roadpermit.find({},function(err,data){
      for(i=0;i<data.length;i++){
      
        var id = data[i]._id
        if(date==data[i].ddate){
          roadpermit.update({"_id":id},{$set:{"status":"on"}})
        }
        else if(date==data[i].valid){
          roadpermit.update({"_id":id},{$set:{"status":"off"}})
        }
      }
    })
    
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      roadpermit.find({"status":"on"}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      roadpermit.find({"status":"on","branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      roadpermit.find({"status":"on","branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      roadpermit.find({"status":"on","branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      roadpermit.find({"status":"on","branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      roadpermit.find({"status":"on","branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      roadpermit.find({"status":"on","branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      roadpermit.find({"status":"on","branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      roadpermit.find({"status":"on","branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      roadpermit.find({"status":"on","branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      roadpermit.find({"status":"on","branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      roadpermit.find({"status":"on","branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      roadpermit.find({"status":"on","branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      roadpermit.find({"status":"on","branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      roadpermit.find({"status":"on","branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      roadpermit.find({"status":"on","branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      roadpermit.find({"status":"on","branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      roadpermit.find({"status":"on","branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      roadpermit.find({"status":"on","branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      roadpermit.find({"status":"on","branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      roadpermit.find({"status":"on","branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

router.post('/getvehicleroadpermit', function(req,res){
  console.log(req.body)
  roadpermit.find({"regno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})
//----------------------------------------------Insurance Claim Data---------------------------------------------------
// adding Insurance Claim
  var storage = multer.diskStorage({
  destination: '../public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })
router.post('/InsuranceClaimfiledata',upload.single('file'), function(req,res){
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    staffname : req.body.staffname,
    regno : req.body.regno,
    accidentdate : moment(req.body.accidentdate).format('DD-MM-YYYY'),
    date : moment(req.body.date).format('DD-MM-YYYY'),
    company : req.body.company,
    claimno : req.body.claimno,
    description : req.body.description,
    amountrequested : req.body.amountrequested,
    amountreleased : req.body.amountreleased,
    file : req.file.filename
  }
  insuranceclaim.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

router.get('/getInsuranceClaimdata', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      insuranceclaim.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      insuranceclaim.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      insuranceclaim.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      insuranceclaim.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      insuranceclaim.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      insuranceclaim.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      insuranceclaim.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      insuranceclaim.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      insuranceclaim.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      insuranceclaim.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      insuranceclaim.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      insuranceclaim.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      insuranceclaim.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      insuranceclaim.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      insuranceclaim.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      insuranceclaim.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      insuranceclaim.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      insuranceclaim.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      insuranceclaim.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      insuranceclaim.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      insuranceclaim.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

//editing Insurance Claim
router.post('/EditInsuranceClaim', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    staffname : req.body.staffname,
    regno : req.body.regno,
    accidentdate : moment(req.body.accidentdate).format('DD-MM-YYYY'),
    date : moment(req.body.date).format('DD-MM-YYYY'),
    company : req.body.company,
    claimno : req.body.claimno,
    description : req.body.description,
    amountrequested : req.body.amountrequested,
    amountreleased : req.body.amountreleased
  }
  insuranceclaim.update({"_id":id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});

// removeing Insurance Claim
router.post('/RemoveInsuranceClaim', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  insuranceclaim.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})

router.post('/getvehicleinsuranceclaim', function(req,res){
  console.log(req.body)
  insuranceclaim.find({"regno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})
//----------------------------------------------VehicleChallan Data---------------------------------------------------
// adding VehicleChallan
  var storage = multer.diskStorage({
  destination: '../public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })
router.post('/VehicleChallanfiledata',upload.single('file'), function(req,res){
  console.log(req.file);
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    staffname : req.body.staffname,
    regno : req.body.regno,
    date : moment(req.body.date).format('DD-MM-YYYY'),
    reason : req.body.reason,
    challanno : req.body.challanno,
    challanamount : req.body.challanamount,
    remarks : req.body.remarks,
    file : req.file.filename
  }
  vehiclechallan.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

router.get('/getVehicleChallandata', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      vehiclechallan.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      vehiclechallan.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      vehiclechallan.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      vehiclechallan.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      vehiclechallan.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      vehiclechallan.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      vehiclechallan.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      vehiclechallan.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      vehiclechallan.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      vehiclechallan.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      vehiclechallan.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      vehiclechallan.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      vehiclechallan.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      vehiclechallan.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      vehiclechallan.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      vehiclechallan.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      vehiclechallan.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      vehiclechallan.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      vehiclechallan.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      vehiclechallan.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      vehiclechallan.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

//editing VehicleChallan
router.post('/EditVehicleChallan', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    staffname : req.body.staffname,
    regno : req.body.regno,
    date : req.body.date,
    reason : req.body.reason,
    challanno : req.body.challanno,
    challanamount : req.body.challanamount,
    remarks : req.body.remarks,
  }
  vehiclechallan.update({"_id":id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});

// removeing VehicleChallan
router.post('/RemoveVehicleChallan', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  vehiclechallan.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})
//-----------------------------------------Vehicle Tyre ----------------------------------------------------
// adding Vehicle Tyre
router.post('/postNewvehicletyre', function(req,res){
  //console.log(req.body)
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    vehicleregno : req.body.vehicleregno,
    serviceno : req.body.serviceno,
    tyremake : req.body.tyremake,
    position : req.body.position,
    tyreno : req.body.tyreno,
    sizeoftyre:req.body.sizeoftyre,
    date : moment(req.body.date).format("DD-MM-YYYY")
  }
  vehicletyres.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});
//editing Vehicle Services
router.post('/editNewvehicletyre', function(req,res){
  //console.log(req.body._id)
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    vehicleregno : req.body.vehicleregno,
    serviceno : req.body.serviceno,
    position : req.body.position,
    tyreno : req.body.tyreno,
    sizeoftyre:req.body.sizeoftyre,
    date : moment(req.body.date).format("DD-MM-YYYY")
  }
  var id = req.body._id;
  vehicletyres.update({"_id":id},{$set:data}, function(err,docs){
    //console.log(docs);
    res.send(docs)
  })
});
// removeing
router.post('/deleteNewvehicletyre', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  vehicletyres.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})

//
router.post('/getnewvehicletyredataa', function(req,res){
  vehicletyres.find({"vehicleregno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})

// getting Vehicle Services
router.get('/getNewvehicletyre', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      vehicletyres.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      vehicletyres.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      vehicletyres.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      vehicletyres.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      vehicletyres.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      vehicletyres.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      vehicletyres.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      vehicletyres.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      vehicletyres.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      vehicletyres.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      vehicletyres.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      vehicletyres.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      vehicletyres.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      vehicletyres.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      vehicletyres.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      vehicletyres.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      vehicletyres.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      vehicletyres.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      vehicletyres.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      vehicletyres.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      vehicletyres.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})
//-----------------------------------------Replaced Vehicle Tyre ----------------------------------------------------
// adding Rep Vehicle Tyre
router.post('/postRepvehicletyre', function(req,res){
  //console.log(req.body)
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    vehicleregno : req.body.vehicleregno,
    serviceno : req.body.serviceno,
    position : req.body.position,
    tyreno : req.body.tyreno,
    sizeoftyre:req.body.sizeoftyre,
    removal : req.body.removal,
    omr : req.body.omr,
    removedate : moment(req.body.removedate).format("DD-MM-YYYY"),
    replacementdate : moment(req.body.replacementdate).format("DD-MM-YYYY"),
    reason : req.body.reason,
    remarks : req.body.remarks
  }
  replacedvehicle.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});
//editing Vehicle Rep
router.post('/editRepvehicletyre', function(req,res){
  //console.log(req.body._id)
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    vehicleregno : req.body.vehicleregno,
    serviceno : req.body.serviceno,
    position : req.body.position,
    tyreno : req.body.tyreno,
    sizeoftyre:req.body.sizeoftyre,
    removal : req.body.removal,
    omr : req.body.omr,
    removedate : moment(req.body.removedate).format("DD-MM-YYYY"),
    replacementdate : moment(req.body.replacementdate).format("DD-MM-YYYY"),
    reason : req.body.reason,
    remarks : req.body.remarks
  }
  var id = req.body._id;
  replacedvehicle.update({"_id":id},{$set:data}, function(err,docs){
    //console.log(docs);
    res.send(docs)
  })
});
// removeing
router.post('/deleteRepvehicletyre', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  replacedvehicle.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})

//
router.post('/getreplacedvehicletyredataa', function(req,res){
  replacedvehicle.find({"vehicleregno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})

// getting Vehicle Rep
router.get('/getRepvehicletyre', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      replacedvehicle.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      replacedvehicle.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      replacedvehicle.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      replacedvehicle.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      replacedvehicle.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      replacedvehicle.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      replacedvehicle.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      replacedvehicle.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      replacedvehicle.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      replacedvehicle.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      replacedvehicle.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      replacedvehicle.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      replacedvehicle.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      replacedvehicle.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      replacedvehicle.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      replacedvehicle.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      replacedvehicle.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      replacedvehicle.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      replacedvehicle.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      replacedvehicle.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      replacedvehicle.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})
//----------------------------------------Categories Data-----------------------------------------------------
// adding categories
router.post('/postcategories', function(req,res){
  console.log(req.body)
  categories.insert(req.body, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

//editing sociecty
router.post('/editcategories', function(req,res){
  console.log(req.body._id)
  var id = req.body._id;
  categories.update({"_id":id},{$set:{"name":req.body.name}}, function(err,docs){
    res.send(docs)
  })
});

// removeing
router.post('/deletecategories', function(req,res){
  console.log(req.body._id)
  var id = req.body._id;
  categories.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})
// getting categories data
router.get('/getcategories', function(req,res){
  categories.find({}, function(err,docs){
    res.send(docs)
  })
})
//----------------------------------------Sub-Categories Data-----------------------------------------------------
// adding subcategories
router.post('/postsubcategories', function(req,res){
  //console.log(req.body)
  var name = req.body.name;
  //console.log(name);
  subcategories.insert(req.body, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

//editing sociecty
router.post('/editsubcategories', function(req,res){
  console.log(req.body._id)
  var id = req.body._id;
  subcategories.update({"_id":id},{$set:req.body}, function(err,docs){
    res.send(docs)
  })
});

// removeing
router.post('/deletesubcategories', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  subcategories.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})
// getting subcategories data
router.get('/getsubcategories', function(req,res){
  subcategories.find({}, function(err,docs){
    res.send(docs)
  })
})
//----------------------------------------Sub-Items Data-----------------------------------------------------
// adding subitems
router.post('/postsubitem', function(req,res){
  //console.log(req.body)
  var name = req.body.name;
  //console.log(name);
  subitems.insert(req.body, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

//editing sociecty
router.post('/editsubitem', function(req,res){
  console.log(req.body._id)
  var id = req.body._id;
  subitems.update({"_id":id},{$set:req.body}, function(err,docs){
    res.send(docs)
  })
});

// removeing
router.post('/deletesubitem', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  subitems.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})
// getting subitems data
router.get('/getsubitem', function(req,res){
  subitems.find({}, function(err,docs){
    res.send(docs)
  })
})
//----------------------------------------Dailyvehicle Data-----------------------------------------------------
// adding dailyvehicle
router.post('/DailyvehicleData', function(req,res){
  //console.log(req.body)
  var data = {
  society : req.body.society,
  branch : req.body.branch,
  model : req.body.model,
  regno : req.body.regno,
  waterservice : req.body.waterservice,
  engineoil : req.body.engineoil,
  chasis : req.body.chasis,
  springs : req.body.springs,
  centerjoints : req.body.centerjoints,
  ubolts : req.body.ubolts,
  airfillings : req.body.airfillings,
  greesing : req.body.greesing,
  battery : req.body.battery,
  lights : req.body.lights,
  glasses : req.body.glasses,
  bodypaint : req.body.bodypaint,
  seats : req.body.seats,
  gearoil : req.body.gearoil,
  difoil : req.body.difoil,
  breakoil : req.body.breakoil,
  atfoil : req.body.atfoil,
  radiator : req.body.radiator,
  meter : req.body.meter,
  date : moment(req.body.date).format("DD-MM-YYYY"),
  remarks : req.body.remarks
  }
  dailyvehicle.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

//editing 
router.post('/EditDailyvehicle', function(req,res){
  console.log(req.body._id)
  var id = req.body._id;
  var data = {
  society : req.body.society,
  branch : req.body.branch,
  model : req.body.model,
  regno : req.body.regno,
  waterservice : req.body.waterservice,
  engineoil : req.body.engineoil,
  chasis : req.body.chasis,
  springs : req.body.springs,
  centerjoints : req.body.centerjoints,
  ubolts : req.body.ubolts,
  airfillings : req.body.airfillings,
  greesing : req.body.greesing,
  battery : req.body.battery,
  lights : req.body.lights,
  glasses : req.body.glasses,
  bodypaint : req.body.bodypaint,
  seats : req.body.seats,
  gearoil : req.body.gearoil,
  difoil : req.body.difoil,
  breakoil : req.body.breakoil,
  atfoil : req.body.atfoil,
  radiator : req.body.radiator,
  meter : req.body.meter,
  date : req.body.date,
  remarks : req.body.remarks
  }
  dailyvehicle.update({"_id":id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});

// removeing
router.post('/RemoveDailyvehicle', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  dailyvehicle.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})


// getting dailyvehicle data
router.post('/getDailyvehicledata', function(req,res){
  console.log(req.body.val);
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      dailyvehicle.find({"regno":req.body.val}, function(err,docs){
        res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      dailyvehicle.find({"regno":req.body.val,"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      dailyvehicle.find({"regno":req.body.val,"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      dailyvehicle.find({"regno":req.body.val,"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      dailyvehicle.find({"regno":req.body.val,"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      dailyvehicle.find({"regno":req.body.val,"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      dailyvehicle.find({"regno":req.body.val,"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      dailyvehicle.find({"regno":req.body.val,"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      dailyvehicle.find({"regno":req.body.val,"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      dailyvehicle.find({"regno":req.body.val,"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      dailyvehicle.find({"regno":req.body.val,"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      dailyvehicle.find({"regno":req.body.val,"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      dailyvehicle.find({"regno":req.body.val,"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      dailyvehicle.find({"regno":req.body.val,"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      dailyvehicle.find({"regno":req.body.val,"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      dailyvehicle.find({"regno":req.body.val,"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      dailyvehicle.find({"regno":req.body.val,"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      dailyvehicle.find({"regno":req.body.val,"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      dailyvehicle.find({"regno":req.body.val,"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      dailyvehicle.find({"regno":req.body.val,"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      dailyvehicle.find({"regno":req.body.val,"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})




// getting dailyvehicle data
router.get('/getDailyvehicle', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      dailyvehicle.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      dailyvehicle.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      dailyvehicle.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      dailyvehicle.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      dailyvehicle.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      dailyvehicle.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      dailyvehicle.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      dailyvehicle.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      dailyvehicle.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      dailyvehicle.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      dailyvehicle.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      dailyvehicle.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      dailyvehicle.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      dailyvehicle.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      dailyvehicle.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      dailyvehicle.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      dailyvehicle.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      dailyvehicle.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      dailyvehicle.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      dailyvehicle.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      dailyvehicle.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

router.post('/getvehiclemaintenance', function(req,res){
  console.log(req.body)
  dailyvehicle.find({"regno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})
//----------------------------------------Vehicle Repair Data-----------------------------------------------------
// adding vehiclerepair
router.post('/VehiclerepairData', function(req,res){
  console.log(req.body)
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    model : req.body.model,
    regno : req.body.regno,
    route : req.body.route,
    staffname : req.body.staffname,
    date : moment(req.body.date).format("DD-MM-YYYY"),
    description : req.body.description,
    intime : moment(req.body.intime).format("hh:mm"),
    outtime : moment(req.body.outtime).format("hh:mm"),
    reading : req.body.reading,
    amount: req.body.amount,
    remarks : req.body.remarks
  }
  //console.log(name);
  vehiclerepair.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

//editing sociecty
router.post('/EditVehiclerepair', function(req,res){
  console.log(req.body._id)
  var id = req.body._id;
   var data = {
    society : req.body.society,
    branch : req.body.branch,
    model : req.body.model,
    regno : req.body.regno,
    route : req.body.route,
    staffname : req.body.staffname,
    date : moment(req.body.date).format("DD-MM-YYYY"),
    description : req.body.description,
    intime : req.body.intime,
    outtime : req.body.outtime,
    reading : req.body.reading,
    amount: req.body.amount,
    remarks : req.body.remarks
  }
  vehiclerepair.update({"_id":id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});

// removeing
router.post('/RemoveVehiclerepair', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  vehiclerepair.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})
// getting vehiclerepair data
router.get('/getVehiclerepair', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      vehiclerepair.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      vehiclerepair.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      vehiclerepair.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      vehiclerepair.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      vehiclerepair.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      vehiclerepair.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      vehiclerepair.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      vehiclerepair.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      vehiclerepair.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      vehiclerepair.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      vehiclerepair.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      vehiclerepair.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      vehiclerepair.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      vehiclerepair.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      vehiclerepair.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      vehiclerepair.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      vehiclerepair.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      vehiclerepair.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      vehiclerepair.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      vehiclerepair.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      vehiclerepair.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})



// new getting vehiclerepair data
router.post('/getVehiclerepair1', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      vehiclerepair.find({"regno":req.body.val}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      vehiclerepair.find({"regno":req.body.val,"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      vehiclerepair.find({"regno":req.body.val,"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      vehiclerepair.find({"regno":req.body.val,"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      vehiclerepair.find({"regno":req.body.val,"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      vehiclerepair.find({"regno":req.body.val,"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      vehiclerepair.find({"regno":req.body.val,"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      vehiclerepair.find({"regno":req.body.val,"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      vehiclerepair.find({"regno":req.body.val,"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      vehiclerepair.find({"regno":req.body.val,"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      vehiclerepair.find({"regno":req.body.val,"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      vehiclerepair.find({"regno":req.body.val,"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      vehiclerepair.find({"regno":req.body.val,"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      vehiclerepair.find({"regno":req.body.val,"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      vehiclerepair.find({"regno":req.body.val,"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      vehiclerepair.find({"regno":req.body.val,"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      vehiclerepair.find({"regno":req.body.val,"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      vehiclerepair.find({"regno":req.body.val,"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      vehiclerepair.find({"regno":req.body.val,"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      vehiclerepair.find({"regno":req.body.val,"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      vehiclerepair.find({"regno":req.body.val,"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

router.post('/getvehiclerepairdata', function(req,res){
  console.log(req.body)
  vehiclerepair.find({"regno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})

//----------------------------------------VCR Data-----------------------------------------------------
// adding vcr
router.post('/vcrData', function(req,res){
  //console.log(req.body)
  var data = {
    society : req.body.society,
    branch : req.body.branch,
    vehicleregno : req.body.vehicleregno,
    staffname : req.body.staffname,
    condition : req.body.condition,
    handover : req.body.handover,
    cmr : req.body.cmr,
    remarks : req.body.remarks,
    stage : req.body.stage,
    handoverroute : req.body.handoverroute,
    type : req.body.type,
    date : moment(req.body.date).format("DD-MM-YYYY")
  }
  //console.log(name);
  vcr.insert(data, function(err,docs){
    //console.log(docs);
    res.send(docs);
  });
});

//editing sociecty
router.post('/Editvcr', function(req,res){
  console.log(req.body._id)
  var id = req.body._id;
   var data = {
    society : req.body.society,
    branch : req.body.branch,
    vehicleregno : req.body.vehicleregno,
    staffname : req.body.staffname,
    condition : req.body.condition,
    handover : req.body.handover,
    cmr : req.body.cmr,
    remarks : req.body.remarks,
    stage : req.body.stage,
    handoverroute : req.body.handoverroute,
    type : req.body.type,
    date : moment(req.body.date).format("DD-MM-YYYY")
  }
  vcr.update({"_id":id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});

// removeing
router.post('/Removevcr', function(req,res){
  //console.log(req.body._id)
  var id = req.body._id;
  vcr.remove({"_id":id}, function(err,docs){
    res.send(docs)
  })
})
// getting vcr data
router.get('/getvcrdata', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    //console.log(req.session.user.branch)
    if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
      vcr.find({}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      vcr.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      vcr.find({"branch":/AMALAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      vcr.find({"branch":/BHIMAVARAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      vcr.find({"branch":/ELURU/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      vcr.find({"branch":/MAMIDADA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      vcr.find({"branch":/GAJUWAKA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      vcr.find({"branch":/LAKSHYA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      vcr.find({"branch":/MANDAPETA/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      vcr.find({"branch":/NARASAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      vcr.find({"branch":/PALAKOL/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      vcr.find({"branch":/PITHAPURAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      vcr.find({"branch":/RJY DEGREE/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      vcr.find({"branch":/SRIKAKULAM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      vcr.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      vcr.find({"branch":/TUNI/}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      vcr.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      vcr.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      vcr.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      vcr.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      vcr.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})

//-------------------------------------Vehicle Wise Battery Tab--------------------------------------
router.post('/vehiclewisebattery', function(req,res){
  var data = {
    society: req.body.society,
    branch: req.body.branch,
    vehicleregno: req.body.regno,
    battery_make: req.body.battery_make,
    battery_capacity: req.body.battery_capacity,
    battery_number: req.body.battery_number,
    fitment_date: moment(req.body.fitment_date).format("DD-MM-YYYY"),
    warranty: req.body.warranty,
    expired_date: moment(req.body.expired_date).format("DD-MM-YYYY"),
    status: req.body.status,
    remarks: req.body.remarks
  }
  vehiclewisebattery.insert(data, function(err,docs){
    res.send(docs)
  })
});

router.post('/updatingVehiclewisebattery', function(req,res){

  if(req.body.fitment_date == undefined){
    var fitment_date = req.body.fitment_date;
  }
  else{
    var fitment_date = moment(req.body.fitment_date).format("DD-MM-YYYY");
  }

  if(req.body.expired_date == undefined){
    var expired_date = req.body.expired_date
  }
  else{
    var expired_date = moment(req.body.expired_date).format("DD-MM-YYYY");
  }

  var data = {
    society: req.body.society,
    branch: req.body.branch,
    vehicleregno: req.body.vehicleregno,
    battery_make: req.body.battery_make,
    battery_capacity: req.body.battery_capacity,
    battery_number: req.body.battery_number,
    fitment_date: fitment_date,
    warranty: req.body.warranty,
    expired_date: expired_date,
    status: req.body.status,
    remarks: req.body.remarks
  }
  vehiclewisebattery.update({"_id":req.body._id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});


router.post('/deleteVehiclewisedata', function(req,res){
  vehiclewisebattery.remove({"_id":req.body._id}, function(err,docs){
    res.send(docs)
  })
})

// router.post('/gettingvehiclebranchdetails', function(req,res){
//   // console.log(req.body)
//   branchvehicle.findOne({"vehicleregno":req.body.value}, function(err,docs){
//     res.send(docs)
//   })
// })

router.post('/gettingvehiclebranchdetails', function(req,res){
  // console.log(req.body)
  
  var dates = moment().format("YYYY-MM-DD")
  

    busfill.findOne(
      {"date":{$lte: dates},"regno":req.body.value},
      { sort: { date: -1 }},
      (err1, data) => {
        console.log(data)
        branchvehicle.findOne({"vehicleregno":req.body.value}, function(err,docs){
          //console.log(docs1)
          docs.omr =data.cmr;
          res.send(docs);
         //  console.log(docs);
       })
    },
  )

})


router.post('/getvehiclewisebatterydataa', function(req,res){
  // console.log(req.body)
  vehiclewisebattery.find({"vehicleregno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})


router.get('/getVehiclewisedata', function(req,res){
 if(req.session && req.session.user){
  res.locals.user = req.session.user;
  //console.log(req.session.user.branch)
  if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
    vehiclewisebattery.find({}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcjkpur') {
    vehiclewisebattery.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcamp') {
    vehiclewisebattery.find({"branch":/AMALAPURAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcbvrm') {
    vehiclewisebattery.find({"branch":/BHIMAVARAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adceluru') {
    vehiclewisebattery.find({"branch":/ELURU/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcgmd') {
    vehiclewisebattery.find({"branch":/MAMIDADA/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcgwk') {
    vehiclewisebattery.find({"branch":/GAJUWAKA/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adclakshya') {
    vehiclewisebattery.find({"branch":/LAKSHYA/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcmdp') {
    vehiclewisebattery.find({"branch":/MANDAPETA/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcnsp') {
    vehiclewisebattery.find({"branch":/NARASAPURAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcpkl') {
    vehiclewisebattery.find({"branch":/PALAKOL/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcptp') {
    vehiclewisebattery.find({"branch":/PITHAPURAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcrjyd') {
    vehiclewisebattery.find({"branch":/RJY DEGREE/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcsklm') {
    vehiclewisebattery.find({"branch":/SRIKAKULAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adctpg') {
    vehiclewisebattery.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adctuni') {
    vehiclewisebattery.find({"branch":/TUNI/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcengg') {
    vehiclewisebattery.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adckkd') {
    vehiclewisebattery.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='srikkd') {
    vehiclewisebattery.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='ajckkd') {
    vehiclewisebattery.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcpdp') {
    vehiclewisebattery.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
    res.send(docs)
    });
  }
}
})

//-------------------------------------Battery Change Report Tab--------------------------------------
router.post('/postbatterychange', function(req,res){
  var data = {
    society: req.body.society,
    branch: req.body.branch,
    batterymake: req.body.batterymake,
    batterycapacity: req.body.batterycapacity,
    batterynumber: req.body.batterynumber,
    fromregno: req.body.fromregno,
    toregno: req.body.toregno,
    initialfitmentdate: moment(req.body.initialfitmentdate).format("DD-MM-YYYY"),
    presentfitmentdate: moment(req.body.presentfitmentdate).format("DD-MM-YYYY"),
    remarks: req.body.remarks
  }
  batterychangereport.insert(data, function(err,docs){
    res.send(docs)
  })
});

router.post('/updatingBatterychangedata', function(req,res){
  if(req.body.initialfitmentdate == undefined){
    var initialfitmentdate = req.body.initialfitmentdate;
  }
  else{
    var initialfitmentdate = moment(req.body.initialfitmentdate).format("DD-MM-YYYY");
  }

  if(req.body.presentfitmentdate == undefined){
    var presentfitmentdate = req.body.presentfitmentdate
  }
  else{
    var presentfitmentdate = moment(req.body.presentfitmentdate).format("DD-MM-YYYY");
  }


  var data = {
    society: req.body.society,
    branch: req.body.branch,
    batterymake: req.body.batterymake,
    batterycapacity: req.body.batterycapacity,
    batterynumber: req.body.batterynumber,
    fromregno: req.body.fromregno,
    toregno: req.body.toregno,
    initialfitmentdate: initialfitmentdate,
    presentfitmentdate: presentfitmentdate,
    remarks: req.body.remarks
  }
  batterychangereport.update({"_id":req.body._id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});


router.post('/deleteBatterychangedata', function(req,res){
  batterychangereport.remove({"_id":req.body._id}, function(err,docs){
    res.send(docs)
  })
})


router.post('/getbatterychangereportdataa', function(req,res){
  batterychangereport.find({$or:[{fromregno:req.body.val}, {toregno:req.body.val}]}, function(err,docs){
    res.send(docs)
  })
})


router.get('/getbatterychangedata', function(req,res){
  if(req.session && req.session.user){
  res.locals.user = req.session.user;
  //console.log(req.session.user.branch)
  if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
    batterychangereport.find({}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcjkpur') {
    batterychangereport.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcamp') {
    batterychangereport.find({"branch":/AMALAPURAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcbvrm') {
    batterychangereport.find({"branch":/BHIMAVARAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adceluru') {
    batterychangereport.find({"branch":/ELURU/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcgmd') {
    batterychangereport.find({"branch":/MAMIDADA/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcgwk') {
    batterychangereport.find({"branch":/GAJUWAKA/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adclakshya') {
    batterychangereport.find({"branch":/LAKSHYA/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcmdp') {
    batterychangereport.find({"branch":/MANDAPETA/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcnsp') {
    batterychangereport.find({"branch":/NARASAPURAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcpkl') {
    batterychangereport.find({"branch":/PALAKOL/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcptp') {
    batterychangereport.find({"branch":/PITHAPURAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcrjyd') {
    batterychangereport.find({"branch":/RJY DEGREE/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcsklm') {
    batterychangereport.find({"branch":/SRIKAKULAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adctpg') {
    batterychangereport.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adctuni') {
    batterychangereport.find({"branch":/TUNI/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcengg') {
    batterychangereport.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adckkd') {
    batterychangereport.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='srikkd') {
    batterychangereport.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='ajckkd') {
      batterychangereport.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
  }
  else if (req.session.user.username=='adcpdp') {
    batterychangereport.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
    res.send(docs)
    });
  }
}
})


//-------------------------------------Tyre Status Tab--------------------------------------
router.post('/posttyrestatus', function(req,res){
  var data = {
    society: req.body.society,
    branch: req.body.branch,
    vehicleregno: req.body.vehicleregno,
    position: req.body.position,
    tyreno: req.body.tyreno,
    sizeoftyre: req.body.sizeoftyre,
    warrantydistance: req.body.warrantydistance,
    status: req.body.status,
    condemndistance: req.body.condemndistance,
    remarks: req.body.remarks
  }
  tyrestatus.insert(data, function(err,docs){
    res.send(docs)
  })
});

router.post('/updatingTyrestatusdata', function(req,res){
  var data = {
    society: req.body.society,
    branch: req.body.branch,
    vehicleregno: req.body.vehicleregno,
    position: req.body.position,
    tyreno: req.body.tyreno,
    sizeoftyre: req.body.sizeoftyre,
    warrantydistance: req.body.warrantydistance,
    status: req.body.status,
    condemndistance: req.body.condemndistance,
    remarks: req.body.remarks
  }
  tyrestatus.update({"_id":req.body._id},{$set:data}, function(err,docs){
    res.send(docs)
  })
});


router.post('/deleteTyrestatusdata', function(req,res){
  tyrestatus.remove({"_id":req.body._id}, function(err,docs){
    res.send(docs)
  })
})


router.get('/getTyrestatusdata', function(req,res){
  if(req.session && req.session.user){
  res.locals.user = req.session.user;
  //console.log(req.session.user.branch)
  if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
    tyrestatus.find({}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcjkpur') {
    tyrestatus.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcamp') {
    tyrestatus.find({"branch":/AMALAPURAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcbvrm') {
    tyrestatus.find({"branch":/BHIMAVARAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adceluru') {
    tyrestatus.find({"branch":/ELURU/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcgmd') {
    tyrestatus.find({"branch":/MAMIDADA/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcgwk') {
    tyrestatus.find({"branch":/GAJUWAKA/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adclakshya') {
    tyrestatus.find({"branch":/LAKSHYA/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcmdp') {
    tyrestatus.find({"branch":/MANDAPETA/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcnsp') {
    tyrestatus.find({"branch":/NARASAPURAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcpkl') {
    tyrestatus.find({"branch":/PALAKOL/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcptp') {
    tyrestatus.find({"branch":/PITHAPURAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcrjyd') {
    tyrestatus.find({"branch":/RJY DEGREE/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcsklm') {
    tyrestatus.find({"branch":/SRIKAKULAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adctpg') {
    tyrestatus.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adctuni') {
    tyrestatus.find({"branch":/TUNI/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcengg') {
    tyrestatus.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adckkd') {
    tyrestatus.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='srikkd') {
    tyrestatus.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='ajckkd') {
      tyrestatus.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
  }
  else if (req.session.user.username=='adcpdp') {
    tyrestatus.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
    res.send(docs)
    });
  }
}
})



//-- Bus Breake Down data ----------------------------------------------------------------------
router.post('/postbusbreakdown', function(req,res){
  if(req.body.spare_part == undefined){
    var spare_part = ''
  }
  else{
    var spare_part = req.body.spare_part
  }

  if(req.body.spare_part_amount == undefined){
    var spare_part_amount = 0
  }
  else{
    var spare_part_amount = req.body.spare_part_amount
  }

  var data = {
    "society":req.body.society,
    "branch":req.body.branch,
    "busno":req.body.regno,
    "breakedownplace":req.body.breakedownplace,
    "complaint":req.body.complaint,
    "drivername":req.body.drivername,
    "driverphoneno":req.body.driverphoneno,
    "food_allowance":Number(req.body.food_allowance),
    "message_received_time":req.body.message_received_time,
    "spare_part":spare_part,
    "spare_part_amount":Number(spare_part_amount),
    "status":req.body.status,
    "travel_allowance":Number(req.body.travel_allowance),
    "work_assign_time":req.body.work_assign_time,
    "work_complete_time":req.body.work_complete_time,
    "workers":req.body.workers,
    "date":moment(req.body.date).format("DD-MM-YYYY"),
    "timestamp":gettimestamp(moment(req.body.date).format("DD-MM-YYYY"),moment().format("HH:MM")),
    "totalamount":Number(req.body.food_allowance) + Number(spare_part_amount) + Number(req.body.travel_allowance),
  }
  busbreakdown.insert(data,function(err,docs){
    if(docs){
      res.send(docs)
    }
    else{
      res.send(err)
    }
  })
})


router.get('/getBusbreakedowndata', function(req,res){
  if(req.session && req.session.user){
  res.locals.user = req.session.user;
  //console.log(req.session.user.branch)
  if (req.session.user.username=='vms' || req.session.user.username=='vmskkd' || req.session.user.username=='vc') {
    busbreakdown.find({}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcjkpur') {
    busbreakdown.find({"branch":/JAGANNAICKPUR/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcamp') {
    busbreakdown.find({"branch":/AMALAPURAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcbvrm') {
    busbreakdown.find({"branch":/BHIMAVARAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adceluru') {
    busbreakdown.find({"branch":/ELURU/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcgmd') {
    busbreakdown.find({"branch":/MAMIDADA/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcgwk') {
    busbreakdown.find({"branch":/GAJUWAKA/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adclakshya') {
    busbreakdown.find({"branch":/LAKSHYA/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcmdp') {
    busbreakdown.find({"branch":/MANDAPETA/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcnsp') {
    busbreakdown.find({"branch":/NARASAPURAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcpkl') {
    busbreakdown.find({"branch":/PALAKOL/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcptp') {
    busbreakdown.find({"branch":/PITHAPURAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcrjyd') {
    busbreakdown.find({"branch":/RJY DEGREE/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcsklm') {
    busbreakdown.find({"branch":/SRIKAKULAM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adctpg') {
    busbreakdown.find({"branch":/TADEPALLIGUDEM/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adctuni') {
    busbreakdown.find({"branch":/TUNI/}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adcengg') {
    busbreakdown.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}}, function(err,docs){
    res.send(docs)
    });
  }
  else if (req.session.user.username=='adckkd') {
      busbreakdown.find({"branch":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      busbreakdown.find({"branch":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      busbreakdown.find({"branch":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      busbreakdown.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
}
})


router.post('/deleteBusbreakeData', function(req,res){
  busbreakdown.remove({"_id":req.body._id}, function(err,docs){
    res.send(docs)
  })
})


router.post('/getbusbreakereportdates', function(req,res){
  if(req.session && req.session.user){
    var fdate = moment(req.body.fromdate).format("DD-MM-YYYY")
  var temp="00:00";
  var ftime =gettimestamp(fdate,temp)
  var tdate = moment(req.body.todate).format("DD-MM-YYYY")
  var temp="23:59";
  var ttime =gettimestamp(tdate,temp)

  // vehicletripdata.find({"Timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
  //   if(docs){
  //     // console.log(docs)
  //     res.send(docs)
  //   }
  // })
  if(req.session.user.username=='vms') {
      busbreakdown.find({"timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      console.log(docs)
      res.send(docs)
      });
    }
    else if (req.session.user.username=='vc') {
      busbreakdown.find({"timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      // console.log(docs)
      res.send(docs)
      });
    }
    else if (req.session.user.username=='vmskkd') {
      busbreakdown.find({"timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      // console.log(docs)
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcjkpur') {
      busbreakdown.find({"branch":/JAGANNAICKPUR/, "timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcamp') {
      busbreakdown.find({"branch":/AMALAPURAM/, "timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcbvrm') {
      busbreakdown.find({"branch":/BHIMAVARAM/, "timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adceluru') {
      busbreakdown.find({"branch":/ELURU/, "timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgmd') {
      busbreakdown.find({"branch":/MAMIDADA/, "timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcgwk') {
      busbreakdown.find({"branch":/GAJUWAKA/, "timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adclakshya') {
      busbreakdown.find({"branch":/LAKSHYA/, "timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcmdp') {
      busbreakdown.find({"branch":/MANDAPETA/, "timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcnsp') {
      busbreakdown.find({"branch":{$in:["AJCNSP",/NARASAPURAM/]}, "timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
        console.log(docs)
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpkl') {
      busbreakdown.find({"branch":/PALAKOL/, "timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcptp') {
      busbreakdown.find({"branch":/PITHAPURAM/, "timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcrjyd') {
      busbreakdown.find({"branch":/RJY DEGREE/, "timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcsklm') {
      busbreakdown.find({"branch":/SRIKAKULAM/, "timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctpg') {
      busbreakdown.find({"branch":/TADEPALLIGUDEM/, "timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adctuni') {
      busbreakdown.find({"branch":/TUNI/, "timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcengg') {
      busbreakdown.find({"branch":{$in:["KKD ENGINEERING-AA","KKD ENGINEERING-SES","NON LOCAL ENGINEERING-AA","NON LOCAL ENGINEERING-SES","RJY ENGINEERING-AA","RJY ENGINEERING-SES","MANDAPETA ENGINEERING-AA","MANDAPETA ENGINEERING-SES"]}, "timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adckkd') {
      busbreakdown.find({"adckkd":{$in:["KKD DEGREE-AA","KKD DEGREE-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='srikkd') {
      busbreakdown.find({"adckkd":{$in:["ADITYA PUBLIC SCHOOL (SRI NAGAR)-AA","ADITYA PUBLIC SCHOOL (SRI NAGAR)-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='ajckkd') {
      busbreakdown.find({"adckkd":{$in:["KKD IIT-AA","KKD IIT-SES","KKD INTER-AA","KKD INTER-SES"]}}, function(err,docs){
      res.send(docs)
      });
    }
    else if (req.session.user.username=='adcpdp') {
      busbreakdown.find({"branch":{$in:["PEDDAPURAM-AA","PEDDAPURAM-SES"]}, "timestamp":{$gte:ftime,$lte:ttime}}, function(err,docs){
      res.send(docs)
      });
    }
 }   
})

router.post('/getvehiclebusbreakereport', function(req,res){
  busbreakdown.find({"busno":req.body.val}, function(err,docs){
    res.send(docs)
  })
})

//-------------------------------------upload vehicle trip--------------------------------------
var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, '../public/uploads/')
  },
  filename: function (req, file, cb) {
      //var datetimestamp = Date.now();
      cb(null, file.originalname)
  }
});
var upload = multer({ //multer settings
  storage: storage,
  fileFilter : function(req, file, callback) { //file filter
      if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
          return callback(new Error('Wrong extension type'));
      }
      callback(null, true);
  }
}).single('file');
router.post('/uploadxls',upload, function(req, res) {
  console.log(req.file);
  var exceltojson;
  upload(req,res,function(err){
      if(err){
           res.json({error_code:1,err_desc:err});
           return;
      }
      /** Multer gives us file info in req.file object */
      if(!req.file){
          res.json({error_code:1,err_desc:"No file passed"});
          return;
      }
      /** Check the extension of the incoming file and 
       *  use the appropriate module
       */
      if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
          exceltojson = xlsxtojson;
      } else {
          exceltojson = xlstojson;
      }
      console.log(req.file.path);
      try {
          exceltojson({
              input: req.file.path,
              output: "out.json", //since we don't need output.json
              lowerCaseHeaders:false
          }, function(err,result){
              if(err) {
                  return res.send('error in importing data');
              } 
              // console.log(result);
              saveData(result);
              res.redirect("/home");
      });
      } catch (e){
          res.send("Corupted excel file");
      } 
  });
});
function saveData(data) {
  console.log(data.length)
 var date = moment().format('DD-MM-YYYY');
   var temp=moment().format('HH:mm');
for(var i=0;i<data.length;i++){
    var a = parseInt(data[i].omr);
  var b = parseInt(data[i].cmr);
  
  var dated = moment(data[i].date).format('DD-MM-YYYY')
  var dated2 = moment(data[i].date).format('YYYY-MM-DD')
  // console.log(dated)
  var timestamp =gettimestamp(dated,temp)
  var kms = b-a;
  var c = data[i].distance;
  if(kms>c){
    result="exceed" + (kms-c);
  }
  else{
    result="";
  }
if(data[i].omr=="" && data[i].cmr=="" &&  data[i].strength=="" && data[i].students=="" && (data[i].kms=="" || data[i].kms=="0")){
   console.log("working")
}
else if(data[i].omr==undefined && data[i].cmr==undefined && data[i].strength==undefined && data[i].students==undefined && data[i].kms==undefined){
  console.log("testing")
}
else{
  vehicletripdata.insert({"strength":data[i].strength,"society":data[i].society,"branch":data[i].branch,"regno":data[i].regno,"routename":data[i].routename,"date":dated,"capacity":data[i].capacity,"students":data[i].students,"omr":data[i].omr,"cmr":data[i].cmr,"result":result,"kms":kms,"distance":data[i].distance,"remarks":data[i].remarks,"Timestamp":timestamp,"uploaddate":date},  function(err, data2 ) { 
    console.log(data2.regno)
    vehicleservice.update({"vehicleregno":data2.regno},{$set:{"presentreading":b}},{multi:true})

    // Sql data
    // connection.query('INSERT INTO `vehicletripdata` SET `_id`="'+data2._id+'", `Timestamp`="'+timestamp+'", `branch`="'+req.body.branch+'", `capacity`="'+req.body.capacity+'", `cmr`="'+req.body.cmr+'", `date`="'+dated2+'", `distance`="'+req.body.distance+'", `kms`="'+req.body.kms+'", `omr`="'+req.body.omr+'", `regno`="'+req.body.regno+'", `remarks`="'+req.body.remarks+'", `result`="'+req.body.result+'", `routename`="'+req.body.routename+'", `society`="'+req.body.society+'", `strength`="'+req.body.strength+'", `students`="'+req.body.students+'", `uploaddate`="'+req.body.uploaddate+'"', function (error, results, fields) {
    // if (error) throw error;
    // // connected!
    // });

    // vehicleservice.find({"vehicleregno":data2.regno}, function(err,docs){
    //   if(docs){
    //     console.log(docs)
    //     for(i=0;i<docs.length;i++){
    //       var kms1 =  parseInt(docs[i].presentreading) 
    //       var updatekms = kms1 + kms
    //       var kms2 = docs[i].kms
    //       var updatekms2 = kms2 + kms
    //       vehicleservice.update({"_id":docs[i]._id,"vehicleregno":docs[i].vehicleregno,"serviceparts":docs[i].serviceparts},{$set:{"presentreading":updatekms,"kms":updatekms2}})

    //     }
    //   }
    // })
    if(err){
     console.log(err); 
    }
  });
}
}
}


busfill.find({},function(err,docs){
  // console.log(docs.length)
  for(var i=0;i<docs.length;i++){
    // console.log(docs[i]._id)
    var dated = moment(docs[i].Timestamp).format('YYYY-MM-DD')
    busfill.update({"_id":docs[i]._id},{$set:{date:dated}})
  }
})


module.exports = router;
