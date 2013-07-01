function cargarBD() {
    var data = getEstructuraTablas();

    try {
        //inicializar la BD
        db.catalog.createTables(data);
        db.catalog.setPersistenceScope(db.catalog.SCOPE_LOCAL);
        db.commit();
    }
    catch(err) {
        if (err instanceof Exception) {
            alert('ERROR : ' + err.getVerboseMessage());
        }
        else {
            alert('ERROR : ' + err);
        }
    }
}




