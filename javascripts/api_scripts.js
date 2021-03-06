//$(document).ready(function(){

    

function getUniqueIDs(beacharray){
    var ids=[beacharray[0].ww_id];
    var newid=0;

    for (var i=1; i<beacharray.length; i++){
        newid=beacharray[i].ww_id;
        if(ids.indexOf(newid)===-1) ids.push(newid);
        //console.log(ids);
    }
    return ids;
}

function makewwWarningsURL(){
    //this provides all warnings for the state. 
    // Marine Wind weather warnings = "code": "IDW20100"
    // Marine warning = "code": "IDW11160"
    // Also relevant, surf & tsunami but I don't know these codes
    return 'https://cors-anywhere.herokuapp.com/https://api.willyweather.com.au/v2/ZWZjODA2NGIyMGQxZThjYmZmNzE3Mz/states/7/warnings.json'
}



function getWarningsData(callback){
    var queryURL=makewwWarningsURL();
    var data;
    $.ajax({
        url: queryURL,
        method: 'GET',
        success: function(response){
            data = filterWarnings(response);
            callback(data);
        },
        error: function(){}
    }).done(function(response){
    
    });
};


function filterWarnings(dataObj){
    const relevant_codes=['IDW20100','IDW11160','IDW21033','IDW21034','IDW21035','IDW21037','IDW21038','IDW23100','IDW23200','IDW23300','IDW24000','IDW24010','IDW24020',
                            'IDW24100','IDW24200','IDW24300']
    var LancelinWarnings=[];
    var PerthWarnings=[];
    
    $.each(dataObj,function(index){
        if(!relevant_codes.includes(dataObj[index].code)){
            return [];
        };
        var warningText= dataObj[index].content.html;
        if(warningText.indexOf('Lancelin')>=0) {
            //console.log ('found relevant Lancelin warnings');
            LancelinWarnings=LancelinWarnings.push(warningText) ;
        } else if (warningText.indexOf('Perth')>=0 ){
            //console.log ('found relevant Perth warnings');
            PerthWarnings=PerthWarnings.push(warningText);
        }
    });
    var data={LancelinWarnings,PerthWarnings};
    return data;
};



function makewwURL(location='',start_date=Date()){
    if (location!== ''){
        var searchlocn = location;
        var api_key= 'ZWZjODA2NGIyMGQxZThjYmZmNzE3Mz';
        var www_addr = 'https://cors-anywhere.herokuapp.com/https://api.willyweather.com.au/v2/';
        //var middle_id = '/search.json?query=';
        var middle_data = '/locations/';

        //var suffix_id = '&limit=1';
        var suffix_data = '/weather.json?forecasts=swell,wind,precis,temperature,sunrisesunset,tides,uv&days=2&startDate=';
        var datestring = moment(start_date).format('YYYY-MM-DD');

        var queryURL = www_addr + api_key + middle_data + searchlocn + suffix_data + datestring;
        return queryURL;
    }

    }

function getAverage(numbers=[]) {
    var total = 0, i;
    for (i = 0; i < numbers.length; i += 1) {
        total += numbers[i];
    }
    return total / numbers.length;

}
function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
  }
function getMinOfArray(numArray) {
    return Math.min.apply(null, numArray);
}

function getMinMaxAvg(numbers=[]){
    var numbers_avg=getAverage(numbers);
    var numbers_min=getMinOfArray(numbers);
    var numbers_max=getMaxOfArray(numbers);
    return [numbers_min,numbers_avg,numbers_max];
    
}

