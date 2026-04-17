var app = angular.module("myapp",['ui.directives', 'ui.filters','datatables', 'datatables.buttons']);
//--------------------------------------Dashboard data ------------------------------------------------------------------------------
app.controller("dashboardcontroller",["getFuelfill","getTotalBusfill","getTodayBusfill","$scope","DTOptionsBuilder", "DTColumnBuilder","DTColumnDefBuilder", function(getFuelfill,getTotalBusfill,getTodayBusfill,$scope,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder)  {
  $scope.busfill = [];
  // $scope.busfill = []

  $scope.Totallit = 0
  $scope.Usagelit = 0
  $scope.TodayUsagelit = 0 
  $scope.Totalamount = 0

      $scope.vm = {};
      $scope.vm.dtInstance = {};
      $scope.vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(2).notSortable()];
      $scope.vm.dtOptions = DTOptionsBuilder.newOptions()
      .withOption('paging', true)
      .withOption('searching', true)
      .withOption('info', true)
      .withButtons([
      {
      extend:    'copy',
      text:      '<i class="fa fa-files-o"></i> Copy',
      titleAttr: 'Copy'
      },
      {
      extend:    'print',
      text:      '<i class="fa fa-print" aria-hidden="true"></i> Print',
      titleAttr: 'Print'
      },
      {
      extend:    'csvHtml5',
      text:      '<i class="fa fa-file-text-o"></i> csv',
      titleAttr: 'csv'
      },
      {
      extend:    'pdfHtml5',
      text:      '<i class="fa fa-file-pdf-o"></i> pdf',
      titleAttr: 'print'
      },
      {
      extend:    'excel',
      text:      '<i class="fa fa-file-excel-o"></i> Excel',
      titleAttr: 'Excel'
      },
      ]
      )
      ;
    

    $scope.getdata=function(){
      getFuelfill.gettingfuelfill().then(function(data){
        if(data){
          //console.log(data)
          // $scope.fuelfill = data
          //console.log($scope.fuelfill)
          for(i=0;i<data.length;i++){
            $scope.Totallit +=parseInt(data[i].quantity)
          }
        }
        else{
          $scope.fuelfill = []
        }
      })
      getTotalBusfill.gettingbusfill().then(function(data){
        if(data){
          // console.log(data)
          for(i=0;i<data.length;i++){
            if(Number(data[i].fquantity) !== NaN){
              $scope.Usagelit +=Number(data[i].fquantity)
              $scope.Totalamount +=data[i].total
              // console.log( i +"  "+data[i]._id+"  "+Number(data[i].fquantity)+"  "+ $scope.Usagelit)
            }
          }
          // $scope.busfill = data
          //console.log($scope.busfill)
        }
      })
      getTodayBusfill.gettingbusfill().then(function(data){
        if(data){
             for(i=0;i<data.length;i++){
              if(Number(data[i].fquantity) !== NaN){
                $scope.TodayUsagelit +=Number(data[i].fquantity)
                // console.log( i +"  "+data[i]._id+"  "+Number(data[i].fquantity)+"  "+ $scope.Usagelit)
              }
            }
             $scope.busfill = data
          }
        else{
          $scope.busfill = []
        }
      })
    }
}]);

app.factory('getTotalBusfill',['$http', function($http){
  return{
    gettingbusfill : function(){
      data=$http({
        method:'get',
        url:'/getTotalBusfilldata'
      }).then(function(response){
        //console.log(response.data)
        return response.data
      })
      return data
    }
  }
}])

app.factory('getTodayBusfill',['$http', function($http){
  return{
    gettingbusfill : function(){
      data=$http({
        method:'get',
        url:'/getTodayBusfilldata'
      }).then(function(response){
        //console.log(response.data)
        return response.data
      })
      return data
    }
  }
}])


