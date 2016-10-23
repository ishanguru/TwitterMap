var map = "";
var marker_list = [];

// init Google map
function initMap() {
  var nyc = {lat: 40.7128, lng: -74.0059}; 
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: nyc
  });
  var marker = new google.maps.Marker({
    position: nyc,
    map: map
  });
}

/*  flask passes in a list of objects in the following
	format: 
	body = {
			"id": id,
			"longitude": longitude,
			"latitude": latitude,
			"message": tweet,
			"author": author,
			"timestamp": timestamp
		}
	
	take this list,
	take their latitudes & longitudes, 
	for each of them, 
		mark more than one locations by them */

function load_tweet(list) {
	var object_list = JSON.parse(JSON.stringify(list)); 
	for (int i = 0; i < object_list.length; i++) {
		curr_lattitude = object_list[i].latitude;
		curr_longitude = object_list[i].longitude;
		drop_maker(curr_latitude, curr_longitude);
	}
}

function drop_maker(latitude, longitude) {
	var curr_lat_and_lng = {lat: latitude, lng: longitude};
	var marker = new google.maps.Marker({
    	position: curr_lat_and_lng,
    	map: map
  	});
  	marker_list.push(marker);
  	// NOT SURE IF THIS WILL SHOW ALL THE MARKERS!!
}

/* pass keyword & use ajax to call flask functions */
function search_by_keyword(keyword) {
	$.ajax({
		url: '/search/' + keyword,
		type: 'GET',
		// data:; // what we pass into the search function
		success: function(response) {
			console.log(JSON.stringify(response));
			load_tweet(response);
		}
		error: function(error) {
			console.log(JSON.stringify(error));
			$('#warning').text(JSON.stringify(error));

		}
	});
}

$(document).ready(function() {
	initMap();
	document.getElementById('keyword_select_form').addEventListener('submit', function (e) {
		e.preventDefault();
		var selected_key = document.getElementById('selected_keyword').value;
		if (selected_key) {
			search_by_keyword(selected_key);
		} else {
			// give warning about entering keyword
			$('#warning').text("WARNING: Keyword is REQUIRED. Try again!");
		}
	}, false);
});







/*
EXTRA CODES:  
function scroll_after_search(scrollId) {
	$.ajax({
		url: '/scroll/' + scrollId,
		type: 'GET',
		// data:;  what we pass into the scroll function

		success: function(response) {
			// if success, call the load_tweet function
			console.log(JSON.stringify(response));
			load_tweet(response);
		}
	});
}
*/
