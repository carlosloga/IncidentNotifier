function cargarBD() {
    var data = getEstructuraTablas();

    try {
        //inicializar la BD
        db.catalog.createTables(data);
    }
    catch (err) {
       alert('ERROR BD : ' + err);
    }
}




