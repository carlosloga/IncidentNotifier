
function phoneGapRun() {
    return(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/));
}

function mensaje(msg) {
    if(phoneGapRun())
        navigator.notification.alert(msg, null, 'Atenció');
    else
        alert(msg);
}

function abrirPopUp(pag){
    $.mobile.changePage("#" + pag, { transition: "pop", role: "dialog", reverse: true, changeHash: true });
}

function nuevoMarcadorSobrePlano(mapa, pos, texto){
    var marker = new google.maps.Marker({
        position: pos,
        map: mapa,
        title: texto
    });
}

function getCurrentPositionError(errorFlag) {
    var content = '';
    if (errorFlag) {
        content = 'Error en el servei de geolocalització.';
    } else {
        content = 'Error: el seu navegador no soporta geolocalització';
    }
    mensaje(content);
}

