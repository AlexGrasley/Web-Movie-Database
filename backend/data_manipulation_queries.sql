-- Select all movies to populate main movie table
SELECT
	movies.movie_id,
	movies.name,
	movies.rating,
	movies.genre,
	movies.length
FROM movies;


-- Get all showings with relevant information from theaters and movies
-- and "@" will denote variables that will passed in from backend language.
SELECT
	showings.showing_id,
	showings.time,
	theaters.name AS "Theater",
	movies.name AS "Title",
	movies.rating,
	movies.genre,
	movies.length
FROM showings
INNER JOIN movies
	ON movies.movie_id = showings.movie_id
INNER JOIN rooms
	ON showings.room_id = rooms.room_id
INNER JOIN theaters
	ON theaters.theater_id = rooms.theater_id
WHERE movies.name LIKE CONCAT("%",@movieName,"%") -- if @movieName is not selected it will default to a blank string so we get all results
	AND theaters.theater_id = @theaterID -- this line will be dynamically added and removed from the query on the back end based on if a selection is made or not
ORDER BY theaters.name, movies.name, showings.time;

-- Get list of theaters to populate list of theaters selections for the showings, manage tickets, and manage rooms tables
SELECT
	theater_id,
	theaters.name
FROM theaters
ORDER BY theaters.name;

-- get full list of theaters to populate manage theaters table. "@" denote
-- variables from the backend database.
SELECT
	theater_id,
	theater.name,
	theater.address,
	theater.rooms
FROM theater
WHERE theater.name LIKE CONCAT("%",@theaterName,"%") -- if @theaterNameis not selected it will default to a blank string so we get all results

-- get list of showings with relevant information from theaters and movies, similar to main showings table, but has more filter options
-- a "@" denotes variables that will be filled from the backend.
SELECT
	showings.showing_id,
	showings.time,
	theaters.name AS "Theater",
	movies.name AS "Title",
	movies.rating,
	movies.genre,
	movies.length
FROM showings
INNER JOIN movies
	ON movies.movie_id = showings.movie_id
INNER JOIN rooms
	ON showings.room_id = rooms.room_id
INNER JOIN theaters
	ON theaters.theater_id = rooms.theater_id
WHERE movies.movie_id = @movieID -- if @movieName is not selected this line will be removed from the query and the next line in the where clause will have "where" instead of "and"
	AND theaters.theater_id = @theaterID -- this line will be dynamically added and removed from the query on the back end based on if a selection is made or not
	AND rooms.room_id = @roomID -- this line will be dynamically removed from the query on the back end if there is no selection
ORDER BY theaters.name, movies.name, showings.time;

-- get list of tickets, very similar looking information to the showings table, but lists customs as well
-- a "@" denotes variables that will be filled from the backend.
SELECT
	theaters.name AS "Theater",
	rooms.room_id AS "Room",
	movies.name AS "Title",
	CONCAT(customers.Lname,", ",customers.FName) AS "Customer",
	showings.time AS "Show Time",
	FORMAT(tickets.price,2) AS "Price"
FROM tickets
INNER JOIN showings
	ON tickets.showing_id = showings.showing_id
INNER JOIN customers
	ON customers.customer_id = tickets.showing_id
	AND customers.customer_id = @customerID -- line added or removed based on selection in the UI.
INNER JOIN movies
	ON movies.movie_id = showings.movie_id
INNER JOIN rooms
	ON rooms.room_id = showings.room_id
	AND rooms.room_id = @roomID -- line added or removed based on selection in the UI.
INNER JOIN theaters
	ON theaters.theater_id = rooms.theater_id
	AND theaters.theater_id = @theaterID -- line added or removed based on selection in the UI.

-- get list of rooms for the manage rooms table
-- a "@" denotes variables that will be filled from the backend.
SELECT
	theaters.name,
	rooms.room_id
FROM rooms
INNER JOIN theaters
	ON theaters.theater_id = rooms.theater_id
	AND theaters.theater_id = @theaterID -- line added or removed based on selection in the UI.

-- get list of customers to fill manage customers table
-- a "@" denotes variables that will be filled from the backend.
SELECT
	customers.customer_id,
	CONCAT(customers.LName,", ",customers.FName) AS "Name",
	customers.birthday
FROM customers
WHERE customers.LName LIKE CONCAT("%",@LName,"%") -- @LName will default to blank so that it finds everything if no selection
	AND customers.FName LIKE CONCAT("%",@FName,"%") -- @FName will default to blank so that it finds everything if no selection




-- Insert

INSERT INTO customers (`fname`, `lname`, `birthday`) VALUES (@FName, @LName, @Birthday)
INSERT INTO movies (`name`, `rating`, `genre`, `length`) VALUES (@Name, @Rating, @Genre, @Length)
INSERT INTO rooms (`capacity`, `theater_id`) VALUES (@Capacity, @TheaterID)
INSERT INTO showings (`time`, `movie_id`, `room_id`) VALUES (@Time, @MovieID, @RoomID)
INSERT INTO theaters (`name`, `address`, `address_two`, `city`, `state`, `zip`) VALUES (@Name, @Address, @AddressTwo, @City, @State, @Zip)
INSERT INTO tickets (`price`, `showing_id`, `customer_id`) VALUES (@Price, @ShowingID, @CustomerID)


-- Update

UPDATE customers SET `fname` = @FName, `lname` = @LName, `birthday` = @Birthday WHERE `customer_id` = @CustomerID;
UPDATE movies SET `name` = @Name, `rating` = @Rating, `genre` = @Genre, `length` = @Length WHERE `movie_id` = @MovieID;
UPDATE rooms SET `capacity` = @Capacity, `theater_id` = @TheaterID WHERE `room_id` = @RoomID;
UPDATE showings SET `time` = @Time, `movie_id` = @MovieID, `room_id` = @RoomID WHERE `showing_id` = @ShowingID;
UPDATE theaters SET `name` = @Name, `address` = @Address, `address_two` = @AddressTwo,`city` = @City,`state` = @State,`zip` = @Zip WHERE `theater_id` = @TheaterID;
UPDATE tickets SET `price` = @Price, `showing_id` = @ShowingID, `customer_id` = @CustomerID WHERE `ticket_id` = @TicketID;

-- Delete

DELETE FROM customers WHERE `customer_id` = @CustomerID;
DELETE FROM movies WHERE `movie_id` = @MovieID;
DELETE FROM rooms WHERE `room_id` = @RoomID;
DELETE FROM showings WHERE `showing_id` = @ShowingID;
DELETE FROM theaters WHERE `theater_id` = @TheaterID;
DELETE FROM tickets WHERE `ticket_id` = @TicketID;
