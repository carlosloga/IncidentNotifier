var mapConsulta = null;
var posConsulta = '';
var sDireccionConsulta = '';

function iniciaMapaConsulta() {
// Descapar para pruebas en PC :
    var llamaWS = "http://213.27.242.251:8000/wsIncidentNotifier/wsIncidentNotifier.asmx/ConsultarIncidenciasZona";
    var sParam  = "sLat=41.3965&sLon=2.1521";
    try
    {
                                 //(sTipoLlamada,sUrl,   sParametros,sContentType,                       bCrossDom, sDataType, bProcData, bCache, nTimeOut, funcion,                          pasaParam, sincro, bProcesar, tag)
        var datos = LlamaWebService('GET',       llamaWS,sParam,     'application/x-www-form-urlencoded',true,      'xml',     false,     false,  10000,    resultadoConsultarIncidenciasZona,null,      true,   true,     'pos');
    }
    catch (e)
    {
        mensaje('ERROR (exception) en iniciaMapaConsulta : \n' + e.code + '\n' + e.message);
    }
// ----------------------------------------------

    var mapOptions = {
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    mapConsulta = new google.maps.Map(document.getElementById('divMapaConsulta'), mapOptions);

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var llamaWS = "http://213.27.242.251:8000/wsIncidentNotifier/wsIncidentNotifier.asmx/ConsultarIncidenciasZona";
            var sParam  = "sLat=" + position.coords.latitude;
            sParam += "&sLon=" +  position.coords.longitude;
            try
            {
                var datos = LlamaWebService('GET',       llamaWS,sParam,'application/x-www-form-urlencoded',true,'xml',false,false,10000,resultadoConsultarIncidenciasZona,null,true,'pos');
            }
            catch (e)
            {
                mensaje('ERROR (exception) en iniciaMapaConsulta : \n' + e.code + '\n' + e.message);
            }
        } , function () { getCurrentPositionError(true); });
    }
    else
    {
        // Browser no soporta Geolocation
        getCurrentPositionError(false);
    }
}

function resultadoConsultarIncidenciasZona(datos, params){
    if (global_AjaxERROR != '' || global_AjaxRESULTADO == null)
    {
        mensaje(global_AjaxERROR);
    }
    else
    {      alert('ws ok');
        var sDatos = datos.toString();
        if (datos != null && datos.length > 0 && sDatos.substr(0, 5) != 'ERROR') {
            var aTabla = datos;

            mensaje('len tabla en resultadoConsultarIncidenciaZona : ' + aTabla.length.toString());

            for (var t = 0; t < aTabla.length; t++) {
                (function (t) {
                    aRegistro = new Array();
                    aRegistro = aTabla[t];
                    aPar = new Array();
                    //Bucle por cada campo del registro actual
                    for (var r = 0; r < aRegistro.length; r++) {
                        sNomCampo = aRegistro[r].toString().split(',')[0];
                        sValCampo = aRegistro[r].toString().substr(sNomCampo.length + 1);
                        mensaje(sNomCampo + ' ... ' + sValCampo);
                    }
                } (t));
            }
        }
        else
        {
            mensaje('Error en WebService');
            return;
        }

        //sDireccionConsulta = cogerDireccionConsulta(posConsulta);
        sDireccionConsulta = "Pos actual";
        nuevoMarcadorSobrePlano(mapConsulta , posConsulta, sDireccionConsulta);

        $('#divMapaConsulta').gmap('refresh');
    }
}