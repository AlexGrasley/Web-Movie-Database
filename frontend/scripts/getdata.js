

var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://flip1.engr.oregonstate.edu:2350/api/movies/20",
    "method": "GET",
    "headers": {
      "Accept": "*/*",
      "Cache-Control": "no-cache",
      "Postman-Token": "515ab599-82d3-49be-92e4-fba6c1ba6074,9f8e22fd-38d7-4db8-8d15-ccad7102a03d",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "True"
    }
  }
  
  $.ajax(settings).done(function (response) {
    console.log(response);
    console.log("Does this message get there?");
  });


// set up movieTable
function setupMovies(){

    $(document).ready( function () {
        $('#moviesTable').DataTable({
            scrollY: 300,
            paging: false,
            stateSave: true,
            select: 'single',
            "ajax": {
                "url": "flip1.engr.oregonstate.edu:2350/api/movies/20",
                "method": "GET",
                "dataType": "json",
                "dataSrc": "movies",
                "Content-Type": "application/json",
                
            },
            "columns": [
                {"movies": "movie_id"},
                {"movies": "name"},
                {"movies": "rating"},
                {"movies": "genre"},
                {"movies": "length"}
            ]
        });
    });
    console.log("this should have data printed below");
    console.log(movies);
    }

// set up showings table
function setupShowings(){

    $(document).ready( function () {
        $('#showingsTable').DataTable({
            scrollY: 300,
            paging: false,
            stateSave: true,
            select: 'single',
            "ajax": {
                "url": "/getshowingsTable",
                "dataType": "json",
                "dataSrc": "showings",
                "Content-Type": "application/json"
            },
            "columns": [
                {"showings": "showing_id"},
                {"showings": "theater_name"},
                {"showings": "title"},
                {"showings": "rating"},
                {"showings": "genre"},
                {"showings": "length"}
            ]
        });
    });
}

// buy ticket using POST

function buyTicket(){
    //get buyTicket form's data into variable for ajax call
    var form = document.getElementById("buyTicketForm");
    var data = new FormData(form);

    $.ajax({
        type: "POST",
        url: "/buyTicket",
        data: data,
        cache: false,
    })

}