function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    mapTypeControl: false,
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13
  });

  new AutocompleteDirectionsHandler(map);

}

//TRAZANDO RUTA
function AutocompleteDirectionsHandler(map) {
  this.map = map;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = 'WALKING';
  var originInput = document.getElementById('origen');
  var destinationInput = document.getElementById('destino');
  this.directionsService = new google.maps.DirectionsService;
  this.directionsDisplay = new google.maps.DirectionsRenderer;
  this.directionsDisplay.setMap(map);
  
  var originAutocomplete = new google.maps.places.Autocomplete(
    originInput, {placeIdOnly: true});
  var destinationAutocomplete = new google.maps.places.Autocomplete(
    destinationInput, {placeIdOnly: true});

  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

}

AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
  var radioButton = document.getElementById(id);
  var me = this;
  radioButton.addEventListener('click', function() {
    me.travelMode = mode;
    me.route();
  });
};

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
  var me = this;
  autocomplete.bindTo('bounds', this.map);
  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
      if (!place.place_id) {
        window.alert("Seleccione una opción de la lista ");
        return;
      }
      if (mode === 'ORIG') {
        me.originPlaceId = place.place_id;
      } else {
         me.destinationPlaceId = place.place_id;
      }
     me.route();
  });

};

AutocompleteDirectionsHandler.prototype.route = function() {
  if (!this.originPlaceId || !this.destinationPlaceId) {
    return;
  }
  var me = this;

  this.directionsService.route({
  origin: {'placeId': this.originPlaceId},
  destination: {'placeId': this.destinationPlaceId},
  travelMode: this.travelMode
  }, function(response, status) {
      if (status === 'OK') {
        document.getElementById("ruta").addEventListener("click", function(){
          if (document.getElementById('origen').value == "") {
            alert("Debes ingresar una ruta")
          }else{
             me.directionsDisplay.setDirections(response);
            document.getElementById("origen").value = "";
            document.getElementById("destino").value = "";
          }
        })
      } else {
         window.alert('Se ha producido un error en la solicitud de ' + status);
      }
    });
};
var ruta = document.getElementById("ruta");
    ruta.addEventListener("click", function(){
      if (document.getElementById('origen').value == "") {
            alert("Debes ingresar una ruta")
      }
      else{
        AutocompleteDirectionsHandler.prototype.route()
      }
    })