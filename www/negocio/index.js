// funciones COMUNES -----------------------------------------------------------------------
var pictureSource;
var destinationType;
var mapAlta;
var mapConsulta;
var pos = null;
var global_AjaxERROR = '';
var global_AjaxRESULTADO = null;
var sDireccion = '';
var sFoto = '';


// -------- Al INICIAR -----------------------------------------------------------------------
window.addEventListener('load', function () {
    if (phoneGapRun()) {
        document.addEventListener("deviceReady", deviceReady, false);
    } else {
        deviceReady();
    }
}, false);

function deviceReady() {
    if (phoneGapRun()) {
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
    }

    // en pageNuevaIncidencia -------------------------------------------------------------------
    //Al cerrarse el aordeón del Comentari, que se ponga el texto en su cabecera ----------------
    $('#collapsibleComentario').bind('collapse', function () {
        $('#labelComentari').text( $('#textareaComentari').val() );
    });
}

// -------- COMUNES -----------------------------------------------------------------------

function abrirPagina(sPag) {
    switch(sPag)
    {
        case 'pageNuevaIncidencia' :
            sFoto = '';
            iniciaMapaAlta(true);
            break;
    }

    $.mobile.changePage('#' + sPag, {
        transition: "flip",
        reverse: false,
        changeHash: true
    });
}

// -------- FOTO -------------------------------------------------------------------------
function hacerFoto() {
    iniciaMapaAlta(false);
    try {
    navigator.camera.getPicture(hacerfotoOK, hacerFotoERROR, { quality: 50, destinationType: Camera.DestinationType.DATA_URL, sourceType: Camera.PictureSourceType.CAMERA, encodingType: Camera.EncodingType.JPEG, saveToPhotoAlbum: false });
    //navigator.device.capture.captureImage(hacerfotoOK, hacerFotoERROR, {limit:1});
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
            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            cogerDireccion(pos);

            var infowindow = new google.maps.InfoWindow({
                map: mapAlta,
                position: pos,
                content: '<div><table><tr><td style="font-size:x-small; font-weight:bold;">reportar incidència en </td></tr><tr><td style="font-size:x-small; font-weight:normal;">' + sDireccion + '</td></tr></table></div>',
                maxWidth: 300
            });

    var marker = new google.maps.Marker({
        position: pos,
        map: mapAlta,
        title: 'incidència aquí'
        });

    mapAlta.setCenter(pos);

    $('#labelDireccion').text(sDireccion);

    $('#divMapaAlta').gmap('refresh');

    if (!bAbrir) $('#collapsibleLocalizacion').trigger('collapse');

    }, function () { handleNoGeolocation(true); });
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
        }
}

function handleNoGeolocation(errorFlag) {
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

function cogerDireccion(pos) {
    sDireccion = '';
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
            sDireccion = $(datos).find('formatted_address').text();
            var n = 0;
            $(datos).find('formatted_address').each(function () {
                if (n == 0) sDireccion = $(this).text();
                n++;
            });
        }
    }
    catch (e)
    {
        mensaje('ERROR (exception) en cogerDireccion : \n' + e.code + '\n' + e.message);
    }
}

// -------- ENVIAR INCIDENCIA -----------------------------------------------------------------------
function enviarIncidencia() {
    var sObs = $('#textareaComentari').val();
    var sCoord = pos.toString().replace(" ", "").replace("(","").replace(")","")

    var llamaWS = "http://213.27.242.251:8000/wsIncidentNotifier/wsIncidentNotifier.asmx/NuevaIncidencia";
    var sParam  = "sObs=" + sObs;
        sParam += "&sCoord=" + sCoord;
        sParam += "&sDir=" + sDireccion;
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

function resultadoEnvio(resultado, param)
{
    if (global_AjaxERROR != '' || global_AjaxRESULTADO == null)
        mensaje(global_AjaxERROR);
    else
    {
        mensaje('Incidència notificada' + '\n' + 'Gràcies per la seva col·laboració');
    }
}




