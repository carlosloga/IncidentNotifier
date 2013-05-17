// funciones COMUNES -----------------------------------------------------------------------
var pictureSource;
var destinationType;
var map;
var pos = null;
var global_AjaxERROR = '';
var global_AjaxRESULTADO = null;
var sDireccion = '';
var sFoto = '';

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

    $(document).on("mobileinit", function () {
        alert('mobileInit');
    });
}
function abrirPagina(sPag) {
    switch(sPag)
    {
        case 'pageNuevaIncidencia' :
            sFoto = '';
            iniciaMapa(true);
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
    iniciaMapa(false);
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
    sFoto = "data:image/jpeg;base64," + imageData;
    imagen.src = sFoto;
    }

function hacerFotoERROR(error) {
    mensaje('Cap foto caprutada ' + error.code);
    }

function zoomFoto(){
    $('#imgZoomFoto').attr({ src: sFoto });
    var imagen = document.getElementById('imgZoomFoto');
    imagen.style.display = 'block';
    imagen.src = sFoto;
    abrirPagina('pageZoomFoto');
}

function eliminarFoto(){
     alert('elimino');
}

// -------- LOCALIZACIÓN -----------------------------------------------------------------------
function iniciaMapa(bAbrir) {
    var mapOptions = {
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('divMapa'), mapOptions);

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            sDireccion = cogerDireccion(pos);

            var infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: '<div><table><tr><td style="font-size:x-small; font-weight:bold;">reportar incidència en </td></tr><tr><td style="font-size:x-small; font-weight:normal;">' + sDireccion + '</td></tr></table></div>',
                maxWidth: 300
            });

    var marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'incidència aquí'
        });

    map.setCenter(pos);

    $('#labelDireccion').text(sDireccion);

    $('#divMapa').gmap('refresh');

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
        map: map,
        position: new google.maps.LatLng(41.97430, 2.78241),
        content: content
        };
    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

function cogerDireccion(pos) {
    sDireccion = '';
    var llamaWS = "http://maps.googleapis.com/maps/api/geocode/xml?latlng=" + pos.toString().replace(" ", "").replace("(","").replace(")","") + "&sensor=true";
    //alert(llamaWS);
    datos = LlamaWebService('GET', llamaWS, 'application/x-www-form-urlencoded', true, 'xml', false, false, 10000, null, null);
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
return sDireccion;
}

// -------- ENVIAR INCIDENCIA -----------------------------------------------------------------------
function enviarIncidencia() {
    mensaje('enviando ando ...');
    }


