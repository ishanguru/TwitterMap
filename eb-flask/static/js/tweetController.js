var map = "";
var markerCluster;
var marker_list = [];
var infowindow = '';

// Initialize Google map
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
	for (var i = 0; i < object_list.length; i++) {
		curr_latitude = object_list[i]._source.latitude;
		curr_longitude = object_list[i]._source.longitude;
		console.log("latitude: " + curr_latitude);
		console.log("longitude: " + curr_longitude);
		drop_marker(curr_latitude, curr_longitude, object_list[i]._source);
	}
    //TODO For some reason, when you zoom in to the cluster, it never breaks down a two-cluster to show you the individual markers
    markerCluster = new MarkerClusterer(map, marker_list,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

function drop_marker(latitude, longitude, source_object) {
	console.log("in drop_maker");
	var curr_lat_and_lng = {lat: latitude, lng: longitude};
	var new_marker = new google.maps.Marker({
    	position: curr_lat_and_lng,
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
    //Here is where the ajax call is made i.e. where we then call the endpoint associated with the search function
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

//Here is where, when we hit submit on the form, we get the keyword the user selected
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
	}, false);

});

