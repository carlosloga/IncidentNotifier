// funciones COMUNES -----------------------------------------------------------------------
var pictureSource;
var destinationType;

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

function limpiaVariables(sPag){
    switch(sPag)
    {
        case 'pageNuevaIncidencia' :
            sFoto = '';
            sDireccionAlta = '';
            posAlta = null;
            mapAlta = null;
            break;
    }
}