//--------------------------------------fuel fill------------------------------------------------------------------------------
app.controller("FuelfillController",["postFuelfill","editFuelfill","deleteFuelfill","getFuelfill","getFuel","$scope","DTOptionsBuilder", "DTColumnBuilder","DTColumnDefBuilder", function(postFuelfill,editFuelfill,deleteFuelfill,getFuelfill,getFuel,$scope,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder)  {
  $scope.fuel = [];
  $scope.fuelfill = []

      $scope.vm = {};
      $scope.vm.dtInstance = {};
      $scope.vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(2).notSortable()];
      $scope.vm.dtOptions = DTOptionsBuilder.newOptions()
      .withOption('paging', true)
      .withOption('searching', true)
      .withOption('info', true)
      .withButtons([
      {
      extend:    'copy',
      text:      '<i class="fa fa-files-o"></i> Copy',
      titleAttr: 'Copy'
      },
      {
      extend:    'print',
      text:      '<i class="fa fa-print" aria-hidden="true"></i> Print',
      titleAttr: 'Print'
      },
      {
      extend:    'csvHtml5',
      text:      '<i class="fa fa-file-text-o"></i> csv',
      titleAttr: 'csv'
      },
      {
      extend:    'pdfHtml5',
      text:      '<i class="fa fa-file-pdf-o"></i> pdf',
      titleAttr: 'print'
      },
      {
      extend:    'excel',
      text:      '<i class="fa fa-file-excel-o"></i> Excel',
      titleAttr: 'Excel'
      },
      ]
      )
      ;
    $scope.saveFuelfillData = function (fuelfills) {
        //console.log(fuelfills)
        $scope.fuelfill.push(fuelfills);
        $scope.fuelfills = {};
        console.log($scope.fuelfill);
        postFuelfill.postingFuelfill(fuelfills)
    }
    $scope.editsaveFuelfill = function(value){
      //console.log(value)
      editFuelfill.editingFuelfill(value)
    }
    $scope.updateSum = function() {
      $scope.fuelfills.trate = ($scope.fuelfills.quantity * $scope.fuelfills.rate);
    }
    $scope.removefuelfillItem = function(index,name){
      console.log(name)
      deleteFuelfill.deletingFuelfill(name)
      $scope.fuelfill.splice(index, 1);
    }

    $scope.getdata=function(){
      getFuel.gettingFuel().then(function(data){
        if(data){
          $scope.fuel = data
          //console.log($scope.fuel)
        }
        else{
          $scope.fuel = []
        }
      })
    }

    $scope.getFuelfilldata = function(){
      getFuelfill.gettingfuelfill().then(function(data){
        if(data){
          //console.log(data)
          $scope.fuelfill = data
          //console.log($scope.fuelfill)
        }
        else{
          $scope.fuelfill = []
        }
      })
    }
}]);

app.service('postFuelfill',['$http', function($http){
  return{
  postingFuelfill : function(value){
    $http({
      method:'post',
      url:'/FuelfillData',
      data:value
    }).then(function(success){
       //console.log(success)
       alert("successfully inserted")
    }, function(err){
      //console.log(err)
    })
  }
}
}] )

app.service('editFuelfill',['$http', function($http){
 return{
   editingFuelfill: function(val){
     $http({
       method:'post',
       url:'/EditFuelfill',
       data:val
     }).then(function(success){
       //console.log(success)
       alert("successfully Updated")
     },function(error){
       //console.log(error)
     })
   }
 }
}] )

app.service('deleteFuelfill',['$http', function($http){
 return{
   deletingFuelfill: function(name){
     $http({
       method:'post',
       url:'/RemoveFuelfill',
       data:name
     }).then(function(success){
       //console.log(success)
       alert("successfully Deleted")
     },function(error){
       //console.log(error)
     })
   }
 }
}] )
app.factory('getFuelfill',['$http', function($http){
  return{
    gettingfuelfill : function(){
      data=$http({
        method:'get',
        url:'/getFuelfilldata'
      }).then(function(response){
        //console.log(response.data)
        return response.data
      })
      return data
    }
  }
}])
app.factory('getFuel',['$http', function($http){
  return{
    gettingFuel : function(){
      data=$http({
        method:'get',
        url:'/getFueldata'
      }).then(function(response){
        //console.log(response.data)
        return response.data
      })
      return data
    }
  }
}])

