///////////////////////////////
//region Manage Customers
// set up manage customer table and provide functions that interact with the table
///////////////////////////////

// let showingID = null; // make variable for selected showing ID
// let showingstheaterID = null;
// let showingsmovieID = null;
// let showingsroomID = null;

function setupManageTickets(){
    $(document).ready( function () {
      var manageTicketsTable = $('#manageTicketsTable').DataTable({
            scrollY: 300,
            paging: false,
            stateSave: true,
            select: 'single',
            rowCallback: function(row,data){
                var data = $(row).data();
            },
            processing: true,
            "ajax":{
                "url":'http://flip1.engr.oregonstate.edu:2350/api/tickets/detailed/',
                "method":'GET',
                "dataSrc": ''
            },
            columns: [
                {data: 'ticket_id'},
                {data: 'room_id'},
                {data: 'movie_name'},
                {data: 'customer_name'},
                {data: 'showtime'},
                {data: 'price'}
            ]
        });

// var customerID = null; // make variable for selected customer ID
//ensure that clicked row is selected, de-select all others, set customerID with selected row
$('#manageTicketsTable tbody').on('click','tr', function(){
            if( $(this).hasClass('selected') ){
                $(this).removeClass('selected');
            }
            else{
                manageTicketsTable.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
            showingID = manageTicketsTable.rows('.selected').data()[0].showing_id;
            showingstheaterID = manageTicketsTable.rows('.selected').data()[0].theater_name;
            showingsmovieID = manageTicketsTable.rows('.selected').data()[0].movie_name;
            showingsroomID = manageTicketsTable.rows('.selected').data()[0].room_id;
            
            console.log(showingID); //testing
        });

                   // pre-fill customer data into edit customer form
                   $('#editShowingsBut').on('click', function(data){
                    let url = 'http://flip1.engr.oregonstate.edu:2350/api/showings/' + showingID; //get URL for selected theater
                    $.ajax({// get selected room information back
                        dataType:'json',
                        "Content-Type": 'application/json',
                        "method":'GET',
                        "url": url,
                        success: updateEditForm // data came back, prefill edit form
                    });
                    $.ajax({
                        dataType : 'json',
                        "Content-Type": 'application/json',
                        method: 'GET',
                        url: 'http://flip1.engr.oregonstate.edu:2350/api/theaters',
                        success: fillTheaterList
                    });

                    function fillTheaterList(data){
                        let selectList = $('#EditShowingTheaterSelect');
                        $.each(data, function(index, value){
                            if(data[index].name == showingstheaterID){
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
                        url: 'http://flip1.engr.oregonstate.edu:2350/api/movies',
                        success: fillMovieList
                    });

                    function fillMovieList(data){
                        let selectList = $('#EditShowingMovieSelect');
                        $.each(data, function(index, value){
                            if(data[index].movie_name == showingsmovieID){
                                selectList.append('<option value= "' + data[index].movie_id + '" selected = "selected">' + data[index].name + ' </option>')
                            }
                            else{
                                selectList.append('<option value= "' + data[index].movie_id + '">' + data[index].name + ' </option>')
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
                    function fillRoomList(data){
                        let selectList = $('#EditShowingRoomSelect');
                        $.each(data, function(index, value){
                            if(data[index].room_id == showingsroomID){
                                selectList.append('<option value= "' + data[index].room_id + '" selected = "selected">' + data[index].room_id + ' </option>')
                            }
                            else{
                                selectList.append('<option value= "' + data[index].room_id + '">' + data[index].room_id + ' </option>')
                            }
                        });
                    }

                    //ajax callback on sucess to fill form with selected room info
                    function updateEditForm(data){
                        $('#EditShowingTheaterSelect').val(data.theater_id);
                        $('#EditShowingMovieSelect').val(data.movie_id);
                        $('#EditShowingRoomSelect').val(data.movie_id);
                        $('#EditShowingTime').val(data.time);
                    }
                });



                $('#addShowingBut').on('click', function(data){
                    $.ajax({
                        dataType : 'json',
                        "Content-Type": 'application/json',
                        method: 'GET',
                        url: 'http://flip1.engr.oregonstate.edu:2350/api/theaters',
                        success: fillTheaterList
                    });

                    function fillTheaterList(data){
                        let selectList = $('#AddShowingTheaterSelect');
                        $.each(data, function(index, value){
                            if(data[index].name == showingstheaterID){
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
                        url: 'http://flip1.engr.oregonstate.edu:2350/api/movies',
                        success: fillMovieList
                    });

                    function fillMovieList(data){
                        let selectList = $('#AddShowingMovieSelect');
                        $.each(data, function(index, value){
                            if(data[index].movie_name == showingsmovieID){
                                selectList.append('<option value= "' + data[index].movie_id + '" selected = "selected">' + data[index].name + ' </option>')
                            }
                            else{
                                selectList.append('<option value= "' + data[index].movie_id + '">' + data[index].name + ' </option>')
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
                    function fillRoomList(data){
                        let selectList = $('#AddShowingRoomSelect');
                        $.each(data, function(index, value){
                            if(data[index].room_id == showingsroomID){
                                selectList.append('<option value= "' + data[index].room_id + '" selected = "selected">' + data[index].room_id + ' </option>')
                            }
                            else{
                                selectList.append('<option value= "' + data[index].room_id + '">' + data[index].room_id + ' </option>')
                            }
                        });
                    }
                });

    });
}

// add new customer to DB
 $(document).ready(function(){   
    $('#submitNewCustomerBut').on('click', function(data){

        console.log('you clicked submit!');// testing

            // fill variables with form data for ajax call
            let fname = $('#addCustomerFirstName').val();
            let lname = $('#addCustomerLastName').val();
            let DOB = $('#addCustomerDOB').val();
            let submitNewCust = "{\n    \"fname\": \"" + fname + "\",\n    \"lname\": \"" + lname + "\",\n    \"birthday\": \"" + DOB + "\"\n}";    
  


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
            "url": 'http://flip1.engr.oregonstate.edu:2350/api/customers/',
            "Content-Type": 'application/json',
            "processData": false,
            "headers": {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
              },
            "data":  submitNewCust,
            success: wroteData(data)
        })
    });

        // submit edited customer information
        $('#EditShowingSubmitBut').on('click', function(data){
    
            console.log('you clicked submit!');// testing
    
            let time = $('#EditShowingTime').val();
            let roomID = $('#EditShowingRoomSelect').val();
            let movieID = $('#EditShowingMovieSelect').val();
            //let customerID is declared above
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
     $('#deleteCustomerSubmit').on('click', function(data){
      console.log('you clicked submit!');// testing
          let url =  'http://flip1.engr.oregonstate.edu:2350/api/customers/' + customerID;    
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