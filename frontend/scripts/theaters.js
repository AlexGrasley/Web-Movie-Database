/////////////////////
//begin region manage theaters
/////////////////////
let theaterID = 0; // make variable for selected customer ID
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
            let submitNewTheater = "{ \"name\": \"" + name + "\", \"address\": \"" + address + "\",\n  \"address_two\": \"" + address2 + "\",\n  \"city\": \"" + city + "\",\n    \"state\": \"" + state + "\", \"zip\": \"" + zip + "\"\n}";    
  


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

        // submit edited customer information
        $('#EditTheaterSubmitBut').on('click', function(data){
    
            console.log('you clicked submit!');// testing
    
            // fill variables with form data for ajax call
            let name = $('#TheaterNameUpdate').val();
            let address = $('#TheaterAddressUpdate').val();
            let address2 = $('#TheaterAddress2Update').val();
            let city = $('#TheaterCityUpdate').val();
            let state = $('#TheaterStateUpdate').val();
            let zip = $('#TheaterZipUpdate').val();
            // theaterID is delcared above
            let submitUpdateTheater = "{\"theater_id\":" + theaterID + ", \"name\": \"" + name + "\", \"address\": \"" + address + "\", \"address_two\": \"" + address2 + "\", \"city\": \"" + city + "\", \"state\": \"" + state + "\", \"zip\": \"" + zip + "\"}";
                
            // ajax callback and table refresh
                console.log(submitUpdateTheater);
    
            $.ajax({ // send data to backend through PATCH
                'dataType': 'json',
                'crossDomain': true,
                "async": true,
                "method": 'PATCH',
                "url": 'http://flip1.engr.oregonstate.edu:2350/api/theaters/',
                // "Content-Type": 'application/json',
                "processData": false,
                "headers": {
                    "Content-Type": "application/json",
                    "cache-control": "no-cache",
                  },
                "data":  submitUpdateTheater,
                success: wroteData(data)
            })

            function wroteData(data){
                console.log("I worked!");
            
                let timeOut = setTimeout(reload, 1000); //wait for results to update on the backend before refresh

               function reload(){ // reload datatable after adding customer
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
        });


     // delete selected room
     $('#deleteTheaterSubmitBut').on('click', function(data){
      console.log('you clicked submit!');// testing
          let url =  'http://flip1.engr.oregonstate.edu:2350/api/theaters/' + theaterID;    
          // ajax callback and table refresh
          console.log(url);
          function wroteData(data){
              console.log("I worked!");
          
              let timeOut = setTimeout(reload, 1000); //wait for results to update on the backend before refresh
             function reload(){ // reload datatable after adding customer
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

//////////////////////////
//end region manage theaters
//////////////////////////