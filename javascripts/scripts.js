
$(document).ready(function() {

var glwhichDay=0; // Day to extract data for each timeslot,  0 =today, 1=tomorrow 
var glAbility='beginner';

    $(document).foundation();

    $("#search-btn").on("click", function() {
        var x = new Foundation.Reveal($("#exampleModal1"));
        x.open();
        //https://stackoverflow.com/questions/33855505/zurb-foundation-6-reveal-doesnt-work
        //$('#exampleModal1').foundation('reveal', 'open');
    });

    //Results on click event
    $(".results").on("click", function(event) {
        alert("Hi");
    });

    function getHourNow(){
        var hournow=moment().format('HH');
        return hournow;

    }

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

    }


    $('#when').on('change',function(event){
        var when = event.target.value;
        //console.log(when);
        var hrnow=getHourNow();
        var whichDayIndex= getWhichDayindex(hrnow,when);
        //console.log({whichDayIndex});      
        glwhichDay=whichDayIndex;


    });

    $('#ability').on('change',function(event){
        var thisAbility=event.target.value;
        glAbility=thisAbility;
        console.log(glAbility);
    })

});