function getDataFromWW(beacharray=[], start_date,whichdayindex,starttime,callback){
    var data = [];
    var done=0;
    var id_list=[];

    if(beacharray === []){
        return [];
    } else {
        id_list=getUniqueIDs(beacharray);
    };

    //console.log('Sites:' + id_list.length);
    for(var index=0; index<id_list.length; index++) {
        var locn_id=id_list[index];
        //var whichDate=moment(start_date).format('YYYY-MM-DD');
        var queryURL=makewwURL(locn_id,start_date);
        var gotData=false;
        var data_selection = {};
        var start_time=starttime;
        var whichday = parseInt(whichdayindex); // 0 for today, 1 for tomorrow
        //var errors = [];
        var precis_time=5;
        var uv_time=0;
        
        //Precis is only provided every 3 hours
        switch (starttime){
            case 6:
                precis_time=1;  // corresponds to 5am
                uv_time=0; // corresponds to 6am - 1st reading
                break;
            case 11: 
                precis_time=3; // corresponds to 11am
                uv_time=5; // corresponds to 11am
                break;
            case 15:
                precis_time=5; //corresponds to 5pm
                uv_time=9; // corresponds to 3pm
                break;
        };

        $.ajax({
            url: queryURL,
            dataType: 'json',
            method: "GET",
            error: function(response){
                //errors.push(queryURL);
                
                ++done;
            },
            success: function(response){
                data_selection={
                    'ww_id':response.location.id,
                    'ww_name': response.location.name,
                     'swell_heights':getMinMaxAvg([
                        response.forecasts.swell.days[whichday].entries[start_time].height,
                        response.forecasts.swell.days[whichday].entries[start_time+1].height,
                        response.forecasts.swell.days[whichday].entries[start_time+2].height
                    ]),
                    'swell_periods':getMinMaxAvg([
                        response.forecasts.swell.days[whichday].entries[start_time].period,
                        response.forecasts.swell.days[whichday].entries[start_time+1].period,
                        response.forecasts.swell.days[whichday].entries[start_time+2].period
                    ]),
                    'swell_directions':getMinMaxAvg([
                        response.forecasts.swell.days[whichday].entries[start_time].direction,
                        response.forecasts.swell.days[whichday].entries[start_time+1].direction,
                        response.forecasts.swell.days[whichday].entries[start_time+2].direction
                    ]),
                    'swell_direction_texts' : [
                        response.forecasts.swell.days[whichday].entries[start_time].directionText,
                        response.forecasts.swell.days[whichday].entries[start_time+1].directionText,
                        response.forecasts.swell.days[whichday].entries[start_time+2].directionText
                    ],
                    'wind_speeds' : getMinMaxAvg([
                        response.forecasts.wind.days[whichday].entries[start_time].speed,
                        response.forecasts.wind.days[whichday].entries[start_time+1].speed,
                        response.forecasts.wind.days[whichday].entries[start_time+2].speed
                    ]),
                    'wind_directions': getMinMaxAvg([
                        response.forecasts.wind.days[whichday].entries[start_time].direction,
                        response.forecasts.wind.days[whichday].entries[start_time+1].direction,
                        response.forecasts.wind.days[whichday].entries[start_time+2].direction
                    ]),
                    'wind_direction_texts' : [
                        response.forecasts.wind.days[whichday].entries[start_time].directionText,
                        response.forecasts.wind.days[whichday].entries[start_time+1].directionText,
                        response.forecasts.wind.days[whichday].entries[start_time+2].directionText
                    ],
                    'precis_texts': response.forecasts.precis.days[whichday].entries[precis_time].precis,
                    'temperatures': getMinMaxAvg([
                        response.forecasts.temperature.days[whichday].entries[start_time].temperature,
                        response.forecasts.temperature.days[whichday].entries[start_time+1].temperature,
                        response.forecasts.temperature.days[whichday].entries[start_time+2].temperature
                    ]),
                    'uvs': getMinMaxAvg([
                        response.forecasts.uv.days[whichday].entries[uv_time].index,
                        response.forecasts.uv.days[whichday].entries[uv_time+1].index,
                        response.forecasts.uv.days[whichday].entries[uv_time+2].index
                    ]),
                    'uv_texts': [
                        response.forecasts.uv.days[whichday].entries[uv_time].scale,
                        response.forecasts.uv.days[whichday].entries[uv_time+1].scale,
                        response.forecasts.uv.days[whichday].entries[uv_time+2].scale
                    ],
                    'tides':[
                        response.forecasts.tides.days[whichday].entries
                    ],
                    'sunrise_firstlight': response.forecasts.sunrisesunset.days[whichday].entries[0].firstLightDateTime,
                    'sunrise': response.forecasts.sunrisesunset.days[whichday].entries[0].riseDateTime,
                    'sunset_lastlight' : response.forecasts.sunrisesunset.days[whichday].entries[0].lastLightDateTime,
                    'sunset': response.forecasts.sunrisesunset.days[whichday].entries[0].setDateTime
                };
              
            data.push(data_selection);
            ++done;
            
            }
        }).done(function(response){
            gotData=true;
            if (done==id_list.length-1){
                callback(data);
            }                              
        });
        
    };
    
    
      
}

