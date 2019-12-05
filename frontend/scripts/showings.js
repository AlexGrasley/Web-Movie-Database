///////////////////////////////
//region Manage Customers
// set up manage customer table and provide functions that interact with the table
///////////////////////////////

let showingID = 0; // make variable for selected showing ID
let showingstheaterID = 0;
let showingsmovieName = "";
let showingsroomID = 0;

function setupManageShowings(){
    $(document).ready( function () {
      var manageShowingsTable = $('#manageShowingsTable').DataTable({
            scrollY: 300,
            paging: false,
            stateSave: true,
            select: 'single',
            rowCallback: function(row,data){
                var data = $(row).data();
            },
            processing: true,
            "ajax":{
                "url":'http://flip1.engr.oregonstate.edu:2350/api/showings/detailed/',
                "method":'GET',
                headers:{
                    
                },
                "dataSrc": ''
            },
            columns: [
                {data: 'showing_id'},
                {data: 'time'},
                {data: 'room_id'},
                {data: 'movie_name'},
                {data: 'theater_name'},
                {data: 'theater_id'},
            ]
        });

// var customerID = null; // make variable for selected customer ID
//ensure that clicked row is selected, de-select all others, set customerID with selected row
$('#manageShowingsTable tbody').on('click','tr', function(){
            if( $(this).hasClass('selected') ){
                $(this).removeClass('selected');
            }
            else{
                manageShowingsTable.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


            showingID = manageShowingsTable.rows('.selected').data()[0].showing_id;
            showingsmovieName = manageShowingsTable.rows('.selected').data()[0].movie_name;
            showingstheaterID = manageShowingsTable.rows('.selected').data()[0].theater_id;
            showingsroomID = manageShowingsTable.rows('.selected').data()[0].room_id;
            
            
            console.log(showingID, showingsmovieID, showingstheaterID, showingsroomID); //testing
        });

                   // pre-fill customer data into edit customer form
                   $('#editShowingsBut').on('click', function(data){
                    let url = 'http://flip1.engr.oregonstate.edu:2350/api/showings/' + showingID; //get URL for selected showing
                    $.ajax({// get selected room information back
                        dataType:'json',
                        "Content-Type": 'application/json',
                        "method":'GET',
                        headers:{

                        },
                        "url": url,
                        success: updateEditForm // data came back, prefill edit form
                    });
                    let theaterSelectList = $.ajax({
                        dataType : 'json',
                        "Content-Type": 'application/json',
                        method: 'GET',
                        headers:{
                            
                        },
                        url: 'http://flip1.engr.oregonstate.edu:2350/api/theaters',
                        success: fillTheaterList
                    });


                    function fillTheaterList(data){
                        let selectList = $('#EditShowingTheaterSelect');
                        $.each(data, function(index, value){
                            if(data[index].theater_id === showingstheaterID){
                                selectList.append('<option value= "' + data[index].theater_id + '" selected = "selected">' + data[index].name + ' </option>')
                            }
                            else{
                                selectList.append('<option value= "' + data[index].theater_id + '">' + data[index].name + ' </option>')
                            }
                        });
                    }

                    $.ajax({
                        dataType : 'json',
                        "Content-Type": 'application/json',
                        method: 'GET',
                        headers:{
                            
                        },
                        url: 'http://flip1.engr.oregonstate.edu:2350/api/rooms/' + showingsroomID,
                        success: fillRoomList
                    });

                    function fillRoomList(data){
                        let selectList = $('#EditShowingRoomSelect');
                        selectList.empty();
                        // for(let index = 0; index < Object.keys(data).length; ++index){
                        //     if(data[index].room_id === showingsroomID){
                        //         console.log(data[index].room_id, showingsroomID, index);
                                selectList.append('<option value= "' + data.room_id + '" id="' + data.theater_id + '" selected = "selected">' + 'Room:'+ data.room_id + ' Cap: ' + data.capacity + ' </option>');
                        //     }
                        //     else {
                        //         selectList.append('<option value= "' + data[index].room_id + '" id="' + data[index].theater_id + '">' + 'Room:'+ data[index].room_id + ' Cap: ' + data[index].capacity + ' </option>');
                        //     }
                        // }
                    }

                    
                    $.ajax({
                        dataType : 'json',
                        "Content-Type": 'application/json',
                        method: 'GET',
                        headers:{
                            
                        },
                        url: 'http://flip1.engr.oregonstate.edu:2350/api/movies',
                        success: fillMovieList
                    });

                    function fillMovieList(data){
                        let selectList = $('#EditShowingMovieSelect');
                        $.each(data, function(index, value){
                            if(data[index].movie_name == showingsmovieName){
                                selectList.append('<option value= "' + data[index].movie_id + '" selected = "selected">' + data[index].name + ' </option>')
                            }
                            else{
                                selectList.append('<option value= "' + data[index].movie_id + '">' + data[index].name + ' </option>')
                            }
                        });
                    }


                    //ajax callback on sucess to fill form with selected room info
                    function updateEditForm(data){
                        $('#EditShowingTheaterSelect').val(data.theater_id);
                        $('#EditShowingMovieSelect').val(data.movie_id);
                        $('#EditShowingRoomSelect').val(data.room_id);
                        $('#EditShowingTime').val(data.time);
                    }
                });



                $('#addShowingBut').on('click', function(data){
                    $.ajax({
                        dataType : 'json',
                        "Content-Type": 'application/json',
                        method: 'GET',
                        headers:{
                            
                        },
                        url: 'http://flip1.engr.oregonstate.edu:2350/api/theaters',
                        success: fillTheaterList
                    });

                    let $theaterSelect = $('#AddShowingTheaterSelect');
                    let $roomSelect = $('#AddShowingRoomSelect');
                    let $options = $roomSelect.find('option');

                    function fillTheaterList(data){
                        let selectList = $('#AddShowingTheaterSelect');
                        $.each(data, function(index, value){
                            if(data[index].theater_id === showingstheaterID){
                                selectList.append('<option value= "' + data[index].theater_id + '" selected = "selected">' + data[index].name + ' </option>')
                            }
                            else{
                                selectList.append('<option value= "' + data[index].theater_id + '">' + data[index].name + ' </option>')
                            }
                        });
                    }

                    $.ajax({
                        dataType : 'json',
                        "Content-Type": 'application/json',
                        method: 'GET',
                        url: 'http://flip1.engr.oregonstate.edu:2350/api/rooms',
                        success: fillRoomList
                    });

                    // function fillRoomList(){
                    //     console.log('ajax came back');
                    // }
                    function fillRoomList(data){
                        let selectList = $('#AddShowingRoomSelect');
                        $.each(data, function(index, value){
                                selectList.append('<option value= "' + data[index].room_id + '" id="' + data[index].theater_id + '">' + 'Room:'+ data[index].room_id + ' Cap: ' + data[index].capacity + ' </option>');
                        });
                    }


                    $.ajax({
                        dataType : 'json',
                        "Content-Type": 'application/json',
                        method: 'GET',
                        headers:{
                            
                        },
                        url: 'http://flip1.engr.oregonstate.edu:2350/api/movies',
                        success: fillMovieList
                    });

                    function fillMovieList(data){
                        let selectList = $('#AddShowingMovieSelect');
                        $.each(data, function(index, value){
                            if(data[index].movie_name == showingsmovieName){
                                selectList.append('<option value= "' + data[index].movie_id + '" selected = "selected">' + data[index].name + ' </option>')
                            }
                            else{
                                selectList.append('<option value= "' + data[index].movie_id + '">' + data[index].name + ' </option>')
                            }
                        });
                    }

                    
                });

    });
}


$(document).ready(function(){
let $theaterSelect = $('#EditShowingTheaterSelect');
                
$theaterSelect.on('change', function(){
    let selectedID = this.value;

    $.ajax({
        dataType : 'json',
        "Content-Type": 'application/json',
        method: 'GET',
        headers:{
            
        },
        url: 'http://flip1.engr.oregonstate.edu:2350/api/rooms',
        success: fillRoomList
    });

    function fillRoomList(data){
        let selectList = $('#EditShowingRoomSelect');
        selectList.empty();
        for(let index = 0; index < Object.keys(data).length; ++index){
            if(data[index].theater_id == selectedID){
                selectList.append('<option value= "' + data[index].room_id + '" id="' + data[index].theater_id + '">' + 'Room: '+ data[index].room_id + ' Cap: ' + data[index].capacity + ' </option>');
            }
        }
    }
    
}).trigger('change');
});


$(document).ready(function(){
    let $theaterSelect = $('#AddShowingTheaterSelect');
                    
    $theaterSelect.on('change', function(){
        let selectedID = this.value;
    
        $.ajax({
            dataType : 'json',
            "Content-Type": 'application/json',
            method: 'GET',
            headers:{
                
            },
            url: 'http://flip1.engr.oregonstate.edu:2350/api/rooms',
            success: fillRoomList
        });
    
        function fillRoomList(data){
            let selectList = $('#AddShowingRoomSelect');
            selectList.empty();
            for(let index = 0; index < Object.keys(data).length; ++index){
                if(data[index].theater_id == selectedID){
                    selectList.append('<option value= "' + data[index].room_id + '" id="' + data[index].theater_id + '">' + 'Room: '+ data[index].room_id + ' Cap: ' + data[index].capacity + ' </option>');
                }
            }
        }
        
    }).trigger('change');
    
    });

// add new customer to DB
 $(document).ready(function(){   
    $('#AddShowingSubmitBut').on('click', function(data){

        console.log('you clicked submit!');// testing

            // fill variables with form data for ajax call
            let time = $('#AddShowingTime').val();
            let roomID = $('#AddShowingRoomSelect').val();
            let movieID = $('#AddShowingMovieSelect').val();
            let submitNewShowing = "{\"time\":\""  + time + "\", \"movie_id\":"  + movieID + ", \"room_id\":" + roomID + "}";    
  
            console.log(submitNewShowing);

            // ajax callback and table refresh
            function wroteData(data){
                console.log("I worked!");
            
                let timeOut = setTimeout(reload, 1000); //wait for results to update on the backend before refresh

               function reload(){ // reload datatable after adding customer
                if(  $.fn.dataTable.isDataTable( '#manageShowingsTable' ) ){ // make sure table is active
                 console.log("table is alive here");
                   $('#manageShowingsTable').DataTable().ajax.reload();
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
            "url": 'http://flip1.engr.oregonstate.edu:2350/api/showings/',
            "Content-Type": 'application/json',
            "processData": false,
            "headers": {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
              },
            "data":  submitNewShowing,
            success: wroteData(data)
        })
    });

        // submit edited customer information
        $('#EditShowingSubmitBut').on('click', function(data){
    
            console.log('you clicked submit!');// testing
    
            let time = $('#EditShowingTime').val();
            let roomID = $('#EditShowingRoomSelect').val();
            let movieID = $('#EditShowingMovieSelect').val();
            //let showingID is declared above
            let submitUpdateShowing = "{\"showing_id\":" + showingID + ",  \"time\":\""  + time + "\", \"movie_id\":"  + movieID + ", \"room_id\":" + roomID + "}";
                
            // ajax callback and table refresh
                console.log(submitUpdateShowing);
    
            $.ajax({ // send data to backend through PATCH
                'dataType': 'json',
                'crossDomain': true,
                "async": true,
                "method": 'PATCH',
                "url": 'http://flip1.engr.oregonstate.edu:2350/api/showings/',
                // "Content-Type": 'application/json',
                "processData": false,
                "headers": {
                    "Content-Type": "application/json",
                    "cache-control": "no-cache",
                  },
                "data":  submitUpdateShowing,
                success: wroteData(data)
            })

            function wroteData(data){
                console.log("I worked!");
            
                let timeOut = setTimeout(reload, 1000); //wait for results to update on the backend before refresh

               function reload(){ // reload datatable after adding customer
                if(  $.fn.dataTable.isDataTable( '#manageShowingsTable' ) ){ // make sure table is active
                 console.log("table is alive here");
                   $('#manageShowingsTable').DataTable().ajax.reload();
                }
                else{
                 console.log("table is dead here");
                }
                return;
                }
            }
        });


     // delete selected room
     $('#deleteShowingSubmitBut').on('click', function(data){
      console.log('you clicked submit!');// testing
          let url =  'http://flip1.engr.oregonstate.edu:2350/api/showings/' + showingID;    
          // ajax callback and table refresh
          console.log(url);
          function wroteData(data){
              console.log("I worked!");
          
              let timeOut = setTimeout(reload, 1000); //wait for results to update on the backend before refresh
             function reload(){ // reload datatable after adding customer
              if(  $.fn.dataTable.isDataTable( '#manageShowingsTable' ) ){ // make sure table is active
               console.log("table is alive here");
                 $('#manageShowingsTable').DataTable().ajax.reload();
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

//////////////////////
//end region manage customers
//////////////////////