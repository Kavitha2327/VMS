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



function First_Job() {
  vehicletripdata.find({}, function(err, docs) {
    if (err) {
      console.error("Error:", err);
      return;
    }

    if (!docs || (docs.length === undefined || docs.length === 0)) {
      console.log("No data found");
    } else {
      for (let i = 0; i < docs.length; i++) {
        let cmr = docs[i].cmr;
        let data = {
          "society": docs[i].society,
          "branch": docs[i].branch,
          "vehicleregno": docs[i].regno,
          'presentreading': docs[i].cmr
        };

        let date = moment().format('DD-MM-YYYY');

        if (docs[i].uploaddate === date) {
          vehicleservice.update(
            {"vehicleregno": docs[i].regno},
            {$set: {"presentreading": cmr}},
            {multi: true},
            function(err2, docs2) {
              if (err2) {
                console.error("Error updating:", err2);
              }
              // Handle the updated documents if needed
            }
          );
        }
      }
    }
  });
}




// function First_Job() {
//   vehicletripdata.find({}, function(err,docs){
//     if(docs.length==undefined || docs.length==0){
//       console.log("dd")
//     }
//     else{

//       for(i=0;i<docs.length;i++){
//         //  console.log(docs[i])
//         var cmr=docs[i].cmr
//         var data={
//           "society":docs[i].society,
//           "branch":docs[i].branch,
//           "vehicleregno":docs[i].regno,
//           'presentreading':docs[i].cmr
//         }
//         var date = moment().format('DD-MM-YYYY');
//         //  console.log(date)
//         if(docs[i].uploaddate==date){
//           //  console.log(data)
//           //  console.log(cmr)
          
//             vehicleservice.update({"vehicleregno":docs[i].regno}, {$set:{"presentreading":cmr}},{multi:true}, function (err2, docs2) {
//               //  console.log(docs2)
//             })
//           }
//   }
//     }
//   // res.send(docs)
//   });
// }

function Rta() {
  branchvehicle.find({}, function(err,docs){
    if (err) {
      console.error("Error:", err);
      return;
    }

      var lengths1= docs.length
      if(lengths1===undefined){
      console.log("No data found");

        // lengths1=0
      } 
      else{

        for(i=0;i<lengths1;i++){
          //  console.log(docs[i])
          var branch=docs[i].branch
            //  console.log(data)
            //  console.log(cmr)
            
              rta.update({"regno":docs[i].vehicleregno}, {$set:{"branch":branch}}, function (err2, docs2) {
                //  console.log(docs2)
              })
            }
      }  
  }); 
}
function Pollution() {
  branchvehicle.find({}, function(err,docs){
    if (err) {
      console.error("Error:", err);
      return;
    }
    
    var lengths= docs.length
    if(lengths===undefined){
      console.log("No data found");
    }else{

      for(i=0;i<lengths;i++){
        //  console.log(docs[i])
        var branch=docs[i].branch
          //  console.log(data)
          //  console.log(cmr)
          
          pollution.update({"regno":docs[i].vehicleregno}, {$set:{"branch":branch}}, function (err2, docs2) {
              //  console.log(docs2)
            })
          }
    }
  }); 
}

function Fitness() {
  branchvehicle.find({}, function(err,docs){
    if (err) {
      console.error("Error:", err);
      return;
    }

    var lengths1= docs?.length
    if(lengths1==undefined){
      console.log("No data found");

    }else{

      for(i=0;i<lengths1;i++){
        //  console.log(docs[i])
        var branch=docs[i].branch
          //  console.log(data)
          //  console.log(cmr)
          
          fitness.update({"regno":docs[i].vehicleregno}, {$set:{"branch":branch}}, function (err2, docs2) {
              //  console.log(docs2)
            })
          }
    }
  }); 
}

function Vehiclechallan() {
  branchvehicle.find({}, function(err,docs){
    if (err) {
      console.error("Error:", err);
      return;
    }
    var lengths3= docs.length
    if(lengths3==undefined){
      console.log("No data found");
    }
   else{

     for(i=0;i<lengths3;i++){
       //  console.log(docs[i])
       var branch=docs[i].branch
         //  console.log(data)
         //  console.log(cmr)
         
         vehiclechallan.update({"regno":docs[i].vehicleregno}, {$set:{"branch":branch}}, function (err2, docs2) {
             //  console.log(docs2)
           })
         }
   }     
  }); 
}
function Insuranceclaim() {
  branchvehicle.find({}, function(err,docs){
    if (err) {
      console.error("Error:", err);
      return;
    }
    var lengths4= docs.length
    if(lengths4==undefined){
      console.log("No data found");
    }
    else{

      for(i=0;i<lengths4;i++){
        //  console.log(docs[i])
        var branch=docs[i].branch
          //  console.log(data)
          //  console.log(cmr)
          
          insuranceclaim.update({"regno":docs[i].vehicleregno}, {$set:{"branch":branch}}, function (err2, docs2) {
              //  console.log(docs2)
            })
          }
    }
  }); 
}
function Roadtax() {
  branchvehicle.find({}, function(err,docs){
    if (err) {
      console.error("Error:", err);
      return;
    }    
    var lengths6= docs.length
    if(lengths6==undefined){
      console.log("No data found");
    }else{

      for(i=0;i<lengths6;i++){
        //  console.log(docs[i])
        var branch=docs[i].branch
          //  console.log(data)
          //  console.log(cmr)
          
          roadtax.update({"regno":docs[i].vehicleregno}, {$set:{"branch":branch}}, function (err2, docs2) {
              // console.log(docs2)
            })
          }
    }
        
  }); 
}

