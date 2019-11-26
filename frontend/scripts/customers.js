///////////////////////////////
//region Manage Customers
// set up manage customer table and provide functions that interact with the table
///////////////////////////////

var customerID = null; // make variable for selected customer ID

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

// var customerID = null; // make variable for selected customer ID
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

        // submit edited customer information
        $('#editCustomerSubmitBut').on('click', function(data){
    
            console.log('you clicked submit!');// testing
    
            let fname = $('#customerEditFirstName').val();
            let lname = $('#customerEditLastName').val();
            let DOB = $('#customerEditDOB').val();
            //let customerID is declared above
            let submitUpdateCust = "{\"customer_id\":" + customerID + ",  \"fname\": \"" + fname + "\",\n    \"lname\": \"" + lname + "\",\n    \"birthday\": \"" + DOB + "\"\n}";
                
            // ajax callback and table refresh
                console.log(submitUpdateCust);
    
            $.ajax({ // send data to backend through PATCH
                'dataType': 'json',
                'crossDomain': true,
                "async": true,
                "method": 'PATCH',
                "url": 'http://flip1.engr.oregonstate.edu:2350/api/customers/',
                // "Content-Type": 'application/json',
                "processData": false,
                "headers": {
                    "Content-Type": "application/json",
                    "cache-control": "no-cache",
                  },
                "data":  submitUpdateCust,
                success: wroteData(data)
            })

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