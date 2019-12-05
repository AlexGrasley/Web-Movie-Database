///////////////////////////////
//region Manage Customers
// set up manage customer table and provide functions that interact with the table
///////////////////////////////


let ticketID = 0;
let ticketCustFName = "";
let ticketCustLName = "";
let ticketMovieName = "";
let ticketShowingID = 0;


function setupManageTickets(){
    $(document).ready( function () {
      let manageTicketsTable = $('#manageTicketsTable').DataTable({
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
                headers:{
                },
                "dataSrc": ''
            },
            columns: [
                {data: 'ticket_id'},
                {data: 'room_id'},
                {data: 'movie_name'},
                {data: 'customer_name'},
                {data: 'showtime'},
                {data: 'showing_id'},
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
            //get variables for all the items I need to fill select lists for add and edit modals. 
            ticketID = manageTicketsTable.rows('.selected').data()[0].ticket_id;
            let customerName = manageTicketsTable.rows('.selected').data()[0].customer_name; 
            ticketCustFName = customerName.substr(0,customerName.indexOf(' ')); //get first name
            ticketCustLName = customerName.substr(customerName.indexOf(' ') + 1); //get last name
            ticketMovieName = manageTicketsTable.rows('.selected').data()[0].movie_name;
            ticketShowingID = manageTicketsTable.rows('.selected').data()[0].showing_id;
            console.log(ticketID); //testing
            console.log(ticketMovieName);
        });

                   // pre-fill customer data into edit customer form
                   $('#editTicketBut').on('click', function(data){
                    let url = 'http://flip1.engr.oregonstate.edu:2350/api/tickets/' + ticketID; //get URL for selected theater
                    $.ajax({// get selected room information back
                        dataType:'json',
                        "Content-Type": 'application/json',
                        "method":'GET',
                        "url": url,
                        headers:{
                            
                        },
                        success: updateEditForm // data came back, prefill edit form
                    });
                    $.ajax({
                        dataType : 'json',
                        "Content-Type": 'application/json',
                        method: 'GET',
                        url: 'http://flip1.engr.oregonstate.edu:2350/api/customers',
                        success: fillCustomerList
                    });

                    function fillCustomerList(data){
                        let selectList = $('#EditTicketCustomerSelect');
                        $.each(data, function(index, value){
                            if(data[index].lname == ticketCustLName && data[index].fname == ticketCustFName){
                                selectList.append('<option value= "' + data[index].customer_id + '" selected = "selected">' + data[index].fname + ' ' + data[index].lname + ' </option>')
                            }
                            else{
                                selectList.append('<option value= "' + data[index].customer_id + '">' + data[index].fname + ' ' + data[index].lname + ' </option>')
                            }
                        });
                    }

                    $.ajax({
                        dataType : 'json',
                        "Content-Type": 'application/json',
                        method: 'GET',
                        url: 'http://flip1.engr.oregonstate.edu:2350/api/movies',
                        headers:{
                            
                            
                        },
                        success: fillMovieList
                    });

                    function fillMovieList(data){
                        let selectList = $('#EditTicketMovieSelect');
                        $.each(data, function(index, value){
                            if(data[index].name == ticketMovieName){

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
                        url: 'http://flip1.engr.oregonstate.edu:2350/api/showings',
                        headers:{
                            
                        },
                        success: fillShowingList
                    });
                    function fillShowingList(data){
                        let selectList = $('#EditTicketShowingSelect');
                        $.each(data, function(index, value){
                            if(data[index].showing_id == ticketShowingID){
                                selectList.append('<option value= "' + data[index].showing_id + '" selected = "selected">' + data[index].time + ' </option>')
                            }
                            // else{
                            //     selectList.append('<option value= "' + data[index].showing_id + '">' + data[index].time + ' </option>')
                            // }
                        });
                    }

                    //ajax callback on sucess to fill form with selected room info
                    function updateEditForm(data){
                        $('#EditTicketPrice').val(data.price);
                    }
                });



                $('#addTicketBut').on('click', function(data){
                    $.ajax({
                        dataType : 'json',
                        "Content-Type": 'application/json',
                        method: 'GET',
                        url: 'http://flip1.engr.oregonstate.edu:2350/api/customers',
                        success: fillCustomerList
                    });

                    function fillCustomerList(data){
                        let selectList = $('#AddTicketCustomer');
                        $.each(data, function(index, value){
                            if(data[index].lname == ticketCustLName && data[index].fname == ticketCustFName){
                                selectList.append('<option value= "' + data[index].customer_id + '">' + data[index].fname + ' ' + data[index].lname + ' </option>')
                            }
                            else{
                                selectList.append('<option value= "' + data[index].customer_id + '">' + data[index].fname + ' ' + data[index].lname + ' </option>')
                            }
                        });
                    }

                    $.ajax({
                        dataType : 'json',
                        "Content-Type": 'application/json',
                        method: 'GET',
                        url: 'http://flip1.engr.oregonstate.edu:2350/api/movies',
                        headers:{
                            
                        },
                        success: fillTicketMovieList
                    });

                    function fillTicketMovieList(data){
                        let selectList = $('#AddTicketMovie');
                        $.each(data, function(index, value){
                            if(data[index].name == ticketMovieName){

                                selectList.append('<option value= "' + data[index].movie_id + '">' + data[index].name + ' </option>')
                            }
                            else{
                                selectList.append('<option value= "' + data[index].movie_id + '">' + data[index].name + ' </option>')
                            }
                        });
                    }

                    // $.ajax({
                    //     dataType : 'json',
                    //     "Content-Type": 'application/json',
                    //     method: 'GET',
                    //     url: 'http://flip1.engr.oregonstate.edu:2350/api/showings',
                    //     headers:{
                    //         
                    //     },
                    //     success: fillShowingList
                    // });
                    // function fillShowingList(data){
                    //     let selectList = $('#AddTicketShowTime');
                    //     selectList.empty();
                    //     $.each(data, function(index, value){
                    //         if(data[index].showing_id == ticketShowingID){
                    //             selectList.append('<option value= "' + data[index].showing_id + '" selected = "selected">' + data[index].time + ' </option>')
                    //         }
                    //         else{
                    //             selectList.append('<option value= "' + data[index].showing_id + '">' + data[index].time + ' </option>')
                    //         }
                    //     });
                    // }
                });

    });
}

$(document).ready(function(){
    //change showing selection to match the selected movie for the edit ticket menu
    let $movieSelect = $('#EditTicketMovieSelect');

    $movieSelect.on('change', function(){
        let selectedID = this.value;
        console.log(selectedID);
        
        $.ajax({
            dataType : 'json',
            "Content-Type": 'application/json',
            method: 'GET',
            url: 'http://flip1.engr.oregonstate.edu:2350/api/showings',
            headers:{
                
            },
            success: fillShowingList
        });
        function fillShowingList(data){
            let selectList = $('#EditTicketShowingSelect');
            selectList.empty();
            $.each(data, function(index, value){
                if(data[index].movie_id == selectedID){
                    selectList.append('<option value= "' + data[index].showing_id + '">' + data[index].time + ' </option>')
                }
            });
        }
        
    }).trigger('change');
});

$(document).ready(function(){
 //change showing selection to match the selected movie for the add ticket menu
 let $movieAddSelect = $('#AddTicketMovie');

    $movieAddSelect.on('change', function(){
        let selectedMovieID = this.value;
        console.log(selectedMovieID);
        
        $.ajax({
            dataType : 'json',
            "Content-Type": 'application/json',
            method: 'GET',
            url: 'http://flip1.engr.oregonstate.edu:2350/api/showings',
            headers:{
                
            },
            success: fillShowingList
        });
        function fillShowingList(data){
            let selectList = $('#AddTicketShowTime');
            selectList.empty();
            $.each(data, function(index, value){
                if(data[index].movie_id == selectedMovieID){
                    console.log('is this happening?')
                    selectList.append('<option value= "' + data[index].showing_id + '">' + data[index].time + ' </option>')
                }
            });
        }
        
    }).trigger('change');
});

// add new customer to DB
 $(document).ready(function(){   
    $('#AddTicketSubmit').on('click', function(data){

        console.log('you clicked submit!');// testing

            // fill variables with form data for ajax call
            let customer = $('#AddTicketCustomer').val();
            let showtime = $('#AddTicketShowTime').val();
            let price = $('#AddTicketPrice').val();
            let submitNewTicket = "{\"price\":" + price + ", \"showing_id\": " + showtime + ", \"customer_id\": " +  customer + "}";    
  


            // ajax callback and table refresh
            function wroteData(data){
                console.log("I worked!");
            
                let timeOut = setTimeout(reload, 1000); //wait for results to update on the backend before refresh

               function reload(){ // reload datatable after adding customer
                if(  $.fn.dataTable.isDataTable( '#manageTicketsTable' ) ){ // make sure table is active
                 console.log("table is alive here");
                   $('#manageTicketsTable').DataTable().ajax.reload();
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
            "url": 'http://flip1.engr.oregonstate.edu:2350/api/tickets/',
            "Content-Type": 'application/json',
            "processData": false,
            "headers": {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
                
              },
            "data":  submitNewTicket,
            success: wroteData(data)
        })
    });

        // submit edited customer information
        $('#EditTicketSubmit').on('click', function(data){
    
            console.log('you clicked submit!');// testing
    
            // fill variables with form data for ajax call
            let customer = $('#EditTicketCustomerSelect').val();
            let showtime = $('#EditTicketShowingSelect').val();
            let price = $('#EditTicketPrice').val();
            let submitUpdateTicket = "{\"ticket_id\":" + ticketID + ", \"price\":" + price + ", \"showing_id\": " + showtime + ", \"customer_id\": " +  customer + "}";    
                
            // ajax callback and table refresh
                console.log(submitUpdateTicket);
    
            $.ajax({ // send data to backend through PATCH
                'dataType': 'json',
                'crossDomain': true,
                "async": true,
                "method": 'PATCH',
                "url": 'http://flip1.engr.oregonstate.edu:2350/api/tickets/',
                // "Content-Type": 'application/json',
                "processData": false,
                "headers": {
                    "Content-Type": "application/json",
                    "cache-control": "no-cache",
                    
                  },
                "data":  submitUpdateTicket,
                success: wroteData(data)
            })

            function wroteData(data){
                console.log("I worked!");
            
                let timeOut = setTimeout(reload, 1000); //wait for results to update on the backend before refresh

               function reload(){ // reload datatable after adding customer
                if(  $.fn.dataTable.isDataTable( '#manageTicketsTable' ) ){ // make sure table is active
                 console.log("table is alive here");
                   $('#manageTicketsTable').DataTable().ajax.reload();
                }
                else{
                 console.log("table is dead here");
                }
                return;
                }
            }
        });


     // delete selected room
     $('#DeleteTicketSubmitBut').on('click', function(data){
      console.log('you clicked submit!');// testing
          let url =  'http://flip1.engr.oregonstate.edu:2350/api/tickets/' + ticketID;    
          // ajax callback and table refresh
          console.log(url);
          function wroteData(data){
              console.log("I worked!");
          
              let timeOut = setTimeout(reload, 1000); //wait for results to update on the backend before refresh
             function reload(){ // reload datatable after adding customer
              if(  $.fn.dataTable.isDataTable( '#manageTicketsTable' ) ){ // make sure table is active
               console.log("table is alive here");
                 $('#manageTicketsTable').DataTable().ajax.reload();
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