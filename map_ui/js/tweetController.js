var map = "";
var marker_list = [];
var sample = {"hits": {"hits": [{"_score": 0.57081455, "_type": "alltweets", "_id": "AVf0NMCuW2-3j40lpB7-", "_source": {"author": "Putu Sukarata", "timestamp": "Mon Oct 24 01:01:20 +0000 2016", "longitude": 115.06630249999999, "latitude": -8.440309, "message": "Morning...cup a coffee", "id": "790357471692853248"}, "_index": "twittermapindex"}, {"_score": 0.40772468, "_type": "alltweets", "_id": "AVf0MprLW2-3j40lpB72", "_source": {"author": "Sareena", "timestamp": "Mon Oct 24 00:58:59 +0000 2016", "longitude": -79.861034, "latitude": 35.1704985, "message": "Having low coffee funds is a good reason to cut back this week. I really thought that $60 on my card would last more than a week. Damn", "id": "790356881101520896"}, "_index": "twittermapindex"}, {"_score": 0.3728585, "_type": "alltweets", "_id": "AVf0QR-bW2-3j40lpB8O", "_source": {"author": "jasmin \u2741 s\u00f8sa", "timestamp": "Mon Oct 24 01:14:50 +0000 2016", "longitude": -84.433106, "latitude": 33.7671945, "message": "when ur @DunkinDonuts iced coffee tastes like straight UP sweet tea/rotten milk & ur bagel tastes like PLAYDOH. y have u forsaken me dd???!!", "id": "790360871600087040"}, "_index": "twittermapindex"}, {"_score": 0.3728585, "_type": "alltweets", "_id": "AVf0QY88W2-3j40lpB8V", "_source": {"author": "B e t h y", "timestamp": "Mon Oct 24 01:15:19 +0000 2016", "longitude": 150.931975, "latitude": -33.848244, "message": "Love knowing that ever time I order a coffee it's going to be good!! #whyisithardtogetgoodcoffeeintheuk \ud83e\udd14", "id": "790360992089649152"}, "_index": "twittermapindex"}], "total": 4, "max_score": 0.57081455}, "_shards": {"successful": 5, "failed": 0, "total": 5}, "took": 8, "timed_out": false};
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
	var object_list = list.hits.hits; 
	console.log(JSON.stringify(object_list));
	console.log(sample);
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
	console.log(selected_keyword.value);
	console.log(get_type(selected_keyword.outerHTML));
	$.ajax({
		url: 'localhost:5000/search/' + selected_keyword,
		type: 'GET',
		// data:; // what we pass into the search function
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
		//	search_by_keyword(); don't call. I cannot get anything yet
		// load tweets
		load_tweet(sample);

		// if hover, show messages

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
