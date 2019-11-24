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