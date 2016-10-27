/* for local ui testing */
var json_sample = {"hits": {"hits": [{"_score": 0.57081455, "_type": "alltweets", "_id": "AVf0NMCuW2-3j40lpB7-", "_source": {"author": "Putu Sukarata", "timestamp": "Mon Oct 24 01:01:20 +0000 2016", "longitude": 115.06630249999999, "latitude": -8.440309, "message": "Morning...cup a coffee", "id": "790357471692853248"}, "_index": "twittermapindex"}, {"_score": 0.40772468, "_type": "alltweets", "_id": "AVf0MprLW2-3j40lpB72", "_source": {"author": "Sareena", "timestamp": "Mon Oct 24 00:58:59 +0000 2016", "longitude": -79.861034, "latitude": 35.1704985, "message": "Having low coffee funds is a good reason to cut back this week. I really thought that $60 on my card would last more than a week. Damn", "id": "790356881101520896"}, "_index": "twittermapindex"}, {"_score": 0.3728585, "_type": "alltweets", "_id": "AVf0QR-bW2-3j40lpB8O", "_source": {"author": "jasmin \u2741 s\u00f8sa", "timestamp": "Mon Oct 24 01:14:50 +0000 2016", "longitude": -84.433106, "latitude": 33.7671945, "message": "when ur @DunkinDonuts iced coffee tastes like straight UP sweet tea/rotten milk & ur bagel tastes like PLAYDOH. y have u forsaken me dd???!!", "id": "790360871600087040"}, "_index": "twittermapindex"}, {"_score": 0.3728585, "_type": "alltweets", "_id": "AVf0QY88W2-3j40lpB8V", "_source": {"author": "B e t h y", "timestamp": "Mon Oct 24 01:15:19 +0000 2016", "longitude": 150.931975, "latitude": -33.848244, "message": "Love knowing that ever time I order a coffee it's going to be good!! #whyisithardtogetgoodcoffeeintheuk \ud83e\udd14", "id": "790360992089649152"}, "_index": "twittermapindex"}], "total": 4, "max_score": 0.57081455}, "_shards": {"successful": 5, "failed": 0, "total": 5}, "took": 8, "timed_out": false};

var map = "";
var markerCluster;
var marker_list = [];
var infowindow = '';
var min_zoom_level = 2;

// Initialize Google map
function initMap() {
  var nyc = {lat: 40.7128, lng: -74.0059}; 
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: nyc
  });
  infowindow = new google.maps.InfoWindow({});
  limit_zoom_level();
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
  /*  markerCluster = new MarkerClusterer(map, marker_list,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
	*/
}

function drop_marker(latitude, longitude, source_object) {
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
	infowindow.setContent(contentString); 
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

function limit_zoom_level() {
	google.maps.event.addListener(map, 'zoom_changed', function () {
    	if (map.getZoom() < min_zoom_level) {
    		map.setZoom(min_zoom_level);
    	}
 	});
}

//Here is where, when we hit submit on the form, we get the keyword the user selected
$(document).ready(function() {
	initMap();
	document.getElementById('keyword_select_form').addEventListener('submit', function (e) {
		e.preventDefault();
		// add remove_marker function here
		clearMarkers();
		// when submit is hit, make ajax call, get tweet
		//search_by_keyword();

		/* for local ui testing */
		load_tweet(json_sample);

	}, false);

});

