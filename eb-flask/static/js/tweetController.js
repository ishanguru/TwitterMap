var map = "";
var marker_list = [];
var infowindow = '';
// init Google map
function initMap() {
  var nyc = {lat: 40.7128, lng: -74.0059}; 
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: nyc
  });

  infowindow = new google.maps.InfoWindow({});

}

function load_tweet(list) {
	var object_list = list.hits.hits; 
	console.log(JSON.stringify(object_list));
	// console.log(sample);
	for (var i = 0; i < object_list.length; i++) {
		curr_latitude = object_list[i]._source.latitude;
		curr_longitude = object_list[i]._source.longitude;
		console.log("latitude: " + curr_latitude);
		console.log("longitude: " + curr_longitude);
		drop_maker(curr_latitude, curr_longitude, object_list[i]._source);
	}
}

function drop_maker(latitude, longitude, source_object) {
	console.log("in drop_maker");
	var curr_lat_and_lng = {lat: latitude, lng: longitude};
	var new_marker = new google.maps.Marker({
    	position: curr_lat_and_lng,
    	animation: google.maps.Animation.DROP,
    	map: map
  	});
  	new_marker.addListener('click', function() {
  		toggleMarker(source_object);
  		infowindow.open(map, new_marker);
  	});
  	marker_list.push(new_marker);
}

function toggleMarker(source_object) {
	console.log("in toggleMarker");
	var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading"></h1>'+
            '<div id="bodyContent">'+
            '<p>' + source_object.message + '</p>' +
            '<b>' + source_object.author + '</b>' +
            '<p>' + source_object.timestamp + '</p>' +
            '</div>'+
            '</div>';
    console.log("after contentString");
	infowindow.setContent(contentString); 
    console.log("after infowindow");
}

function get_type(thing){
    if(thing===null)return "[object Null]"; // special case
    return Object.prototype.toString.call(thing);
}

function search_by_keyword() {
	var selected_key = $('#selected_keyword').value;
	console.log("in search_by_keyword");
	console.log(selected_key)
	console.log(selected_keyword.value);
	$.ajax({
		url: '/search/' + selected_keyword.value,
		type: 'GET',
		success: function(response) {
			console.log(JSON.stringify(response));
			load_tweet(response);
		},
		error: function(error) {
			console.log(JSON.stringify(error));
			$('#testing').text(JSON.stringify(error));
		}
	});
}

function clearMarkers(){
	for (var i = 0; i < marker_list.length; i++) {
          marker_list[i].setMap(null);
    }
}

$(document).ready(function() {
	initMap();
	console.log("after init_map");
	document.getElementById('keyword_select_form').addEventListener('submit', function (e) {
		console.log("inside form function 1");
		e.preventDefault();
		// add remove_marker function here
		clearMarkers();
		console.log("inside form function 2");
		// when submit is hit, make ajax call, get tweet
		search_by_keyword();
		// load tweets
		// load_tweet(sample);

		// if hover, show messages

	}, false);

});

