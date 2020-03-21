function setup_ww_api_call(location=''){
    if (location!== ''){
        var api_key= 'ZWZjODA2NGIyMGQxZThjYmZmNzE3Mz';
        var www_addr = 'http://api.willyweather.com.au/v2/';
        var middle = '/search.json?query=';
        var suffix = '&limit=1'


        var queryURL = www_addr + api_key + middle + location + suffix;
        console.log(queryURL);
    }

    }

setup_ww_api_call('Cottesloe+Beach');


