// funciones COMUNES -----------------------------------------------------------------------
var pictureSource;
var destinationType;

window.addEventListener('load', function () {
    if (phoneGapRun()) {
    document.addEventListener("deviceReady", deviceReady, false);
    } else {
    deviceReady();
    }
}, false);

function deviceReady() {
    alert('dReady');
    if (phoneGapRun()) {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    }
$(document).on("mobileinit", function () {
    alert('mobileInit');
    });
}

function abrirPagina(sPag) {
    $.mobile.changePage('#' + sPag, {
        transition: "flip",
        reverse: false,
        changeHash: true
    });
}

// pageNuevaIncidencia -------------------------------------------------------------------
var map;
var pos = null;
var global_AjaxERROR = '';
var global_AjaxRESULTADO = null;
var sDireccion = '';

//Al cerrarse el aordeón del Comentari, que se ponga el texto en su cabecera
$('#collapsibleComentario').bind('collapse', function () {
    $('#labelComentari').text( $('#textareaComentari').val() );
    });

// -------- ABRIR CAMARA PARA HACER FOTO --------------------------------------------------------
function hacerFoto() {
    //iniciaMapa(false);

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
    imagen.src = "data:image/jpeg;base64," + imageData;
    mensaje('Capturada : ' + imageData[0]);
    }

function hacerFotoERROR(error) {
    mensaje('Error capturant : ' + error.code);
    }


// -------- LOCALIZACIÓN -----------------------------------------------------------------------
$('#pageNuevaIncidencia').live('pageinit', function () {
    alert('mapa');
    iniciaMapa(true);
    });

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
    if (global_AjaxERROR != '') alert(global_AjaxERROR);
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


