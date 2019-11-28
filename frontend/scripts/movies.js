//setup Movie table on the manage page

let movieID = 0;
function setupManageMovies(){
    $(document).ready( function () {
        let manageMoviesTable = $('#manageMoviesTable').DataTable({
            scrollY: 300,
            paging: false,
            stateSave: true,
            select: 'single',
            processing: true,
            "ajax":{
                "url":"http://flip1.engr.oregonstate.edu:2350/api/movies",
                "method":"GET",
                "dataSrc": function(data){
                    // replace null with "unknown" so column isn't blank
                    for(var i = 0; i < Object.keys(data).length; ++i){
                        if(data[i].genre == null){
                            data[i].genre = "unknown";
                        }
                    }
                    return data;
                }
            },
            columns: [
                {data: "movie_id"},
                {data: "name"},
                {data: "rating"},
                {data: "genre"},
                {data: "length"}
            ]
        });


    // var customerID = null; // make variable for selected customer ID
//ensure that clicked row is selected, de-select all others, set customerID with selected row
$('#manageMoviesTable tbody').on('click','tr', function(){
    if( $(this).hasClass('selected') ){
        $(this).removeClass('selected');
    }
    else{
        manageMoviesTable.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        movieID = manageMoviesTable.rows('.selected').data()[0].movie_id;
    }
    
    console.log(movieID); //testing
});

// pre-fill customer data into edit customer form
$('#editMovieModalBut').on('click', function(data){
    let url = 'http://flip1.engr.oregonstate.edu:2350/api/movies/' + movieID; //get URL for selected customer
    $.ajax({
        dataType:'json',
        "Content-Type": 'application/json',
        "method":'GET',
        "url": url,
        success: updateEditForm // data came back, prefill edit form
    });
    //ajax callback on sucess
    function updateEditForm(data){
        $('#EditMovieTitle').val(data.name);
        $('#EditMovieRating').val(data.rating);
        $('#EditMovieGenre').val(data.genre);
        $('#EditMovieRunTime').val(data.length);
    }
    });
});
}

// add new movie to DB
$(document).ready(function(){   
    $('#addMovieSubmitBut').on('click', function(data){

        console.log('you clicked submit!');// testing

            // fill variables with form data for ajax call
            let title = $('#AddMovieTitle').val();
            let rating = $('#AddMovieRating').val();
            let genre = $('#AddMovieGenre').val();
            let runtime = $('#AddMovieRunTime').val();
            let submitNewMovie = "{\"name\": \"" + title + " \", \"rating\": \"" + rating + "\", \"genre\": \"" + genre + "\", \"length\":" + runtime + "}";    
  


            // ajax callback and table refresh
            function wroteData(data){
                console.log("I worked!");
            
                let timeOut = setTimeout(reload, 1000); //wait for results to update on the backend before refresh

               function reload(){ // reload datatable after adding customer
                if(  $.fn.dataTable.isDataTable( '#manageMoviesTable' ) ){ // make sure table is active
                 console.log("table is alive here");
                   $('#manageMoviesTable').DataTable().ajax.reload();
                }
                else{
                 console.log("table is dead here");
                }
                return;
                }
            }

        $.ajax({ // send data to backend through POST
            'dataType': 'json',
            'crossDomain': true,
            "async": true,
            "method": 'POST',
            "url": 'http://flip1.engr.oregonstate.edu:2350/api/movies/',
            "Content-Type": 'application/json',
            "processData": false,
            "headers": {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
              },
            "data":  submitNewMovie,
            success: wroteData(data)
        })
    });

        // submit edited customer information
        $('#editMovieSubmitBut').on('click', function(data){
    
            console.log('you clicked submit!');// testing
    
            // fill variables with form data for ajax call
            let title = $('#EditMovieTitle').val();
            let rating = $('#EditMovieRating').val();
            let genre = $('#EditMovieGenre').val();
            let runtime = $('#EditMovieRunTime').val();
            // movieID is delcared above
            let submitUpdateMovie = "{\"movie_id\":" + movieID + ",\"name\": \"" + title + "\", \"rating\": \"" + rating + "\", \"genre\": \"" + genre + "\", \"length\":" + runtime + "}";
                
            // ajax callback and table refresh
                console.log(submitUpdateMovie);
    
            $.ajax({ // send data to backend through PATCH
                'dataType': 'json',
                'crossDomain': true,
                "async": true,
                "method": 'PATCH',
                "url": 'http://flip1.engr.oregonstate.edu:2350/api/movies/',
                // "Content-Type": 'application/json',
                "processData": false,
                "headers": {
                    "Content-Type": "application/json",
                    "cache-control": "no-cache",
                  },
                "data":  submitUpdateMovie,
                success: wroteData(data)
            })

            function wroteData(data){
                console.log("I worked!");
            
                let timeOut = setTimeout(reload, 1000); //wait for results to update on the backend before refresh

               function reload(){ // reload datatable after adding customer
                if(  $.fn.dataTable.isDataTable( '#manageMoviesTable' ) ){ // make sure table is active
                 console.log("table is alive here");
                   $('#manageMoviesTable').DataTable().ajax.reload();
                }
                else{
                 console.log("table is dead here");
                }
                return;
                }
            }
        });


     // delete selected room
     $('#deleteMovieSubmitBut').on('click', function(data){
      console.log('you clicked submit!');// testing
          let url =  'http://flip1.engr.oregonstate.edu:2350/api/movies/' + movieID;    
          // ajax callback and table refresh
          console.log(url);
          function wroteData(data){
              console.log("I worked!");
          
              let timeOut = setTimeout(reload, 1000); //wait for results to update on the backend before refresh
             function reload(){ // reload datatable after adding customer
              if(  $.fn.dataTable.isDataTable( '#manageMoviesTable' ) ){ // make sure table is active
               console.log("table is alive here");
                 $('#manageMoviesTable').DataTable().ajax.reload();
              }
              else{
               console.log("table is dead here");
              }
              return;
              }
          }
      $.ajax({ // send data to backend through PATCH
          'dataType': 'json',
          'crossDomain': true,
          "async": true,
          "method": 'DELETE',
          "url": url,
          // "Content-Type": 'application/json',
          "processData": false,
          "headers": {
              "Content-Type": "application/json",
              "cache-control": "no-cache",
            },
          success: wroteData(data)
      })
    });



});