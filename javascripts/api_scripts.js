//$(document).ready(function(){

    const ww_ids = [{
        location: 'Trigg Beach',
        ww_locn: 'Trigg+Beach',
        ww_id: 18919,
        lat: -31.877,
        lng: 115.751,
        postcode: '6029',
    },
    {
        location: 'Cottesloe Reef',
        ww_locn: 'Cottesloe+Beach',
        ww_id: 18824,
        lat: -31.996,
        lng: 115.751,
        postcode: '6011',
    },
    {
        location: 'Scarborough Beach',
        ww_locn: 'Scarborough+Beach',
        ww_id: 19555,
        lat: -31.894,
        lng: 115.754,
        postcode: '6019',
    },
    {   
        location: 'Stricklands Bay',
        ww_locn: 'Rottnest+Island',
        ww_id: 14468,
        lat: -31.995,
        lng: 115.54,
        postcode: '6161'
    },
    {
        location: 'Mandurah',
        ww_locn: 'Mandurah',
        ww_id: 14422,
        lat: -32.533,
        lng: 115.733,
        postcode: '6210'
    },
    {
        location: 'Lancelin',
        ww_locn: 'Lancelin',
        ww_id: 14555,
        lat: -31.021,
        lng: 115.332,
        postcode: '6044'
    },
    {
        location: 'Leighton Beach',
        ww_locn: 'Leighton+Beach',
        ww_id: 18920,
        lat: -32.03,
        lng: 115.747,
        postcode: '6159'
    },
    {
        location: 'Alkimos',
        ww_locn: 'Alkimos',
        ww_id: 14507,
        lat: -31.609,
        lng: 115.691,
        postcode: '6038'
    },
    {
        location: 'Secret Harbour',
        ww_locn: 'Secret+Harbour',
        ww_id: 14472,
        lat: -32.402,
        lng: 115.749,
        postcode: '6173'
    },
    {
        location: 'Mettams Pool',
        ww_locn: 'North+Beach',
        ww_id: 15960,
        lat: -31.861,
        lng: 115.753,
        postcode: '6020'
    },
    {
        location: 'Cottesloe Mainbreak',
        ww_locn: 'Cottesloe+Beach',
        ww_id: 18824,
        lat: -31.996,
        lng: 115.751,
        postcode: '6011',
    },
    {
        location: 'Sand Tracks Beach',
        ww_locn: 'Leighton+Beach',
        ww_id: 18920,
        lat: -32.03,
        lng: 115.747,
        postcode: '6159'
    },
    {
        location: 'Cables Artificial Reef',
        ww_locn: 'Mosman+Beach',
        ww_id: 18824,
        lat: -31.996,
        lng: 115.751,
        postcode: '6011',
    },
    {
        location: 'Hillarys Marina',
        ww_locn: 'Hillarys Marina',
        ww_id: 19546,
        lat: -31.823,
        lng:  115.733,
        postcode: '6025'
    }
];


function makewwURL(location='',start_date=Date()){
    if (location!== ''){
        var searchlocn = location;
        var api_key= 'ZWZjODA2NGIyMGQxZThjYmZmNzE3Mz';
        var www_addr = 'https://cors-anywhere.herokuapp.com/https://api.willyweather.com.au/v2/';
        //var middle_id = '/search.json?query=';
        var middle_data = '/locations/';

        //var suffix_id = '&limit=1';
        var suffix_data = '/weather.json?forecasts=swell,wind,precis,temperature,weather&days=2&startDate=';
        var datestring = moment(start_date).format('YYYY-MM-DD');



        //https://api.willyweather.com.au/v2/ZWZjODA2NGIyMGQxZThjYmZmNzE3Mz/locations/18919/weather.json?forecasts=swell,wind,precis,temperature,weather&days=3&startDate=2020-03-21


        var queryURL = www_addr + api_key + middle_data + searchlocn + suffix_data + datestring;
        return queryURL;
    }

    }




function getDataFromWW(beacharray=[], start_date){
    if(beacharray === []){
        return [];
    }
    for(var index=0; index<beacharray.length; index++) {
        var locn_id=beacharray[index].ww_id;
        //var whichDate=moment(start_date).format('YYYY-MM-DD');
        var queryURL=makewwURL(locn_id,start_date);
        var gotData=false;
        var data = [];
        var data_selection = {};
        var start_time=6;
        var whichday = 0; // 0 for today, 1 for tomorrow
        
   /*  $.get(queryURL).done(function (data) {
        console.log("the new way works")
    }); */

    
        $.ajax({
            url: queryURL,
            dataType: 'json',
            async:false,
            beforeSend:function(){

            },
            headers: {  
                /* "Access-Control-Allow-Origin" : "https://jo3005/github.io",
                'Content-Type': 'application/json' */
            },
            method: "GET",
            success: function(response){
                console.log("yay - success at last!");
                data_selection={
                    'swell_heights':[
                        response.forecasts.swell.days[whichday].entries[start_time].height,
                        response.forecasts.swell.days[whichday].entries[start_time+1].height,
                        response.forecasts.swell.days[whichday].entries[start_time+2].height
                    ],
                    'ave_swell_height': 0,
                    
                    'swell_periods':[
                        response.forecasts.swell.days[whichday].entries[start_time].period,
                        response.forecasts.swell.days[whichday].entries[start_time+1].period,
                        response.forecasts.swell.days[whichday].entries[start_time+2].period
                    ],
                    'ave_swell_period' : 0,

                    'swell_directions':[
                        response.forecasts.swell.days[whichday].entries[start_time].direction,
                        response.forecasts.swell.days[whichday].entries[start_time+1].direction,
                        response.forecasts.swell.days[whichday].entries[start_time+2].direction
                    ],
                    'ave_swell_direction' : 0,
                    'swell_direction_texts' : [
                        response.forecasts.swell.days[whichday].entries[start_time].directionText,
                        response.forecasts.swell.days[whichday].entries[start_time+1].directionText,
                        response.forecasts.swell.days[whichday].entries[start_time+2].directionText
                    ],
                    'wind_speeds' : [
                        response.forecasts.wind.days[whichday].entries[start_time].speed,
                        response.forecasts.wind.days[whichday].entries[start_time+1].speed,
                        response.forecasts.wind.days[whichday].entries[start_time+2].speed
                    ],
                    'ave_wind_speed': 0,
                    'wind_directions': [
                        response.forecasts.wind.days[whichday].entries[start_time].direction,
                        response.forecasts.wind.days[whichday].entries[start_time+1].direction,
                        response.forecasts.wind.days[whichday].entries[start_time+2].direction
                    ],
                    'ave_wind_direction' : 0,
                    'wind_direction_texts' : [
                        response.forecasts.wind.days[whichday].entries[start_time].directionText,
                        response.forecasts.wind.days[whichday].entries[start_time+1].directionText,
                        response.forecasts.wind.days[whichday].entries[start_time+2].directionText
                    ]
                }
            }
        }).done(function(response){
            //console.log('finished')
            gotData=true;
            console.log(data_selection);    
            //data.push(data_selection);  
        });
        
    };
            
        
        if (gotData===true){
            return data;
        } else return [];

}



getDataFromWW(ww_ids,moment());



// https://api.willyweather.com.au/v2/ZWZjODA2NGIyMGQxZThjYmZmNzE3Mz/search/closest.json?id=18919&weatherTypes=weather,wind,rainfall,sunrisesunset,moonphases,uv,tides,swell&units=distance:km
//});

