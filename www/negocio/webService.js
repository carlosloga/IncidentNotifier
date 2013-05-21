
// ********************* METODOS PARA EL ACCESO A WebServices Y OBTENCIÓN DE DATOS ********************************

function LlamaWebService(sTipoLlamada, sUrl,sContentType, bCrossDom, sDataType, bProcData, bCache, nTimeOut, funcion, pasaParam) {
    global_AjaxRESULTADO = null;
    global_AjaxERROR = '';

    $.ajax({
        type: sTipoLlamada,
        url: sUrl,
        //data: sParametros,
        contentType: sContentType,
        crossDomain: bCrossDom,
        dataType: sDataType,
        processData: bProcData,
        cache: bCache,
        timeout: nTimeOut,
        success: function (xml) {    alert('success');
            global_AjaxRESULTADO = xml;
            if (funcion != null) {
                funcion(global_AjaxRESULTADO, pasaParam);
            }
            else return global_AjaxRESULTADO;
        },
        error: function (e, f, g) { alert('error');
            global_AjaxERROR = 'ERROR en LlamaWebService \r\n' + e.message + ' ' + e.Description + ' ' + f + ' ' + g + ' en ' + ws + '  ' + sUrl + ' amb ' + sParametros;
            alert(global_AjaxERROR);
            if (funcion != null) funcion(global_AjaxERROR, pasaParam);
        },
        async: false
    });
    return global_AjaxRESULTADO;
}
