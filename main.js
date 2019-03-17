const { app, BrowserWindow, ipcMain } = require('electron');const express = require('express');
const eapp = express();
const port = 3000;
let ready = false;

/**
 *  Here a Electron window will be created, it is just a simple html file
 */
let win;

function createWindow () {
    win = new BrowserWindow({ width: 800, height: 600 });
    win.loadFile('index.html');
    win.webContents.on('did-finish-load', () => {
       ready = true;
    });
    win.on('closed', () => {
        win = null;
    })
}

app.on('ready', createWindow);


app.on('activate', () => {

    if (win === null) {
        createWindow();
    }
});

/**
 *  This is the part where a web server is created using ExpressJS
 */
eapp.use(function (req, res, next) {
    console.log('Time:', Date.now());
    if (ready) {
        win.webContents.send('ping', req.method)
    }
    next();
});

eapp.get('/', (req, res) => res.send('Hello World!'));

eapp.listen(port, () => console.log(`Example app listening on port ${port}!`));