//--------------------------------------Bus fill-------------------------------------------------------------
app.controller("BusfillController",["postBusfill","editBusfill","deleteBusfill","getBusfill","getFuel","getvehicle","getBusStaff","getvehiclemake","getvehiclesociety","$scope","DTOptionsBuilder", "DTColumnBuilder","DTColumnDefBuilder","vehicle","getbunkfilling","postbusfillreport","getbranch","getsociety","postBussearchfill", function(postBusfill,editBusfill,deleteBusfill,getBusfill,getFuel,getvehicle,getBusStaff,getvehiclemake,getvehiclesociety,$scope,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,vehicle,getbunkfilling,postbusfillreport,getbranch,getsociety,postBussearchfill)  {
  $scope.busfill = [];
  $scope.BusStaff = [];
  $scope.fuel = [];
  $scope.Vehicle = [];
  $scope.vehiclemake = [];
  $scope.bunkfill = [];
  $scope.busfillreportdata = [];
  $scope.branch = [];
  $scope.society=[];

    $scope.vm = {};
      $scope.vm.dtInstance = {};
      $scope.vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(2).notSortable()];
      $scope.vm.dtOptions = DTOptionsBuilder.newOptions()
      .withOption('paging', true)
      .withOption('searching', true)
      .withOption('info', true)
      .withButtons([
      {
      extend:    'copy',
      text:      '<i class="fa fa-files-o"></i> Copy',
      titleAttr: 'Copy'
      },
      {
      extend:    'print',
      text:      '<i class="fa fa-print" aria-hidden="true"></i> Print',
      titleAttr: 'Print'
      },
      {
      extend:    'csvHtml5',
      text:      '<i class="fa fa-file-text-o"></i> csv',
      titleAttr: 'csv'
      },
      {
      extend:    'pdfHtml5',
      text:      '<i class="fa fa-file-pdf-o"></i> pdf',
      titleAttr: 'print'
      },
      {
      extend:    'excel',
      text:      '<i class="fa fa-file-excel-o"></i> Excel',
      titleAttr: 'Excel'
      },
      ]
      )
      ;
  $scope.getdetails = function () {
    $scope.result = false;
    $scope.desc = false;
    if ($scope.busfills.vehicletype == "Own Vehicle")
    $scope.result = true;
    else if($scope.busfills.vehicletype == "Private")
    $scope.desc = true;
  }

  $scope.report=function(dates){
      console.log(dates)
      postbusfillreport.postingbusfillreport(dates).then(function(data){
        if(data){
          //console.log(data)
          $scope.busfillreportdata = data
          console.log($scope.busfillreportdata);
        }
        else{
          $scope.busfillreportdata = []
        }
      });
  }


  $scope.busreport=function(val){
      console.log(val)
      postBussearchfill.postingbusfillsearchreport(val).then(function(data){
        if(data){
          // console.log(data)
          $scope.busfillsearchreport = data
          // console.log($scope.busfillreportdata);
        }
        else{
          $scope.busfillsearchreport = []
        }
      });
  }


  $scope.searchbus=function(val){
       vehicle.vehiclesearch(val).then(function(data){
         $scope.Vehicle=data;
         // console.log($scope.Vehicle)
       })
  }
  $scope.clickbus=function(reg){
     $scope.bus.reg=reg
     $scope.Vehicle=[] 
  }  

  $scope.search=function(val){
       vehicle.vehiclesearch(val).then(function(data){
         $scope.Vehicle=data;
         // console.log($scope.Vehicle)
       })
    }

    $scope.click=function(reg){
        // console.log(reg)
      $scope.busfills.regno=reg
      $scope.Vehicle=[] 
      getvehiclesociety.gettingvehiclesociety(reg).then(function(data){
        $scope.busfills.society = data.society
        $scope.busfills.branch = data.branch
        // console.log($scope.busfills.branch)
     })
      var mine = $scope.vehiclemake
      // console.log(mine.length)
      for(i=0;i<mine.length;i++){
        var registration = mine[i].regno
        if($scope.busfills.regno==registration){
            var mod = mine[i].model
            $scope.busfills.model = mod 
            // console.log(mod)  
        }
      }
      var rates = $scope.bunkfill;
      for(i=0;i<rates.length;i++){
        var per = rates[rates.length-1].rate
        $scope.busfills.frate = per
      }
    }

    $scope.saveBusfillData = function (busfills) {
        //console.log(busfills)
        $scope.busfill.push(busfills);
        $scope.busfills = {};
        //console.log($scope.busfill);
        postBusfill.postingBusfill(busfills)
    }
    $scope.updateData = function() {
      $scope.busfills.kms = $scope.busfills.cmr - $scope.busfills.omr;
      $scope.busfills.avgkmpl = ($scope.busfills.kms)/$scope.busfills.fquantity;
      $scope.busfills.total = $scope.busfills.frate * $scope.busfills.fquantity;
      var avg = $scope.busfills.avgkmpl
      if(avg>=0){
      if(($scope.busfills.model=="LEYLAND")||($scope.busfills.model=="1510")||($scope.busfills.model=="1512")||($scope.busfills.model=="1515")||($scope.busfills.model=="1613")){
        //console.log($scope.busfills.avgkmpl);
        if($scope.busfills.avgkmpl>=5.50){
          $scope.busfills.grade="A";
          //console.log($scope.busfills.grade);
        }
        else if(($scope.busfills.avgkmpl>=5.00)&&($scope.busfills.avgkmpl<5.50)){
          $scope.busfills.grade="B";
          //console.log($scope.busfills.grade);
        }
        else if(($scope.busfills.avgkmpl>=4.50)&&($scope.busfills.avgkmpl<5.00)){
          $scope.busfills.grade="C";
          //console.log($scope.busfills.grade);
        }
        else if($scope.busfills.avgkmpl<4.50){
          $scope.busfills.grade="D";
          //console.log($scope.busfills.grade);
        }
      }
      else if($scope.busfills.model=="ULTRA"){
        //console.log($scope.busfills.avgkmpl);
        if($scope.busfills.avgkmpl>=6.50){
          $scope.busfills.grade="A";
          //console.log($scope.busfills.grade);
        }
        else if(($scope.busfills.avgkmpl>=6.00)&&($scope.busfills.avgkmpl<6.50)){
          $scope.busfills.grade="B";
          //console.log($scope.busfills.grade);
        }
        else if(($scope.busfills.avgkmpl>=5.50)&&($scope.busfills.avgkmpl<6.00)){
          $scope.busfills.grade="C";
          //console.log($scope.busfills.grade);
        }
        else if($scope.busfills.avgkmpl<5.50){
          $scope.busfills.grade="D";
          //console.log($scope.busfills.grade);
        }
      }
      else if(($scope.busfills.model=="SWARAJ")||($scope.busfills.model=="MARCOPOLO")||($scope.busfills.model=="LAND CRUSIER")){
        //console.log($scope.busfills.avgkmpl);
        if($scope.busfills.avgkmpl>=7.00){
          $scope.busfills.grade="A";
          //console.log($scope.busfills.grade);
        }
        else if(($scope.busfills.avgkmpl>=6.00)&&($scope.busfills.avgkmpl<7.00)){
          $scope.busfills.grade="B";
          //console.log($scope.busfills.grade);
        }
        else if(($scope.busfills.avgkmpl>=5.00)&&($scope.busfills.avgkmpl<6.00)){
          $scope.busfills.grade="C";
          //console.log($scope.busfills.grade);
        }
        else if($scope.busfills.avgkmpl<5.00){
          $scope.busfills.grade="D";
          //console.log($scope.busfills.grade);
        }
      }
      else if(($scope.busfills.model=="SUNSHINE")||($scope.busfills.model=="STAG")){
        //console.log($scope.busfills.avgkmpl);
        if($scope.busfills.avgkmpl>=6.00){
          $scope.busfills.grade="A";
          //console.log($scope.busfills.grade);
        }
        else if(($scope.busfills.avgkmpl>=5.50)&&($scope.busfills.avgkmpl<6.00)){
          $scope.busfills.grade="B";
          //console.log($scope.busfills.grade);
        }
        else if(($scope.busfills.avgkmpl>=5.00)&&($scope.busfills.avgkmpl<5.50)){
          $scope.busfills.grade="C";
          //console.log($scope.busfills.grade);
        }
        else if($scope.busfills.avgkmpl<5.00){
          $scope.busfills.grade="D";
          //console.log($scope.busfills.grade);
        }
      }
      else if($scope.busfills.model=="INNOVA"){
        //console.log($scope.busfills.avgkmpl);
        if($scope.busfills.avgkmpl>=15){
          $scope.busfills.grade="A";
          //console.log($scope.busfills.grade);
        }
        else if(($scope.busfills.avgkmpl>=13.5)&&($scope.busfills.avgkmpl<15)){
          $scope.busfills.grade="B";
          //console.log($scope.busfills.grade);
        }
        else if(($scope.busfills.avgkmpl>=12.5)&&($scope.busfills.avgkmpl<13.5)){
          $scope.busfills.grade="C";
          //console.log($scope.busfills.grade);
        }
        else if($scope.busfills.avgkmpl<12.5){
          $scope.busfills.grade="D";
          //console.log($scope.busfills.grade);
        }
      }
      else if($scope.busfills.model=="BOLEORO"){
        //console.log($scope.busfills.avgkmpl);
        if($scope.busfills.avgkmpl>=14){
          $scope.busfills.grade="A";
          //console.log($scope.busfills.grade);
        }
        else if(($scope.busfills.avgkmpl>=13)&&($scope.busfills.avgkmpl<14)){
          $scope.busfills.grade="B";
          //console.log($scope.busfills.grade);
        }
        else if(($scope.busfills.avgkmpl>=12)&&($scope.busfills.avgkmpl<13)){
          $scope.busfills.grade="C";
          //console.log($scope.busfills.grade);
        }
        else if($scope.busfills.avgkmpl<12){
          $scope.busfills.grade="D";
          //console.log($scope.busfills.grade);
        }
      }
      else if(($scope.busfills.model=="TATA WINGER") || ($scope.busfills.model=="AMBULANCE") || ($scope.busfills.model=="FORCE")){
        //console.log($scope.busfills.avgkmpl);
        if($scope.busfills.avgkmpl>=12){
          $scope.busfills.grade="A";
          //console.log($scope.busfills.grade);
        }
        else if(($scope.busfills.avgkmpl>=11)&&($scope.busfills.avgkmpl<12)){
          $scope.busfills.grade="B";
          //console.log($scope.busfills.grade);
        }
        else if(($scope.busfills.avgkmpl>=10)&&($scope.busfills.avgkmpl<11)){
          $scope.busfills.grade="C";
          //console.log($scope.busfills.grade);
        }
        else if($scope.busfills.avgkmpl<=9){
          $scope.busfills.grade="D";
          //console.log($scope.busfills.grade);
        }
      }
      else if($scope.busfills.model=="VOLVO"){
        //console.log($scope.busfills.avgkmpl);
        if($scope.busfills.avgkmpl>=10){
          $scope.busfills.grade="A";
          //console.log($scope.busfills.grade);
        }
        else if(($scope.busfills.avgkmpl>=9)&&($scope.busfills.avgkmpl<10)){
          $scope.busfills.grade="B";
          //console.log($scope.busfills.grade);
        }
        else if(($scope.busfills.avgkmpl>=8)&&($scope.busfills.avgkmpl<9)){
          $scope.busfills.grade="C";
          //console.log($scope.busfills.grade);
        }
      }
      else{
        $scope.busfills.grade="Null";
      }
    }
    }
  
    $scope.editsaveBusfill = function(value){
      //console.log(value)
      editBusfill.editingBusfill(value)
    }
    $scope.removebusfillItem = function(index,name){
      //console.log(name)
      deleteBusfill.deletingBusfill(name)
      $scope.busfill.splice(index, 1);
    }
    
    $scope.getdata=function(){
      getBusStaff.gettingBusStaff().then(function(data){
        if(data){
          $scope.BusStaff = data
          //console.log($scope.BusStaff)
        }
        else{
          $scope.BusStaff = []
        }
      })
      getFuel.gettingFuel().then(function(data){
        if(data){
          $scope.fuel = data
          //console.log($scope.fuel)
        }
        else{
          $scope.fuel = []
        }
      })
      getvehicle.gettingvehicle().then(function(data){
        if(data){
          //console.log(data)
          $scope.vehiclemake = data
          console.log($scope.Vehicle)
        }
        else{
          $scope.vehiclemake = []
        }
      }) 
      getbunkfilling.gettingbunkfilling().then(function(data){
        if(data){
          console.log(data)
          $scope.bunkfill = data
          console.log($scope.bunkfill)
        }
        else{
           $scope.bunkfill = []
        }
      })
      getbranch.gettingbranch().then(function(data){
        if(data){
          $scope.branch = data
          console.log($scope.branch)
        }
        else{
          $scope.branch = []
        }
      })
      getsociety.gettingsociety().then(function(data){
        if(data){
          $scope.society = data
        }
        else{
          $scope.society=[]
        }
      })
    }

    $scope.getBusfilldata = function(){
      getBusfill.gettingbusfill().then(function(data){
        if(data){
          console.log(data)
          $scope.busfill = data
          //console.log($scope.busfill)
        }
        else{
          $scope.busfill = []
        }
      })
    }
}]);


