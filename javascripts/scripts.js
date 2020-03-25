
$(document).ready(function() {

   // $(document).foundation();  //don't delete.  Won't work without this statement.

    function showAlert(headerText='Warning', bodytext='Oops - something strange happened',type='warning',code){
       console.log('show alert function');
        // $('#alertmodal').attr('class','alert alert-'+ type);
        $('#alert-heading').prop('innerHTML',headerText);
        $('#alert-text').prop('innerHTML',bodytext);
        
        $('#alertmodal').foundation('open');
    }
    
    function hideAlert(){
        console.log('hiding alert');
        $('#alertmodal').foundation('close');
    }



    //Search button on click event
    $("#search-btn").on("click", function(){

       showAlert('hi there', 'just an example','warning','code');
       console.log( $("#post-code").val());
       console.log( $("#ability").val());
       console.log( $("#when").val());
       console.log( $("#distance").val());

       //If users don't type in post code it shows up as an empty string 
       if( $("#post-code").val() === ""){
        alert("Hi");
       }
      
    });

    $('#alertCloseBtn').on('click',function(){
        hideAlert();
    })

    //Results on click event
    $(".results").on("click", function(event){
        alert("Hi");
    });






});



/* 
1. Capture the user entries
2. Change user entry for time to be 6-9am, 11am-2pm, 3-6pm over next 24 hours  (Caroline)
3. Request geolocation. If not provided then no sorting of results  (miles)
4. Build a modal error/alert box. (Jo)
 - tell user if no locations found
    - ask user if they want to see all locations. If no, then do nothing. (Tell user to change inputs)
     IF yes, then user sees all possible spots with their weather conditions.
 - if responses are slow, show user that the program is fetching data
Modal behaviour: close button in all cases

5. Create the calls to the WW API and retrieve data  - find solution to CORS error (jo)

6. Extract the required data from the big response (filter based on user conditions and required info)
    Extract following data:
        - sunrise/sunset: first light date/time & last light date/time
        - forecast swell: direction text, height, period, date/time
        - wind: direction text, speed, date/time
        - tide: time, type
        - weather warnings (BOM)

6b.     Build or adapt the html      

7. Determine what the data means about surfing conditions at each beach. (Check against desired conditions)
    Too complicated for now.  Maybe just filter based on time of year/ average swell size over 3 hour window. Using 
    
8.Filter the results based on user entries

9Provide order list of suitable beaches within travel distance in order of travel distance

10 On click event for more details on each beach

11 Render the details for each beach including a map  (Miles)
12 API call to google maps when a beach is selected  (Miles)
13 Sort out order of file links that are loaded  (Caroline)
14 Adjust modal to suit foundation  (Jo)

15. Put this into Kanban  (Miles)









*/