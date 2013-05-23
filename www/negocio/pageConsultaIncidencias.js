var mapConsulta = null;
var posConsulta = '';
var sDireccionConsulta = '';

function resultadoConsultarIncidenciasZona(datos, params){
    if (global_AjaxERROR != '' || global_AjaxRESULTADO == null) {
        mensaje(global_AjaxERROR);
    }
    else
    {
        mensaje(global_AjaxRESULTADO.toString());
    }
}

function iniciaMapaConsulta() {
    var mapOptions = {
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var llamaWS = "http://213.27.242.251:8000/wsIncidentNotifier/wsIncidentNotifier.asmx/ConsultarIncidenciasZona";
    var sParam  = "sLat=41.3965";
        sParam += "&sLon=2.1521";
    try
    {
        var datos = LlamaWebService('GET',llamaWS,sParam,'application/x-www-form-urlencoded',true,'xml',false,false,10000,resultadoConsultarIncidenciasZona,null,true);
    }
    catch (e)
    {
        mensaje('ERROR (exception) en iniciaMapaConsulta : \n' + e.code + '\n' + e.message);
    }

    mapConsulta = new google.maps.Map(document.getElementById('divMapaConsulta'), mapOptions);

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

            posConsulta = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            //sDireccionConsulta = cogerDireccionConsulta(posConsulta);

            sDireccionConsulta = "Pos actual";
            nuevoMarcadorSobrePlano(mapConsulta , posConsulta, sDireccionConsulta);

            $('#divMapaConsulta').gmap('refresh');

        }, function () { getCurrentPositionError(true); });
    } else {
        // Browser no soporta Geolocation
        getCurrentPositionError(false);
    }
}

