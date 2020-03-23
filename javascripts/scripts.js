
$(document).ready(function() {

    $(document).foundation();

    //Search button on click event
    $("#search-btn").on("click", function(){
       console.log( $("#post-code").val());
       console.log( $("#ability").val());
       console.log( $("#when").val());
       console.log( $("#distance").val());

       //If users don't type in post code it shows up as an empty string 
       if( $("#post-code").val() === ""){
        alert("Hi");
       }
      
    });

    //Results on click event
    $(".results").on("click", function(event){
        alert("Hi");
    });


});