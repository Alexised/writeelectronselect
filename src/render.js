const { ipcMain } = require('electron')
ipcMain.on('cambiarContenido', (event, arg) => {
    var JSZip = require('jszip');
    var Docxtemplater = require('docxtemplater');

    var fs = require('fs');
    var path = require('path');

    //Load the docx file as a binary
    var content = fs
        .readFileSync(path.resolve(__dirname, contenido), 'binary');
    //console.log(contenido)
    var zip = new JSZip(content);

    var doc = new Docxtemplater();
    doc.loadZip(zip);
    doc.setOptions({ delimiters: { start: '<', end: '>' } })

    //set the templateVariables
    doc.setData({
        first_name: 'ALEXIS',
        last_name: 'PRUEBA',

    });

    try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render()
    }
    catch (error) {
        var e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        }
        console.log(JSON.stringify({ error: e }));
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
        throw error;
    }

    var buf = doc.getZip()
        .generate({ type: 'nodebuffer' });

    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    fs.writeFileSync(path.resolve(__dirname, 'output.docx'), buf);
    event.sender.send('reply-mainjsfunction', res)
})
