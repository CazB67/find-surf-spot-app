
$(document).ready(function() {

var glwhichDay=0; // Day to extract data for each timeslot,  0 =today, 1=tomorrow 
var glAbility='beginner';
var glStartHr=6;
var glData=[];

var gldataReady=false;

    $(document).foundation();

    function updateGlobal(data){
        glData=data;
        //console.log('yay it worked');
        console.log(glData);
    };

    //Results on click event
    $(".results").on("click", function(event) {
        alert("Hi");
    });

    function getHourNow(){
        var hournow=moment().format('HH');
        return hournow;
    }

    // determine from which day to extract data 
    function getWhichDayindex(hour=6, whenInput='morning'){
        var when = whenInput;
        var whichDayIndex = 0;

        switch (when){
            case 'morning':
                if (hour>8) whichDayIndex = 1;
                break;   
            case 'midday':
                if (hour>13) whichDayIndex=1;
                break;
            case 'afternoon':
                if (hour > 17) whichDayIndex=1;
                break;
            case 'default':
                break;    
        }
        return whichDayIndex;
    };

    // determines the list of surfable conditions
    function getSurfabilityArray(dataObj) {
        var surfable=false;
        var surfableArray=[];
        var isWindOK=false;
        var isWindDirOK=false;
        var isSwellOK=false;
        // check wind direction (SW, S or W, NW above 15knots = 28km/hr means not surfable)
        $.each(dataObj,function(index){
            
            //Check wind direction
            var wind_directions=dataObj[index].wind_direction_texts;
            const poorwindsDirections=['S','SSW','SW','WSW','W'];

            if(poorwindsDirections.indexOf(wind_directions[0])<0 && poorwindsDirections.indexOf(wind_directions[1])<0 && poorwindsDirections.indexOf(wind_directions[2])<0){
                    isWindDirOK=true;
            };
            
            //Check wind speed
            if (dataObj[index].wind_speeds[0]<28){
                isWindOK=true;
            };          

            //check swell max height(<1.5m means not surfable)
            if(dataObj[index].swell_heights[2]>1.5){
                isSwellOK=true
            };

            //Surfable assessment
            if(isWindDirOK && isWindOK && isSwellOK){
                surfable=true;
            };
            surfableArray.push(surfable);
        })
        return surfableArray;
    };

    function getSurfSpotList(dataObj){
        var okspots=getSurfabilityArray(dataObj);
        var okIDs=[];
        console.log(okspots);
        $.each(okspots,function(index){
            if(okspots[index]===true){
                okIDs.push(glData[index].ww_id);
            }
        })
        return okIDs;
    }
    
    $("#search-btn").on("click", function() {
        var wwtimerObj;
        var datareadyObj;
        
        function checkForData(){
            var recs_received=glData.length;
            if (recs_received<1) {
                return;
            }; 
            if (recs_received<9) {
                console.log('Records received: ' + recs_received);
            } else if (recs_received==9){
                gldataReady=true;
                console.log('Have All Data');
                //console.log(glData);
                clearInterval(wwtimerObj);
            }
        };
        
        function prepareData(){
            if (gldataReady===false){
                return;
            };
            clearInterval(datareadyObj);
            var okIDs=getSurfSpotList(glData);
            console.log({okIDs});
        };
        
        
        //Gets the data from the WW API and puts it into the global variable
        getDataFromWW(ww_ids,moment(),glwhichDay,glStartHr,updateGlobal);
         
        //Checks whether any data has been received in the global variable
        wwtimerObj=setInterval(function () {
            checkForData()
        },200);

        //Checks whether all the data is ready for assessment
        datareadyObj=setInterval(function(){
            prepareData()
        },200);
    });

    function showModal(){
        // var x = new Foundation.Reveal($("#exampleModal1"));
        // x.open();
        //https://stackoverflow.com/questions/33855505/zurb-foundation-6-reveal-doesnt-work
        //$('#exampleModal1').foundation('reveal', 'open');
    }
    
    $('#when').on('change',function(event){
        var when = event.target.value;
        //console.log(when);
        var hrnow=getHourNow();
        var whichDayIndex= getWhichDayindex(hrnow,when);
        //console.log({whichDayIndex});      
        glwhichDay=whichDayIndex;

        var starthr=6;
        if (when==='midday') {
            starthr=11
        } else if (when === 'afternoon') {
            starthr=15
        };

        glStartHr=starthr;

    });

    $('#ability').on('change',function(event){
        var thisAbility=event.target.value;
        glAbility=thisAbility;
        //console.log(glAbility);
    })

});