app.service('postbusfillreport',['$http', function($http){
  return{
  postingbusfillreport : function(value){
    data=$http({
      method:'post',
      url:'/gettingbusfilldata',
      data:value
    }).then(function(success){
       //console.log(success)
       return success.data
    }, function(err){
      //console.log(err)
    })
    return data
  }
}
}] )

app.service('postBussearchfill',['$http', function($http){
  return{
  postingbusfillsearchreport : function(value){
    data=$http({
      method:'post',
      url:'/gettingbusfillsearchdata',
      data:value
    }).then(function(success){
       //console.log(success)
       return success.data
    }, function(err){
      //console.log(err)
    })
    return data
  }
}
}] )

app.factory('getbunkfilling',['$http', function($http){
  return{
    gettingbunkfilling : function(){
      data=$http({
        method:'get',
        url:'/getFuelfilldata'
      }).then(function(response){
        console.log(response.data)
        return response.data
      })
      return data
    }
  }
}])

app.service('vehicle',['$http', function($http){
  return{
  vehiclesearch : function(value){
    console.log(value)
    dattas=$http({
      method:'post',
      url:'/searchVehicleinfodata',
      data:{value}
    }).then(function(success){
       //console.log(success)
       return success.data
    }, function(err){
      //console.log(err)
    })
    return dattas
  }
}
}])

