var initialMapConfig = {
  addressText: "Nawi Salzburg",
  mapZoom: 13
};

var markers = [];
var mainMap;

function initMap() {
  setUpMap();
  retrievePositionDataModel();
}

function setUpMap() {
  this.geoCoder = new google.maps.Geocoder();
  this.geoCoder.geocode({
    address: this.initialMapConfig.addressText
  }, function(success, error) {
    this.mainMap = new google.maps.Map(document.getElementById('mainMap'), {
      center: success[0].geometry.location,
      zoom: this.initialMapConfig.mapZoom,
      styles: styles,
      mapTypeId: 'terrain'
    });
  });
}

function retrievePositionDataModel() {
  this.knockoutModel.data.forEach(function(marker) {
    this.geoCoder.geocode({
      address: marker.title
    }, function(success, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        marker.position = success[0].geometry.location;

        var newMarker = new google.maps.Marker({
          position: marker.position,
          map: this.mainMap,
          title: marker.title,
          animation: google.maps.Animation.DROP
        });
        this.markers.push(newMarker);

        var infoWindow = new google.maps.InfoWindow({
          content: `<p>Title: ${marker.title}, Position: ${marker.position}`
        });

        newMarker.addListener('click', function() {
          infoWindow.open(this.mainMap, newMarker);
        });
      } else {
        alert(`Location data for ${marker.title} could not be retrieved.`);
      }
    });
  });
}

var styles = [
  {
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text",
    "stylers": [
      {
        "color": "#ffffff"
      },
      {
        "visibility": "on"
      },
      {
        "weight": 7.5
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#4d2600"
      },
      {
        "visibility": "on"
      },
      {
        "weight": 2.5
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#39ac73"
      }
    ]
  },
  {
    "featureType": "landscape.natural.landcover",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#186A3B"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "landscape.natural.terrain",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#003366"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.attraction",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#bfff00"
      },
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#AF601A"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "poi.medical",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#B03A2E"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "poi.medical",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#B03A2E"
      }
    ]
  },
  {
    "featureType": "poi.place_of_worship",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#F4D03F"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ff9966"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#A9CCE3"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ff9933"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#cc6600"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#27AE60"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.station.bus",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#4A235A"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text",
    "stylers": [
      {
        "color": "#FDFEFE"
      },
      {
        "visibility": "on"
      }
    ]
  }
];

var knockoutModel = {
  data: [{
      title: 'Universität Salzburg Informatik'
    },
    {
      title: 'Hangar 7 Salzburg'
    },
    {
      title: 'Haus der Natur'
    },
    {
      title: 'Augustinerbräu Mülln'
    },
    {
      title: 'Zoo Hellbrunn'
    },
    {
      title: 'Red Bull Arena salzburg'
    },
    {
      title: 'Europark'
    },
    {
      title: 'Festung Hohensalzburg'
    },
    {
      title: 'Mozart Geburtshaus'
    },
    {
      title: 'Schloss Mirabell'
    }
  ]
};

var viewModel = {
  markerData: ko.observableArray(this.knockoutModel.data),
  selectedMarkers: ko.observableArray(this.knockoutModel.data),

  setMarkers: function() {
    var textValue = this.textValue();
    var selectedMarkers = [];
    markers.forEach(function(marker) {
      if (marker.title.toLowerCase().startsWith(textValue.toLowerCase())) {
        marker.setMap(mainMap);
        marker.setAnimation(google.maps.Animation.DROP);
        selectedMarkers.push(marker);
      } else {
        marker.setMap(null);
      }
    });
    this.selectedMarkers(selectedMarkers);
  },

  showMarker: function(item) {
    markers.forEach(function(marker) {
      if (marker.title.toLowerCase().startsWith(item.title.toLowerCase())) {
        marker.setMap(mainMap);
        marker.setAnimation(google.maps.Animation.DROP);
      } else {
        marker.setMap(null);
      }
    });
  },

  submitValue: "OK",
  textValue: ko.observable("")
};

$(function() {
  ko.applyBindings(viewModel);
});
