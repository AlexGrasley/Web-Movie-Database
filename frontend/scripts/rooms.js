////////////////////////////
//region setup manage rooms
///////////////////////////

var roomID = 0; // make variable for selected room ID. Making here so we can use it in a few sections
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


        // let roomID = 0; 
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
                let submitUpdateRoom = "{ \"room_id\":" + roomID + ",    \"capacity\":" +  roomCap + ",    \"theater_id\":" +  theaterID + "}";    
                // ajax callback and table refresh
                console.log(submitUpdateRoom);
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
                "url": 'http://flip1.engr.oregonstate.edu:2350/api/rooms',
                // "Content-Type": 'application/json',
                "processData": false,
                "headers": {
                    "Content-Type": "application/json",
                    "cache-control": "no-cache",
                  },
                "data":  submitUpdateRoom,
                success: wroteData(data)
            })
        });


     // delete selected room
     $('#deleteRoomSubmit').on('click', function(data){
      console.log('you clicked submit!');// testing
         
          let url =  'http://flip1.engr.oregonstate.edu:2350/api/rooms/' + roomID;    
          // ajax callback and table refresh
          console.log(url);
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


}
///////////////////////////
//end region manage rooms
///////////////////////////