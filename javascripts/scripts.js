
$(document).ready(function() {

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


});