function Roadpermit() {
  branchvehicle.find({}, function(err, docs) {
    if (err) {
      console.error(err);
      return;
    }

    for (let i = 0; i < docs.length; i++) {
      var branch = docs[i].branch;

      roadpermit.update({"regno": docs[i].vehicleregno}, {$set: {"branch": branch}}, function (err2, docs2) {
        if (err2) {
          console.error(err2);
          return;
        }else{
          console.log(docs2)
        }
        // Your update logic here
      });
    }
  });
}


// function Roadpermit() {
//   branchvehicle.find({}, function(err,docs){
//     for(i=0;i<docs.length;i++){
//       //  console.log(docs[i])
//       var branch=docs[i].branch
//         //  console.log(data)
//         //  console.log(cmr)
        
//         roadpermit.update({"regno":docs[i].vehicleregno}, {$set:{"branch":branch}}, function (err2, docs2) {
//             //  console.log(docs2)
//           })
//         }
//   }); 
// }
function Insurance() {
  branchvehicle.find({}, function(err,docs){
    if (err) {
      console.error(err);
      return;
    }

    for(i=0;i<docs.length;i++){
      //  console.log(docs[i])
      var branch=docs[i].branch
        //  console.log(data)
        //  console.log(cmr)
        
        insurance.update({"regno":docs[i].vehicleregno}, {$set:{"branch":branch}}, function (err2, docs2) {
          if (err2) {
            console.error(err2);
            return;
          }else{
            console.log(docs2)
          }
            })
        }
  }); 
}

function vehicleservice1(){
  branchvehicle.find({}, function(err, docs){
    if (err) {
      console.error(err);
      return;
    }

    for(i=0;i<docs.length;i++){
      var vehicleregno = docs[i].vehicleregno
      // var branch1 = docs[i].branch
      vehicleservice.update({"vehicleregno":vehicleregno},{$set:{"branch": docs[i].branch}},{multi:true}, function(err1, docs1){
        if (err1) {
          console.error(err1);
          return;
        }else{
          console.log(docs1)
        }
      })
    }
    // res.send(docs)
    //  console.log(docs)


  })
}

function dailyvehicle1(){
  branchvehicle.find({}, function(err, docs){
    if (err) {
      console.error(err);
      return;
    }

    for(i=0;i<docs.length;i++){
      var vehicleregno = docs[i].vehicleregno
      dailyvehicle.update({"regno":vehicleregno},{$set:{"branch": docs[i].branch}},{multi:true}, function(err1, docs1){
        if (err1) {
          console.error(err1);
          return;
        }else{
          console.log(docs1)
        }
      })
    }
    // res.send(docs)
    //  console.log(docs)


  })
}

function Vehicle_Repairs1(){
  branchvehicle.find({}, function(err, docs){
    if (err) {
      console.error(err);
      return;
    }

    if (Array.isArray(docs) && docs.length > 0) {
    for(i=0;i<docs.length;i++){
      var vehicleregno = docs[i].vehicleregno
      vehiclerepair.update({"regno":vehicleregno},{$set:{"branch": docs[i].branch}},{multi:true}, function(err1, docs1){
        if (err1) {
          console.error(err1);
          return;
        }else{
          console.log(docs1)
        }
      })
    }
  }
        //  console.log(docs)
        // res.send(docs)

  })
}




setInterval( function(){ 
  Fitness()
} , 1000*60*1.5);

setInterval( function(){ 
  Pollution()
} , 1000*60*1.5);


setInterval( function(){ 
  Rta()
} , 1000*60*1.5);

setInterval( function(){ 
  First_Job()
} , 1000*60*1.5);


setInterval( function(){ 
  Roadtax()
} , 1000*60*1.5);
setInterval( function(){ 
  Roadpermit()
} , 1000*60*1.5);
setInterval( function(){ 
  Insurance()
} , 1000*60*1.5);
setInterval( function(){ 
  Vehiclechallan()
} , 1000*60*1.5);
setInterval( function(){ 
  Insuranceclaim();
  vehicleservice1();
  dailyvehicle1();
  Vehicle_Repairs1();
} , 1000*60*1.5);



module.exports = router;
