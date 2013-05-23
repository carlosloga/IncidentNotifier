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

            posConsulta = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            sDireccionConsulta = "Pos actual";
            nuevoMarcadorSobrePlano(mapConsulta , posConsulta, sDireccionConsulta);

            var p = new google.maps.LatLng(41.4866667, 2.0933333);
            sDireccionConsulta = "Pos 2";
            nuevoMarcadorSobrePlano(mapConsulta , p, sDireccionConsulta);

            p = new google.maps.LatLng(41.4966667, 2.0988333);
            sDireccionConsulta = "Pos 3";
            nuevoMarcadorSobrePlano(mapConsulta , p, sDireccionConsulta);

            $('#divMapaConsulta').gmap('refresh');

        }, function () { getCurrentPositionError(true); });
    } else {
        // Browser no soporta Geolocation
        getCurrentPositionError(false);
    }
}

