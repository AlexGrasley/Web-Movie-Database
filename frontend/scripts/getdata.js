

function adjustCols(e){
    $($.fn.dataTable.tables(true)).DataTable()
       .columns.adjust();
 };

// // set up movieTable
// function setupMovies(){
//     $(document).ready( function () {
//         $('#moviesTable').DataTable({
//             scrollY: 300,
//             paging: false,
//             stateSave: true,
//             select: true,
//             processing: true,
//             "ajax":{
//                 "url":"http://flip1.engr.oregonstate.edu:2350/api/movies",
//                 "method":"GET",
//                 "dataSrc": function(data){
//                     // replace null with "unknown" so column isn't blank
//                     for(var i = 0; i < Object.keys(data).length; ++i){
//                         if(data[i].genre == null){
//                             data[i].genre = "unknown";
//                         }
//                     }
//                     return data;
//                 }
//             },
//             columns: [
//                 {data: "movie_id"},
//                 {data: "name"},
//                 {data: "rating"},
//                 {data: "genre"},
//                 {data: "length"}
//             ]
//         });

//     });
// }



//setup Movie table on the manage page
function setupManageMovies(){
    $(document).ready( function () {
        $('#manageMoviesTable').DataTable({
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
    });
}
////////////////////////////
//region setup manage rooms
///////////////////////////

let roomID = 0; // make variable for selected room ID. Making here so we can use it in a few sections
function setupManageRooms(){
     $(document).ready( function () {
       var manageRoomsTable =  $('#manageRoomsTable').DataTable({
            scrollY: 300,
            paging: false,
            stateSave: true,
            select: 'single',
            rowCallback: function(row,data){
                var data = $(row).data();
            },
            processing: true,
            "ajax":{
                "url":'http://flip1.engr.oregonstate.edu:2350/api/rooms',
                "method":'GET',
                "dataSrc": ''
            },
            columns: [
                {data: "room_id"},
                {data: "capacity"},
                {data: "theater_id"}
            ]
        });


        let roomID = 0; 
        let theaterID = 0;
        //ensure that clicked row is selected, de-select all others, set customerID with selected row
        $('#manageRoomsTable tbody').on('click','tr', function(){
                    if( $(this).hasClass('selected') ){
                        $(this).removeClass('selected');
                    }
                    else{
                        manageRoomsTable.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                    roomID = manageRoomsTable.rows('.selected').data()[0].room_id;
                    theaterID = manageRoomsTable.rows('.selected').data()[0].theater_id;
                    console.log(roomID); //testing
                });
        
                // pre-fill customer data into edit customer form
                $('#editRoomBut').on('click', function(data){
                    let url = 'http://flip1.engr.oregonstate.edu:2350/api/rooms/' + roomID; //get URL for selected theater
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
                        let selectList = $('#editRoomTheaterSelect');
                        $.each(data, function(index, value){
                            if(data[index].theater_id == theaterID){
                                selectList.append('<option value= "' + data[index].theater_id + '" selected = "selected">' + data[index].name + ' </option>')
                            }
                            else{
                                selectList.append('<option value= "' + data[index].theater_id + '">' + data[index].name + ' </option>')
                            }
                        });
                    }

                    //ajax callback on sucess to fill form with selected room info
                    function updateEditForm(data){
                        $('#editRoomTheaterSelect').val(data.theater_id);
                        $('#editRoomCapacity').val(data.capacity);
                    }
                });

                $('#addRoomBut').on('click', function(data){
                    $.ajax({
                        dataType : 'json',
                        "Content-Type": 'application/json',
                        method: 'GET',
                        url: 'http://flip1.engr.oregonstate.edu:2350/api/theaters',
                        success: fillTheaterList
                    });

                    function fillTheaterList(data){
                        let selectList = $('#addRoomTheaterSelect');
                        $.each(data, function(index, value){
                            if(data[index].theater_id == theaterID){
                                selectList.append('<option value= "' + data[index].theater_id + '" selected = "selected">' + data[index].name + ' </option>')
                            }
                            else{
                                selectList.append('<option value= "' + data[index].theater_id + '">' + data[index].name + ' </option>')
                            }
                        });
                    }
                });

    });

    $(document).ready(function(){   
        $('#addRoomSubmitBut').on('click', function(data){
    
            console.log('you clicked submit!');// testing
    
                // fill variables with form data for ajax call
                let theaterID = $('#addRoomTheaterSelect').val();
                let roomCap = $('#addRoomCapacity').val();
                let submitNewRoom = "{\n    \"capacity\":" + roomCap + " ,\n    \"theater_id\":" + theaterID + "\n}";    
                // ajax callback and table refresh
                function wroteData(data){
                    console.log("I worked!");
                
                    let timeOut = setTimeout(reload, 1000); //wait for results to update on the backend before refresh
    
                   function reload(){ // reload datatable after adding customer
                    if(  $.fn.dataTable.isDataTable( '#manageRoomsTable' ) ){ // make sure table is active
                     console.log("table is alive here");
                       $('#manageRoomsTable').DataTable().ajax.reload();
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
                "url": 'http://flip1.engr.oregonstate.edu:2350/api/rooms/',
                "Content-Type": 'application/json',
                "processData": false,
                "headers": {
                    "Content-Type": "application/json",
                    "cache-control": "no-cache",
                  },
                "data":  submitNewRoom,
                success: wroteData(data)
            })
        });

        // submit edited room information
        $('#editRoomSubmitBut').on('click', function(data){
    
            console.log('you clicked submit!');// testing
    
                // fill variables with form data for ajax call
                let theaterID = $('#editRoomTheaterSelect').val();
                let roomCap = $('#editRoomCapacity').val();
                // let roomID is declared above
                let submitUpdateRoom = "{\n\t\"room_id\":" + roomID + ",\n    \"capacity\":" +  roomCap + ",\n    \"theater_id\":" +  theaterID + "\n}";    
                // ajax callback and table refresh
                function wroteData(data){
                    console.log("I worked!");
                
                    let timeOut = setTimeout(reload, 1000); //wait for results to update on the backend before refresh
    
                   function reload(){ // reload datatable after adding customer
                    if(  $.fn.dataTable.isDataTable( '#manageRoomsTable' ) ){ // make sure table is active
                     console.log("table is alive here");
                       $('#manageRoomsTable').DataTable().ajax.reload();
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
                "method": 'PATCH',
                "url": 'http://flip1.engr.oregonstate.edu:2350/api/rooms/',
                "Content-Type": 'application/json',
                "processData": false,
                "headers": {
                    "Content-Type": "application/json",
                    "cache-control": "no-cache",
                  },
                "data":  submitUpdateRoom,
                success: wroteData(data)
            })
        });
    });

}
///////////////////////////
//end region manage rooms
///////////////////////////

///////////////////////////////
//region Manage Customers
// set up manage customer table and provide functions that interact with the table
///////////////////////////////
function setupManageCustomers(){
    $(document).ready( function () {
      var manageCustomerTable = $('#manageCustomerTable').DataTable({
            scrollY: 300,
            paging: false,
            stateSave: true,
            select: 'single',
            rowCallback: function(row,data){
                var data = $(row).data();
            },
            processing: true,
            "ajax":{
                "url":'http://flip1.engr.oregonstate.edu:2350/api/customers',
                "method":'GET',
                "dataSrc": ''
            },
            columns: [
                {data: 'customer_id'},
                {data: 'fname'},
                {data: 'lname'},
                {data: 'birthday'}
            ]
        });

let customerID = null; // make variable for selected customer ID
//ensure that clicked row is selected, de-select all others, set customerID with selected row
$('#manageCustomerTable tbody').on('click','tr', function(){
            if( $(this).hasClass('selected') ){
                $(this).removeClass('selected');
            }
            else{
                manageCustomerTable.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
            customerID = manageCustomerTable.rows('.selected').data()[0].customer_id;
            console.log(customerID); //testing
        });

        // pre-fill customer data into edit customer form
        $('#editCustomerBut').on('click', function(data){
            let url = 'http://flip1.engr.oregonstate.edu:2350/api/customers/' + customerID; //get URL for selected customer
            $.ajax({
                dataType:'json',
                "Content-Type": 'application/json',
                "method":'GET',
                "url": url,
                success: updateEditForm // data came back, prefill edit form
            });
            //ajax callback on sucess
            function updateEditForm(data){
                $('#customerEditFirstName').val(data.fname);
                $('#customerEditLastName').val(data.lname);
                $('#customerEditDOB').val(data.birthday);      
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
                if(  $.fn.dataTable.isDataTable( '#manageCustomerTable' ) ){ // make sure table is active
                 console.log("table is alive here");
                   $('#manageCustomerTable').DataTable().ajax.reload();
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
});

//////////////////////
//end region manage customers
//////////////////////


/////////////////////
//begin region manage theaters
/////////////////////
function setupManageTheaters(){
    $(document).ready( function () {
       var manageTheatersTable = $('#manageTheatersTable').DataTable({
            scrollY: 300,
            paging: false,
            stateSave: true,
            select: 'single',
            rowCallback: function(row,data){
                var data = $(row).data();
            },
            processing: true,
            "ajax":{
                "url":'http://flip1.engr.oregonstate.edu:2350/api/theaters',
                "method":'GET',
                "dataSrc": ''
            },
            columns: [
                {data: "theater_id"},
                {data: "name"},
                {data: "address"},
                {data: "address_two"},
                {data: "city"},
                {data: "state"},
                {data: "zip"}
            ]
        });

        let theaterID = 0; // make variable for selected customer ID
        //ensure that clicked row is selected, de-select all others, set customerID with selected row
        $('#manageTheatersTable tbody').on('click','tr', function(){
                    if( $(this).hasClass('selected') ){
                        $(this).removeClass('selected');
                    }
                    else{
                        manageTheatersTable.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                    theaterID = manageTheatersTable.rows('.selected').data()[0].theater_id;
                    console.log(theaterID); //testing
                });
        
                // pre-fill customer data into edit customer form
                $('#editTheaterBut').on('click', function(data){
                    var url = 'http://flip1.engr.oregonstate.edu:2350/api/theaters/' + theaterID; //get URL for selected theater
                    $.ajax({
                        dataType:'json',
                        "Content-Type": 'application/json',
                        "method":'GET',
                        "url": url,
                        success: updateEditForm // data came back, prefill edit form
                    });
                    //ajax callback on sucess
                    function updateEditForm(data){
                        $('#TheaterNameUpdate').val(data.name);
                        $('#TheaterAddressUpdate').val(data.address);
                        $('#Address2').val(data.address_two);
                        $('#City').val(data.city);
                        $('#State').val(data.state);
                        $('#Zip').val(data.zip);
                    }
                });

    });
}

// add new theater
$(document).ready(function(){   
    $('#submitNewTheaterBut').on('click', function(data){

        console.log('you clicked submit!');// testing

            // fill variables with form data for ajax call
            let name = $('#TheaterNameAdd').val();
            let address = $('#TheaterAddressAdd').val();
            let address2 = $('#TheaterAddress2Add').val();
            let city = $('#TheaterCityAdd').val();
            let state = $('#TheaterStateAdd').val();
            let zip = $('#TheaterZipAdd').val();
            let submitNewTheater = "{\n    \"name\": \"" + name + "\",\n    \"address\": \"" + address + "\",\n  \"address_two\": \"" + address2 + "\",\n  \"city\": \"" + city + "\",\n    \"state\": \"" + state + "\",\n    \"zip\": \"" + zip + "\"\n}";    
  


            // ajax callback and table refresh
            function wroteData(data){
                console.log("I worked!");
            
                let timeOut = setTimeout(reload, 1000); //wait for results to update on the backend before refresh

               function reload(){ // reload datatable after adding theater
                if(  $.fn.dataTable.isDataTable( '#manageTheatersTable' ) ){ // make sure table is active
                 console.log("table is alive here");
                   $('#manageTheatersTable').DataTable().ajax.reload();
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
            "url": 'http://flip1.engr.oregonstate.edu:2350/api/theaters/',
            "Content-Type": 'application/json',
            "processData": false,
            "headers": {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
              },
            "data":  submitNewTheater,
            success: wroteData(data)
        })
    });
});

//////////////////////////
//end region manage theaters
//////////////////////////