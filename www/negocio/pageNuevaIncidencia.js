var mapAlta = null;
var posAlta = '';
var sDireccionAlta = '';
var sFoto = '';

// -------- FOTO -------------------------------------------------------------------------
function hacerFoto() {
    iniciaMapaAlta(false);
    try {
        navigator.camera.getPicture(hacerfotoOK, hacerFotoERROR, { quality: 50, destinationType: Camera.DestinationType.DATA_URL, sourceType: Camera.PictureSourceType.CAMERA, encodingType: Camera.EncodingType.JPEG, saveToPhotoAlbum: false });
    }
    catch (e) {
        alert('Exception : ' + e.message);
    }
}

function hacerfotoOK(imageData) {
    var imagen = document.getElementById('imgFoto');
    imagen.style.display = 'block';
    sFoto = imageData;
    imagen.src = "data:image/jpeg;base64," + sFoto;
}

function hacerFotoERROR(error) {
    mensaje('Cap foto caprutada !  ' + error.code);
}

function zoomFoto(){
    var imagen = document.getElementById('imgZoomFoto');
    imagen.style.display = 'block';
    imagen.src = "data:image/jpeg;base64," + sFoto;
    abrirPagina('pageZoomFoto');
}

function eliminarFoto(){
    sFoto = '';

    var imagen = document.getElementById('imgFoto');
    imagen.style.display = 'block';
    imagen.src = sFoto;

    imagen = document.getElementById('imgZoomFoto');
    imagen.style.display = 'block';
    imagen.src = sFoto;
}

// -------- LOCALIZACIÓN -----------------------------------------------------------------------
function iniciaMapaAlta(bAbrir) {
    var mapOptions = {
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    mapAlta = new google.maps.Map(document.getElementById('divMapaAlta'), mapOptions);

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            posAlta = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            cogerDireccionAlta(posAlta);

            var infowindow = new google.maps.InfoWindow({
                map: mapAlta,
                position: posAlta,
                content: '<div><table><tr><td style="font-size:x-small; font-weight:bold;">reportar incidència en </td></tr><tr><td style="font-size:x-small; font-weight:normal;">' + sDireccionAlta + '</td></tr></table></div>',
                maxWidth: 300
            });

            nuevoMarcadorSobrePlano(mapAlta,posAlta,sDireccionAlta);
 /*
            var marker = new google.maps.Marker({
                position: posAlta,
                map: mapAlta,
                title: 'incidència aquí'
            });
*/
            mapAlta.setCenter(posAlta);

            $('#labelDireccion').text(sDireccionAlta);

            $('#divMapaAlta').gmap('refresh');

            if (!bAbrir) $('#collapsibleLocalizacion').trigger('collapse');

        }, function () { getCurrentPositionError(true); });
    } else {
        // Browser no soporta Geolocation
        getCurrentPositionError(false);
    }
}

/* function getCurrentPositionError(errorFlag) {
    var content = '';
    if (errorFlag) {
        content = 'Error en el servei de geolocalització.';
    } else {
        content = 'Error: el seu navegador no soporta geolocalització';
    }
    var options = {
        map: mapAlta,
        position: new google.maps.LatLng(41.97430, 2.78241),
        content: content
    };
    var infowindow = new google.maps.InfoWindow(options);
    mapAlta.setCenter(options.position);
}
*/

function cogerDireccionAlta(pos) {
    sDireccionAlta = '';
    var llamaWS = "http://maps.googleapis.com/maps/api/geocode/xml";
    var sParam =  "latlng=" + pos.toString().replace(" ", "").replace("(","").replace(")","") + "&sensor=true";
    //alert(sParam);
    try
    {
        var datos = LlamaWebService('GET',llamaWS,sParam,'application/x-www-form-urlencoded', true, 'xml', false, false, 10000, null, null, false);
        if (global_AjaxERROR != '')
            alert(global_AjaxERROR);
        else
        {
            sDireccionAlta = $(datos).find('formatted_address').text();
            var n = 0;
            $(datos).find('formatted_address').each(function () {
                if (n == 0) sDireccionAlta = $(this).text();
                n++;
            });
        }
    }
    catch (e)
    {
        mensaje('ERROR (exception) en cogerDireccionAlta : \n' + e.code + '\n' + e.message);
    }
}

// -------- ENVIAR INCIDENCIA -----------------------------------------------------------------------
function enviarIncidencia() {
    var sObs = $('#textareaComentari').val();
    var sCoord = posAlta.toString().replace(" ", "").replace("(","").replace(")","")
    var llamaWS = "http://213.27.242.251:8000/wsIncidentNotifier/wsIncidentNotifier.asmx/NuevaIncidencia";
    var sParam  = "sObs=" + sObs;
    sParam += "&sCoord=" + sCoord;
    sParam += "&sDir=" + sDireccionAlta;
    sParam += "&sFoto=" + sFoto;
    try
    {
        var datos = LlamaWebService('POST',llamaWS,sParam,'application/x-www-form-urlencoded',true,'xml',false,false,10000,resultadoEnvio,null, true);
    }
    catch (e)
    {
        mensaje('ERROR (exception) en enviarIncidencia : \n' + e.code + '\n' + e.message);
    }
}

function resultadoEnvio(resultado, param){
    if (global_AjaxERROR != '' || global_AjaxRESULTADO == null) {
        mensaje(global_AjaxERROR);

// Descapar para pruebas en PC  -----------------
//        eliminarFoto();
//        limpiaVariables('pageNuevaIncidencia');
//        abrirPagina('pageIndex');
    }
    else
    {
        eliminarFoto();
        limpiaVariables('pageNuevaIncidencia');
        mensaje('Incidència notificada' + '\n' + 'Gràcies per la seva col·laboració');
        abrirPagina('pageIndex');
    }
}

