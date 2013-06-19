// funciones COMUNES -----------------------------------------------------------------------
var pictureSource;
var destinationType;
var sCambioPagina = '';

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
    $.mobile.changePage('#' + sPag, {
        transition: "flip",
        reverse: false,
        changeHash: true
    });

    sCambioPagina = sPag;
    switch(sCambioPagina)
    {
        case 'pageNuevaIncidencia' :
            $("#collapsibleLocalizacion").trigger("expand");
            break;

        case 'pageConsultaIncidencias' :
            iniciaMapaConsulta();
            break;
    }

    //espero a que esté cargado el div para que se renderice bien el plano ...
    setTimeout(inicializa,1000);
}

function inicializa(){
    //alert('ya ' + sCambioPagina);

    switch(sCambioPagina)
    {
        case 'pageNuevaIncidencia' :
            iniciaMapaAlta(true);
            break;

        case 'pageConsultaIncidencias' :
            iniciaMapaConsulta();
            break;
    }
    sCambioPagina = '';
}

function limpiaVariables(sPag){
    switch(sPag)
    {
        case 'pageNuevaIncidencia' :
            sFoto = '';
            sDireccionAlta = '';
            posAlta = '';
            mapAlta = null;
            $('#labelComentari').text('');
            $('#textareaComentari').val('');
            break;

        case 'pageConsultaIncidencias' :
            sDireccionConsulta = '';
            posConsulta = '';
            mapConsulta = null;
            break;

    }
}




