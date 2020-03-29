
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
    },/* 
    {
        location: 'Alkimos',
        ww_locn: 'Alkimos',
        ww_id: 14507,
        lat: -31.609,
        lng: 115.691,
        postcode: '6038'
    }, */
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
        ww_locn: 'Hillarys Marina',
        ww_id: 19546,
        lat: -31.823,
        lng:  115.733,
        postcode: '6025'
    }
    ];

    var glwhichDay=0; // Day to extract data for each timeslot,  0 =today, 1=tomorrow 
    var glAbility='beginner';
    var glStartHr=6;
    var glData=[];

    var gldataReady=false;

    $(document).foundation();
    

    var elem = new Foundation.Tabs($('#results_tabs'));

    

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

        var unsurfable=1.0;
        var surfable=false;
        var surfableArray=[];
        var isWindOK=false;
        var isWindDirOK=false;
        var isSwellOK=false;
        // check wind direction (SW, S or W, NW above 15knots = 28km/hr means not surfable)
        $.each(dataObj,function(index){
            
            //Check wind direction
            var wind_directions=dataObj[index].wind_direction_texts;
            const poorwindsDirections=['S'];
            //['S','SSW','SW','WSW','W'];

            if(poorwindsDirections.indexOf(wind_directions[0])<0 && poorwindsDirections.indexOf(wind_directions[1])<0 && poorwindsDirections.indexOf(wind_directions[2])<0){
                    isWindDirOK=true;
            };
            
            //Check wind speed
            if (dataObj[index].wind_speeds[0]<28){
                isWindOK=true;
            };          

            //check swell max height(<1.5m means not surfable)
            if(dataObj[index].swell_heights[2]>unsurfable){
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
        var spotsList=[];
        //console.log({okspots});
        //console.log({dataObj});
       // console.log({ww_ids});

        $.each(okspots,function(index){
            if (okspots[index]===true){
                var theWWid=dataObj[index].ww_id;
                console.log({theWWid});

                $.each(ww_ids,function(i){
                    console.log({i});
                    
                    if (ww_ids[i].ww_id === theWWid){
                        //add data - matching id found
                        var newData=dataObj[index];
                        var newname=ww_ids[i].location;
                        console.log(newData);
                        console.log(newname);
                        //console.log ('Old name=' + newData.ww_name);
                        //console.log('New name: ' + ww_ids[i].location);

                        newData.new_name= newname;

                        spotsList.push(newData);
                        
                    };
                }) 
    
            }
            
        })
        return spotsList;
    }
    

    function getDesiredSurfSpotInfo (){
        //join with the actual beaches
    }



    function createTabInfo (dataRecord, index, callback){

        var newdiv=$('<div>');
        newdiv.attr('class','tabs-content');
        newdiv.attr('data-tabs-content','results_tabs');
        $('#datatab_'+index).append(newdiv);

        var newpanel= $('<div>');
        newpanel.attr('class','abs-panel is-active');
        newpanel.attr('id','panel_'+ index);
        newdiv.append(newpanel);

        var newrow = $('<div>');
        newdiv.append(newrow);

        var newcol=$('<div>');
        newcol.attr('class','medium-12 small-12 columns');
        newrow.append(newcol);

        var newh = $('<h5>');
        newh.prop('innerHTML', dataRecord.new_name + '<br>');
        newrow.append(newh);
            
       
        console.log('done with tabs');

        

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


    function createAllTabs (dataObj){

        
        var newTabObj=$('#results_tabs');
        if (newTabObj.length) newTabObj.empty();

        var newTabResultsObj=$('#results_tab_contents');
        if (newTabResultsObj.length) newTabResultsObj.empty();

        

        $.each(dataObj,function(index){

            //<li class="tabs-title is-active">
                //<a href="#panel1" aria-selected="true">Scarborough Beach</a></li>
            var newtab = $('<li>');
            newtab.attr('class','tab-title');
            newtab.attr('id','datatab_'+ index);
            newTabObj.append(newtab);

            var newA = $('<a>');
            newA.attr('href','#panel'+ index);
            newA.prop('innerHTML', dataObj[index].ww_name);
            newA.attr('data-options','deep_linking:true');
            //newA.attr('class','tabs-title-text');
            //newA.attr('role','tab');
            //newA.attr('id','datatab_'+index + '_label');
            //newA.attr('aria-selected','false');
            newtab.append(newA);
        });
        
       
        $.each(dataObj,function(index){
            
            var newpanel= $('<div>');
            newpanel.attr('class','content tabs-panel_header');
            newpanel.attr('id','panel'+ index);
            $('#results_tab_contents').append(newpanel);

            var newcol=$('<div>');
            newcol.attr('class','medium-12 small-12 columns beach_head_block');
            newpanel.append(newcol);

            var newh = $('<h4>');
            newh.attr('class','beach_name')
            newh.prop('innerHTML', dataObj[index].new_name + '');
            newcol.append(newh);

            var newh = $('<h5>');
            newh.attr('class','warning_title')
            newh.prop('innerHTML', 'Weather warnings:' + '');
            newcol.append(newh);

            var newp = $('<p>');
            newp.attr('class','warning_text');
            newp.text('No weather warnings currently in place');
            newcol.append(newp);

            var newr= $('<div>');
            newr.attr('class','row_data');
            newr.attr('id','datarow_'+ index);
            newcol.append(newr);
            
            var newcol=$('<div>');
            newcol.attr('class','medium-6 small-12 columns results beach_data_block');
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
            newtd.prop('innerHTML','<p>' + dataObj[index].precis_texts + '</p>');
            newtr.append(newtd);

            var newtd=$('<td>');
            newtd.attr('class','results_rownames');
            newtd.text('Temperature:');
            newtr.append(newtd);

            var newtd=$('<td>');
            newtd.attr('class','results_rowdata results_rowdata_p');
            newtd.prop('innerHTML','<p>' + dataObj[index].temperatures[1].toFixed(1) + ' °C </p>');
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

            var uniqueData= unique(dataObj[index].swell_direction_texts);
            var swell_text=getSwellTextSummary(uniqueData);
                       
            newtd.prop('innerHTML', '<p>' + swell_text + '</p>');
            newtr.append(newtd);

            var newtd=$('<td>');
            newtd.attr('class','results_rownames');
            newtd.text('UV Index:');
            newtr.append(newtd);

            var newtd=$('<td>');
            newtd.attr('class','results_rowdata results_rowdata_p');
            newtd.prop('innerHTML','<p>' + dataObj[index].uv_texts[1] + '</p>');
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
            newtd.prop('innerHTML', '<p>' + dataObj[index].swell_heights[1].toFixed(1)  + ' m </p>');
            newtr.append(newtd);

            var newtd=$('<td>');
            newtd.attr('class','results_rownames');
            newtd.text('High tide is at:');
            newtr.append(newtd);

            var newtd=$('<td>');
            newtd.attr('class','results_rowdata results_rowdata_p');
            newtd.prop('innerHTML','<p>'+ '</p>');
            newtr.append(newtd);
            
            var newtr=$('<tr>');
            newtr.attr('class','results_table_row');
            newbody.append(newtr);

            var newtd=$('<td>');
            newtd.attr('class','results_rownames');
            newtd.text('Swell period:');
            newtr.append(newtd);

            console.log(dataObj[index].swell_periods[1]);
            var newtd=$('<td>');
            newtd.attr('class','results_rowdata results_rowdata_p');
            newtd.prop('innerHTML', '<p>' + dataObj[index].swell_periods[1].toFixed(1)  + ' secs </p>');
            newtr.append(newtd);

            var newtd=$('<td>');
            newtd.attr('class','results_rownames');
            newtd.text('Low tide is at:');
            newtr.append(newtd);

            var newtd=$('<td>');
            newtd.attr('class','results_rowdata results_rowdata_p');
            newtd.prop('innerHTML','<p>'+ '</p>');
            newtr.append(newtd);

            var newtr=$('<tr>');
            newtr.attr('class','results_table_row');
            newbody.append(newtr);
            
            var newtd=$('<td>');
            newtd.attr('class','results_rownames');
            newtd.text('Wind strength');
            newtr.append(newtd);

            var newtd=$('<td>');
            newtd.attr('class','results_rowdata results_rowdata_p');
            newtd.prop('innerHTML', '<p>' + dataObj[index].wind_speeds[1].toFixed(1)  + '</p>');
            newtr.append(newtd);

            var newtd=$('<td>');
            newtd.attr('class','results_rownames');
            newtd.text('Sunrise is at:');
            newtr.append(newtd);

            var newtd=$('<td>');
            newtd.attr('class','results_rowdata results_rowdata_p');
            newtd.prop('innerHTML','<p>'+dataObj[index].sunrise + '</p>');
            newtr.append(newtd);

            var newtr=$('<tr>');
            newtr.attr('class','results_table_row');
            newbody.append(newtr);

            var newtd=$('<td>');
            newtd.attr('class','results_rownames');
            newtd.text('Wind direction:');
            newtr.append(newtd);

            var uniqueData= unique(dataObj[index].wind_direction_texts);
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
            newtd.prop('innerHTML','<p>'+ dataObj[index].sunset + '</p>');
            newtr.append(newtd);
            
        });
        elem = new Foundation.Tabs($('#results_tabs'));
        $('.tabs').foundation();
    }


    function renderData(dataObj){
        
        createAllTabs(dataObj);


    };





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
        
        function prepareData(callback){
            var filteredData=[];
            if (gldataReady===false){
                return;
            };
            clearInterval(datareadyObj);
            var spotsList=getSurfSpotList(glData);
            console.log({spotsList});
            //filteredData=getFilteredList(okIDs,glData);
            renderData(spotsList);

            console.log('the tabs should be created!');
            return spotsList;  //check if beach ww_id is in the data structure
        };
        

        function getFilteredList (okIDs=[],dataObj){
            var filteredList=[];

            $.each(okIDs,function(index){
                if(okIDs[index]===true){
                    filteredList.push(dataObj[index])
                }
            });
            return filteredList;
        }


        
        //Gets the data from the WW API and puts it into the global variable
        getDataFromWW(ww_ids,moment(),glwhichDay,glStartHr,updateGlobal);
        var warnings=getWarningsData(gotWarnings); 
        
        //Checks whether any data has been received in the global variable
        wwtimerObj=setInterval(function () {
            checkForData(renderData)
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


//$('#results_tabs').foundation('selectTab',elem,historyHandled);


   /*  $('#results_tab').foundation('selectTab', function (event, tab) {
        console.log('selected a tab');
        
    }); */

    $(document).on('change.zf.tabs', "#results_tab", function(){
        console.log('change done');
    }); 
      


    $('#ability').on('change',function(event){
        var thisAbility=event.target.value;
        glAbility=thisAbility;
        //console.log(glAbility);
    })

});