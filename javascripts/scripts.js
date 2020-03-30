
$(document).ready(function() {
    const ww_ids = [{
        location: 'Trigg Beach',
        ww_locn: 'Trigg+Beach',
        ww_id: 18919,
        lat: -31.877,
        lng: 115.751,
        postcode: '6029',
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
    },/* 
    {
        location: 'Mandurah',
        ww_locn: 'Mandurah',
        ww_id: 14422,
        lat: -32.533,
        lng: 115.733,
        postcode: '6210'
    }, */
    {
        location: 'Lancelin',
        ww_locn: 'Lancelin',
        ww_id: 14555,
        lat: -31.021,
        lng: 115.332,
        postcode: '6044'
    }, 
    {
        location: 'Alkimos Beach',
        ww_locn: 'Two+Rocks',
        ww_id: 14591,
        lat: -31.501,
        lng: 115.588,
        postcode: '6037'
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
        location: 'Cottesloe Reef',
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
        location: 'Leighton Beach',
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
        ww_locn: 'Hillarys+Marina',
        ww_id: 19546,
        lat: -31.823,
        lng:  115.733,
        postcode: '6025'
    }
    ];
const dummyLocations = [
    {
        location: 'Beginners Beach',
        ww_locn: 'Cottesloe Beach',
        ww_id: 0,
        lat: -31.823,
        lng:  115.733,
        postcode: '6025'
    },
    {
        location: 'Intermediate Beach',
        ww_locn: 'Scarborough Beach',
        ww_id: 0,
        lat: -31.823,
        lng:  115.733,
        postcode: '6025'
    },
    {
        location: 'Advanced Beach',
        ww_locn: 'Lancelin Beach',
        ww_id: 0,
        lat: -31.823,
        lng:  115.733,
        postcode: '6025'
    }
    ]

    var glwhichDay=0; // Day to extract data for each timeslot,  0 =today, 1=tomorrow 
    var glAbility='beginner';
    var glStartHr=6;
    var glData=[];
    var glSpotsData=[];

    var gldataReady=false;
    var haveSpots=false;
    var haveWarnings=false;
    var glWarningsData=[];

    var includeDummyData=true;

    $(document).foundation();
    

    //var elem = new Foundation.Tabs($('#results_tabs'));

    

    function updateGlobal(data){
        glData=data;
        //console.log('yay it worked');
        console.log(glData);
    };

    
    function getHourNow(){
        var hournow=moment().format('HH');
        return hournow;
    };

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

    function addDummyDataToDataset(dataObj){
        
        var dataset=dataObj;
        var newdata=getDummyData();
        dataset=dataset.concat(newdata);
        
        return dataset;    
    }

    // determines the list of surfable conditions
    function getSurfabilityArray(origDataObj,level) {
        
        var dataObj=origDataObj;

        /* if(includeDummyData === true){
            dataObj=addDummyDataToDataset(origDataObj);
        }; */

        console.log(dataObj);

        const unsurfable=1.5;  //waveheight
        const beginner_max = 2.0;
        const intermediate_max=4.0;
         
        var surfable=false;
        var surfableArray=[];
        var isWindOK=false;
        var isWindDirOK=false;
        var isSwellOK=true;
        // check wind direction (SW, S or W, NW above 15knots = 28km/hr means not surfable)
        $.each(dataObj,function(index){
            
            //Check wind direction
            var wind_directions=dataObj[index].wind_direction_texts;
            const poorwindsDirections=['S','SSW','SW','WSW','W'];

            if(poorwindsDirections.indexOf(wind_directions[0])<0 && poorwindsDirections.indexOf(wind_directions[1])<0 && poorwindsDirections.indexOf(wind_directions[2])<0){
                    isWindDirOK=true;
            };
            
            //Check wind speed (<15 knots or 27.78 km/hr)
            if (dataObj[index].wind_speeds[0]<28){
                isWindOK=true;
            };    

            //check swell max height(<1.5m means not surfable)
            //Maximum height depends on level
            var swell_height=dataObj[index].swell_heights[2];
            console.log({swell_height});
            if(swell_height<unsurfable){
                isSwellOK=false;
            } else if (level === 'beginner' && swell_height > beginner_max) {
                isSwellOK=false;
            } else if (level === 'intermediate' && swell_height > intermediate_max) {
                isSwellOK=false;
            } else {
                isSwellOK=true;
            };
            
            //Surfable assessment
            if(isWindDirOK && isWindOK && isSwellOK){
                surfable=true;
            } else surfable=false;
            surfableArray.push(surfable);
        })
        return surfableArray;
    };

    function getSurfSpotList(origDataObj){

        var dataObj=origDataObj;
        var beachdata=ww_ids;

        if(includeDummyData === true){
            dataObj=addDummyDataToDataset(origDataObj);
            beachdata=ww_ids.concat(dummyLocations);
        };

        var okspots=getSurfabilityArray(dataObj,glAbility);  //array of true/false values
        
        var spotsList=[];

        $.each(okspots,function(index){
            if (okspots[index]===true){            // data to be included 
                var dataRecordToInclude= dataObj[index];
                dataRecordToInclude.beach_name="";
                var theWWid=dataRecordToInclude.ww_id;  //get the data corresponding to the true/false element in okspots
                if(theWWid !==0){
                    var options = $.grep(beachdata,function(element,k){
                                        return element.ww_id===theWWid
                                    },false);
                        
                    for (var thisIndex=0; thisIndex<options.length; thisIndex++) {
                        var dataRecordToIncludeX= Object.assign({}, dataObj[index]);
                        dataRecordToIncludeX.beach_name="";                        
                        spotsList.unshift(dataRecordToIncludeX);
                        spotsList[0].beach_name=options[thisIndex].location;
                    };
                    
                } else { // dummydata with ww_id===0
                    spotsList.unshift(dataRecordToInclude);
                    spotsList[0].beach_name=spotsList[0].ww_name;
                };
   
            }
            
        })       
        
        spotsList= spotsList.sort(function(a,b){
            return a.beach_name - b.beach_name
        });

        return spotsList;
    };
    
    /* function orderList(unorderedObjectArray=[]){
        //this isn't working yet...

        var newlist=[{}];
        newlist= Object.assign({}, unorderedObjectArray);
        console.log({newlist});
        
       newlist.sort(function(a,b){
            return a.beach_name - b.beach_name
        });
        return newlist;
    }; */

    function hideCarousel(){

        $('#picture_carousel').addClass('hide');
    };

    function showCarousel(){
       $('#bottom').append("orbit");
    };

    function addGettingDataMsg(msgheader='Looking for your surf spot recommendations now', themsg="This shouldn't take too long. Thanks for waiting.") {

        var newpanel=$('#results_contents');

        var newmsghdr = $('<h5>');
        newmsghdr.attr('class','message_header')
        newmsghdr.text(msgheader);
        newpanel.append(newmsghdr);

        var newmsg = $('<p>');
        newmsg.attr('class','message_header')
        newmsg.text(themsg);
        newpanel.append(newmsg);

    }

    
    function getWarningsText(warnings){
        var warnings_text='';
        var warn_length=warnings.length;
        //console.log(warn_length);
        
        if (warnings.length===0) {
            warnings_text= 'No relevant warnings have been issued by the BOM.';
        } else if (warnings.length===1){
           warnings_text=warnings[0];
        } else {
            $.each(warnings,function(index){
                var thenum=index+1;
                var thetext='<h5 class="warnings_subheader">Warning ' + thenum + '</h5><p>' + warnings[index] + '<br></p>'
                warnings_text= warnings_text + thetext;
            });
        };

        return warnings_text;
    };


    function getTideTimesText (tidalData,whichTide='high'){
        var times='';
        var tides=tidalData[0];
        //console.log({tides});
        $.each(tides,function(index){
            if(tides[index].type===whichTide){
                times=times + formatTime(tides[index].dateTime,'LT') + '<br>';
            };
        });
        return times;
    };

    function renderSpotData (dataRecord, index, warnings){
        
        var warnings_text=getWarningsText(warnings);
        var low_tide_text=getTideTimesText(dataRecord.tides,'low');
        var high_tide_text=getTideTimesText(dataRecord.tides,'high');
        // console.log({dataRecord});
        // console.log({index});

        var newpanel=$('#results_contents');

        if (newpanel.length) newpanel.empty();
        

        var newcol=$('<div>');
        newcol.attr('class','medium-12 small-12 columns beach_head_block');
        newpanel.append(newcol);

        var newh = $('<h4>');
        newh.attr('class','beach_name')
        newh.prop('innerHTML', dataRecord.beach_name + '');
        newcol.append(newh);

        var newh = $('<h5>');
        newh.attr('class','warning_title')
        newh.prop('innerHTML', 'Weather warnings:' + '');
        newcol.append(newh);

        var newp = $('<p>');
        newp.attr('class','warning_text');
        newp.prop('innerHTML',warnings_text);
        newcol.append(newp);

        var newr= $('<div>');
        newr.attr('class','row_data');
        newr.attr('id','datarow_'+ index);
        newcol.append(newr);
        
        var newcol=$('<div>');
        newcol.attr('class','medium-12 small-12 columns results beach_data_block');
        newr.append(newcol);
        
        var newtable = $('<table>');
        newtable.attr('class','hover striped stack res_table');
        newtable.attr('id','tbl_l_'+ index);
        newcol.append(newtable);

        //Setup header for desired number of colums.  Header will not be shown.

        var newhead = $('<thead>');
        newtable.attr('class','results_table_header');
        newtable.append(newhead);

        var newtblcol= $('<th>');
        newtblcol.attr('class','results_table_header_col');
        newtblcol.attr('id','col1');
        newhead.append(newtblcol);
        var newtblcol= $('<th>');
        newtblcol.attr('class','results_table_header_col');
        newtblcol.attr('id','col2');
        newhead.append(newtblcol);
        var newtblcol= $('<th>');
        newtblcol.attr('class','results_table_header_col');
        newtblcol.attr('id','col3');
        newhead.append(newtblcol);
        var newtblcol= $('<th>');
        newtblcol.attr('class','results_table_header_col');
        newtblcol.attr('id','col4');
        newhead.append(newtblcol);

        
        // Setup body
        var newbody = $('<tbody>');
        newbody.attr('class','results_table_header');
        newtable.append(newbody);


        //Setup contents of body with the data
        var newtr=$('<tr>');
        newtr.attr('class','results_table_row');
        newbody.append(newtr);

        var newtd=$('<td>');
        newtd.attr('class','results_rownames');
        newtd.text('Summary:');
        newtr.append(newtd);

        var newtd=$('<td>');
        newtd.attr('class','results_rowdata results_rowdata_p');
        newtd.prop('innerHTML','<p>' + dataRecord.precis_texts + '</p>');
        newtr.append(newtd);

        var newtd=$('<td>');
        newtd.attr('class','results_rownames');
        newtd.text('Temperature:');
        newtr.append(newtd);

        var newtd=$('<td>');
        newtd.attr('class','results_rowdata results_rowdata_p');
        newtd.prop('innerHTML','<p>' + dataRecord.temperatures[1].toFixed(1) + ' °C </p>');
        newtr.append(newtd);

        var newtr=$('<tr>');
        newtr.attr('class','results_table_row');
        newbody.append(newtr);

        var newtd=$('<td>');
        newtd.attr('class','results_rownames');
        newtd.text('Swell direction:');
        newtr.append(newtd);

        var newtd=$('<td>');
        newtd.attr('class','results_rowdata results_rowdata_p');

        var uniqueData= unique(dataRecord.swell_direction_texts);
        var swell_text=getSwellTextSummary(uniqueData);
                    
        newtd.prop('innerHTML', '<p>' + swell_text + '</p>');
        newtr.append(newtd);

        var newtd=$('<td>');
        newtd.attr('class','results_rownames');
        newtd.text('UV Index:');
        newtr.append(newtd);

        var newtd=$('<td>');
        newtd.attr('class','results_rowdata results_rowdata_p');
        newtd.prop('innerHTML','<p>' + dataRecord.uv_texts[1] + '</p>');
        newtr.append(newtd);

        var newtr=$('<tr>');
        newtr.attr('class','results_table_row');
        newbody.append(newtr);

        var newtd=$('<td>');
        newtd.attr('class','results_rownames');
        newtd.text('Swell size:');
        newtr.append(newtd);

        var newtd=$('<td>');
        newtd.attr('class','results_rowdata results_rowdata_p');
        newtd.prop('innerHTML', '<p>' + dataRecord.swell_heights[1].toFixed(1)  + ' m </p>');
        newtr.append(newtd);

        var newtd=$('<td>');
        newtd.attr('class','results_rownames');
        newtd.text('High tide is at:');
        newtr.append(newtd);

        var newtd=$('<td>');
        newtd.attr('class','results_rowdata results_rowdata_p');
        newtd.prop('innerHTML','<p>'+ high_tide_text + '</p>');
        newtr.append(newtd);
        
        var newtr=$('<tr>');
        newtr.attr('class','results_table_row');
        newbody.append(newtr);

        var newtd=$('<td>');
        newtd.attr('class','results_rownames');
        newtd.text('Swell period:');
        newtr.append(newtd);

        //console.log(dataRecord.swell_periods[1]);
        var newtd=$('<td>');
        newtd.attr('class','results_rowdata results_rowdata_p');
        newtd.prop('innerHTML', '<p>' + dataRecord.swell_periods[1].toFixed(1)  + ' secs </p>');
        newtr.append(newtd);

        var newtd=$('<td>');
        newtd.attr('class','results_rownames');
        newtd.text('Low tide is at:');
        newtr.append(newtd);

        var newtd=$('<td>');
        newtd.attr('class','results_rowdata results_rowdata_p');
        newtd.prop('innerHTML','<p>'+ low_tide_text + '</p>');
        newtr.append(newtd);

        var newtr=$('<tr>');
        newtr.attr('class','results_table_row');
        newbody.append(newtr);
        
        var newtd=$('<td>');
        newtd.attr('class','results_rownames');
        newtd.text('Wind strength:');
        newtr.append(newtd);

        var newtd=$('<td>');
        var speedinkmphr=dataRecord.wind_speeds[1].toFixed(1);
        var speedInKnots = (speedinkmphr * 0.539957).toFixed(1);
        newtd.attr('class','results_rowdata results_rowdata_p');
        newtd.prop('innerHTML', '<p>' + speedInKnots  + ' knots </p>');
        newtr.append(newtd);

        var newtd=$('<td>');
        newtd.attr('class','results_rownames');
        newtd.text('Sunrise is at:');
        newtr.append(newtd);

        var newtd=$('<td>');
        newtd.attr('class','results_rowdata results_rowdata_p');
        newtd.prop('innerHTML','<p>'+ formatTime(dataRecord.sunrise) + '</p>');
        newtr.append(newtd);

        var newtr=$('<tr>');
        newtr.attr('class','results_table_row');
        newbody.append(newtr);

        var newtd=$('<td>');
        newtd.attr('class','results_rownames');
        newtd.text('Wind direction:');
        newtr.append(newtd);

        var uniqueData= unique(dataRecord.wind_direction_texts);
        var wind_text=getSwellTextSummary(uniqueData);

        var newtd=$('<td>');
        newtd.attr('class','results_rowdata results_rowdata_p');
        newtd.prop('innerHTML', '<p>' + wind_text  + '</p>');
        newtr.append(newtd);
        
        var newtd=$('<td>');
        newtd.attr('class','results_rownames');
        newtd.text('Sunset is at:');
        newtr.append(newtd);

        
        var newtd=$('<td>');
        newtd.attr('class','results_rowdata results_rowdata_p');
        newtd.prop('innerHTML','<p>'+ formatTime(dataRecord.sunset) + '</p>');
        newtr.append(newtd);
        
        //console.log(dataRecord.ww_name);
        try {
            addMap(dataRecord.ww_name);
        } catch (error) {
            showModal('Sorry','', "We can't load the map for you right now." )
        }
        
       
    };    


    function addMap (location){
        var map=$('#map_canvas');
        console.log(map.length);
        if (map.length) map.empty();

        //console.log(location);
        if(location==='Beginners Beach' || location === 'Intermediate Beach' || location === 'Advanced Beach') {location='Cottesloe Beach'};
        location=location.replace(' ','+');
        var newiframe= $('<iframe>');
        newiframe.attr('class','surfspotmap');
        newiframe.prop('width','400');
        newiframe.prop('height','300');
        newiframe.prop('frameborder','0');
        newiframe.prop('style','border:1');
        newiframe.attr('src','https://www.google.com/maps/embed/v1/search?key=AIzaSyBq3Iasy2twY_1xhq32EzbMbaaj9EK1AJk&q='+ location);
        map.append(newiframe);


    };

    function formatTime(timestring,formatWanted='LT'){
        return moment(timestring,'YYYY-MM-DD hh:mm:ss').format(formatWanted);
    }

    function unique(list){
        var result=[];
        $.each(list,function(j,e){
            if ($.inArray(e, result) == -1) result.push(e);
        });
        return result;
    };

    function getSwellTextSummary (swell_texts=[]){
        
        
        switch (swell_texts.length) {
            case 0:
                swell_text='';
                break;
            case 1: 
                swell_text=swell_texts[0];
                break;
            case 2: 
                swell_text='Changing from '+ swell_texts[0] + ' to ' +  swell_texts[1];
                break;
            case 3:
                swell_text='Changing from '+ swell_texts[0] + ' to ' +  swell_texts[1] + ' to ' +  swell_texts[2];
            case 'default':
                //this should never happen unless the api_script function is altered.
                break;
        }; 
        return swell_text;
    };



    function createList (dataObj,callback){

        //not tabs anymore
        var newTabObj=$('#results_list');
        if (newTabObj.length) newTabObj.empty();

        var newTabResultsObj=$('#results_contents');
        if (newTabResultsObj.length) newTabResultsObj.empty();

        $.each(dataObj,function(index){
 
            var newtab = $('<li>');
            newtab.attr('class','list-item');
            newtab.attr('id','listitem_'+ index.toString().padStart(2,0));
            newtab.attr('value',index);
            newTabObj.append(newtab);

            var newA = $('<a>');
           
            newA.prop('innerHTML', dataObj[index].beach_name);
            newA.attr('class','list-content');
            newA.attr('id','data_'+index.toString().padStart(2,0) + '_label');
            newtab.append(newA);
        });
        
        callback(dataObj);

    };

    function updateSpotGlobal(spotsList){
        glSpotsData=spotsList;
    }


    function renderList(dataObj){
        
        createList(dataObj,updateSpotGlobal);
        hideCarousel();

    };

    $("#search-btn").on("click", function() {
        //showModal('Test', 'Nothing much','just seeing if this works...');
        
        addGettingDataMsg();
        hideCarousel();

        var wwtimerObj;
        var datareadyObj;
        var spotsListReadyObj;

        
        
        function checkForData(){
            var recs_received=glData.length;
            var recs_expected=9;
            

            if (recs_received<1) {
                return;
            }; 
            if (recs_received<recs_expected) {
                //console.log('Records received: ' + recs_received);
            } else if (recs_received===10){
                gldataReady=true;
                //console.log('Have All Data');
                //console.log(glData);
                clearInterval(wwtimerObj);
            }
        };
        
        function prepareData(){
            
            if (gldataReady===false){
                return;
            };
            clearInterval(datareadyObj);

            var spotsList=getSurfSpotList(glData);
            
            renderList(spotsList);
            
            return spotsList;  //check if beach ww_id is in the data structure
        };
        

        function processWarnings(data){
          
            //console.log({data});
            var filteredWarnings=filterWarnings(data);
            
            haveWarnings=true;
            glWarningsData=filteredWarnings;
            return filteredWarnings;
        }

        function getFilteredList (okIDs=[],dataObj){
            var filteredList=[];

            $.each(okIDs,function(index){
                if(okIDs[index]===true){
                    filteredList.push(dataObj[index])
                }
            });
            return filteredList;
        }

        function checkSpotsGlobal(){
            if (glSpotsData.length>0) {
                haveSpots=true;
                clearInterval(spotsListReadyObj);    
            
            };
        };
        var map=$('#map_canvas');
        if (map.length) map.empty();
        //Gets the data from the WW API and puts it into the global variable
        getDataFromWW(ww_ids,moment(),glwhichDay,glStartHr,updateGlobal);
        glWarningsData= getWarningsData(processWarnings); 
        
        //Checks whether any data has been received in the global variable
        wwtimerObj=setInterval(function () {
            checkForData()
        },200);

        //Checks whether all the data is ready for assessment
        datareadyObj=setInterval(function(){
            prepareData()
        },200);

        spotsListReadyObj=setInterval(function(){
            checkSpotsGlobal();
        },200);
    });

    function showModal(titleText='Oops',subtitle='', msgText='something went wrong'){
        
        
        $('#modal-title').prop('innerHTML',titleText);
        $('#modal-subtitle').prop('innerHTML','');
        $('#modal-body-text').prop('innerHTML',msgText);
        var x = new Foundation.Reveal($("#exampleModal1"));
        x.open();
        
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


    $('#results_list').on('click',function(event){

        
        //console.log(event.target.id);
        
        var theindex=parseInt(event.target.id.substring(5,7));
        //console.log(theindex);
        var warnings=[];

        var whichBeach= glSpotsData[theindex].ww_id;
        //console.log(glSpotsData[theindex]);
        if (glWarningsData!== undefined){ 
            if(whichBeach===14555){
                warnings=glWarningsData.LancelinWarnings;
                
            } else {
                warnings=glWarningsData.PerthWarnings;
            }
            
        };
        var whichdata=glSpotsData[theindex];
        //console.log(haveSpots);
        if (haveSpots===true) {
            renderSpotData(whichdata,theindex,warnings);
        };
        
    });


    $('#ability').on('change',function(event){
        var thisAbility=event.target.value;
        glAbility=thisAbility;
        //console.log(glAbility);
    })

});