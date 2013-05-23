var mapConsulta;
var mapConsulta = null;
var posConsulta = '';
var sDireccionConsulta = '';

function iniciaMapaConsulta() {
    var mapOptions = {
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    mapConsulta = new google.maps.Map(document.getElementById('divMapaConsulta'), mapOptions);

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            posConsulta = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            //sDireccionConsulta = cogerDireccionConsulta(posConsulta);
            var lat = 0.0;
            var lon = 0.0;
            for(var x=0; x < 4; x++){
                lat = parseFloat(position.coords.latitude) + 0.1;
                lon = parseFloat(position.coords.longitude)  + 0.1;
mensaje(lat.toString() + ' ... ' + lon.toString())
                posConsulta = new google.maps.LatLng(lat.toString(),lon.toString());
                sDireccionConsulta = "Pos " + x.toString();
                nuevoMarcadorSobrePlano(mapConsulta , posConsulta, sDireccionConsulta);
            }

            posConsulta = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            mapConsulta.setCenter(posConsulta);

            $('#divMapaConsulta').gmap('refresh');

        }, function () { getCurrentPositionError(true); });
    } else {
        // Browser no soporta Geolocation
        getCurrentPositionError(false);
    }
}

