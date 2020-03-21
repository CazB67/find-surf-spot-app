function setup_ww_api_call(location='',start_date=Date()){
    if (location!== ''){
        var searchlocn = location.replace(' ','+');
        var api_key= 'ZWZjODA2NGIyMGQxZThjYmZmNzE3Mz';
        var www_addr = 'http://api.willyweather.com.au/v2/';
        var middle_id = '/search.json?query=';
        var middle_data = '/locations/';

        var suffix_id = '&limit=1';
        var suffix_data = '/weather.json?forecasts=swell,wind,precis,temperature,weather&days=3&startDate=';
        var datestring = moment(start_date).format('YYYY-MM-DD');



        //https://api.willyweather.com.au/v2/ZWZjODA2NGIyMGQxZThjYmZmNzE3Mz/locations/18919/weather.json?forecasts=swell,wind,precis,temperature,weather&days=3&startDate=2020-03-21


        var queryURL = www_addr + api_key + middle_data + searchlocn + suffix_data + datestring;
        console.log(queryURL);
    }

    }

setup_ww_api_call('18919',Date());

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
                    location: 'Strictlands Bay',
                    ww_locn: 'Rottnest+Island',
                    ww_id: 0,
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
                    ww_id: ,
                    lat: ,
                    lng: ,
                    postcode: ''
                },
                {
                    location: 'Cables Artificial Reef',
                    ww_locn: 'Mosman+Beach',
                    ww_id: ,
                    lat: ,
                    lng: ,
                    postcode: ''
                },
                {
                    location: 'Hillarys Marina',
                    ww_locn: 'Hillarys Marina',
                    ww_id: 19546,
                    lat: -31.823,
                    lng:  115.733,
                    postcode: '6025'
                }
            }]

// https://api.willyweather.com.au/v2/ZWZjODA2NGIyMGQxZThjYmZmNzE3Mz/search/closest.json?id=18919&weatherTypes=weather,wind,rainfall,sunrisesunset,moonphases,uv,tides,swell&units=distance:km




