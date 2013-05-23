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

            posConsulta = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            sDireccionConsulta = "Pos 1";
            nuevoMarcadorSobrePlano(mapConsulta , posConsulta, sDireccionConsulta);

            sDireccionConsulta = "Pos 2";
            posConsulta = '{"kb":2.1530865999999614,"jb":41.3968802}';
            nuevoMarcadorSobrePlano(mapConsulta , posConsulta, sDireccionConsulta);

            sDireccionConsulta = "Pos 3";
            posConsulta = '{"kb":2.1550865999999614,"jb":41.3988802}';
            nuevoMarcadorSobrePlano(mapConsulta , posConsulta, sDireccionConsulta);

            sDireccionConsulta = "Pos 4";
            posConsulta = '{"kb":2.1570865999999614,"jb":41.3998802}';
            nuevoMarcadorSobrePlano(mapConsulta , posConsulta, sDireccionConsulta);

            posConsulta = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            mapConsulta.setCenter(posConsulta);

            $('#divMapaConsulta').gmap('refresh');

        }, function () { getCurrentPositionError(true); });
    } else {
        // Browser no soporta Geolocation
        getCurrentPositionError(false);
    }
}

