var url = '//api.songkick.com/api/3.0/artists/4186126/gigography.json?apikey=io09K9l3ebJxmxe2&jsoncallback=?';

function getGigography(id) {
    var url = '//api.songkick.com/api/3.0/artists/' + id + '/gigography.json?apikey=io09K9l3ebJxmxe2&jsoncallback=?'
  $.getJSON(url, function(data) {
    var events = data.resultsPage.results.event;
    var color = getRandomColor();

    events.forEach(function(gig) {
      var displayName = gig.displayName;
      // console.log(gig);
      var city = gig.location.city;
      var latitude = gig.venue.lat;
      var longitude = gig.venue.lng;
      var coord = {lat: latitude, lng: longitude};
      // console.log(displayName + " @ (" + latitude + "," + longitude + ")");

      if(latitude != null && longitude != null) {
        var contentString = "<a href='" + gig.uri + "'>" + displayName + "</a> @ " + city;
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        var marker = new google.maps.Marker({
          position: coord,
          map: map
        });

        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
      } else {
        console.log("COULD NOT DISPLAY " + displayName);
      }
    });
  });
}

function getArtistID() {
  var name = document.getElementById("name").text;
  var url = '//api.songkick.com/api/3.0/search/artists.json?apikey=io09K9l3ebJxmxe2&jsoncallback=?&query=' + name.replace(new RegExp(' ', 'g'), "-");
  var id = null;
  var data = $.getJSON(url, function(data) {
    id = data.resultsPage.results.artist[0].id;
    getGigography(id);
  });

}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function initMap() {
  var cusa = {lat: 39.8283, lng: -98.5795};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: cusa
  });
  getArtistID();
}

//PULL FROM THE PAST 6 MONTHS [[OPTIONAL]]