app.service('postBusfill',['$http', function($http){
  return{
  postingBusfill : function(value){
    $http({
      method:'post',
      url:'/BusfillData',
      data:value
    }).then(function(success){
       //console.log(success)
       alert("successfully inserted")
    }, function(err){
      //console.log(err)
    })
  }
}
}] )

app.service('editBusfill',['$http', function($http){
 return{
   editingBusfill: function(val){
     $http({
       method:'post',
       url:'/EditBusfill',
       data:val
     }).then(function(success){
       //console.log(success)
       alert("successfully Updated")
     },function(error){
       //console.log(error)
     })
   }
 }
}] )

app.service('deleteBusfill',['$http', function($http){
 return{
   deletingBusfill: function(name){
     $http({
       method:'post',
       url:'/RemoveBusfill',
       data:name
     }).then(function(success){
       console.log(success)
       alert("successfully Deleted")
     },function(error){
       //console.log(error)
     })
   }
 }
}] )
app.factory('getBusfill',['$http', function($http){
  return{
    gettingbusfill : function(){
      data=$http({
        method:'get',
        url:'/getBusfilldata'
      }).then(function(response){
        //console.log(response.data)
        return response.data
      })
      return data
    }
  }
}])
app.factory('getFuel',['$http', function($http){
  return{
    gettingFuel : function(){
      data=$http({
        method:'get',
        url:'/getFueldata'
      }).then(function(response){
        //console.log(response.data)
        return response.data
      })
      return data
    }
  }
}])
app.factory('getvehicle',['$http', function($http){
  return{
    gettingvehicle : function(){
      data=$http({
        method:'get',
        url:'/getVehicleinfodata'
      }).then(function(response){
        //console.log(response.data)
        return response.data
      })
      return data
    }
  }
}])
app.factory('getBusStaff',['$http', function($http){
  return{
    gettingBusStaff : function(){
      data=$http({
        method:'get',
        url:'/getBusStaffdata'
      }).then(function(response){
        //console.log(response.data)
        return response.data
      })
      return data
    }
  }
}])
app.factory('getvehiclemake', ['$http', function($http){
  return{
    gettingvehiclemake : function(){
      data=$http({
        method:'get',
        url:'/getVehicleinfodata'
      }).then(function(response){
        console.log(response.data)
        return response.data
      })
      return data
    } 
  }
}])
app.factory('getsociety',['$http', function($http){
  return{
    gettingsociety : function(){
      data=$http({
        method:'get',
        url:'/getSocietydata'
      }).then(function(response){
        //console.log(response.data)
        return response.data
      })
      return data
    }
  }
}])

app.service('getvehiclesociety',['$http', function($http){
  return{
  gettingvehiclesociety : function(value){
      data=$http({
        method:'post',
        url:'/gettingvehiclebranchdetails',
        data:{value}
      }).then(function(success){
         //console.log(success)
         // alert("successfully inserted")
         return success.data
      })
      return data
  }
}
}])

app.factory('getbranch',['$http', function($http){
  return{
    gettingbranch : function(){
      data=$http({
        method:'get',
        url:'/getBranchdata'
      }).then(function(response){
        //console.log(response.data)
        return response.data
      })
      return data
    }
  }
}])