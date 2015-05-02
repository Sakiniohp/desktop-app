var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

var Menu = require('menu');
var MenuItem = require('menu-item');

function buildMenu(items) {
  var menu = new Menu();
  for(var i = 0; i < items.length; ++i) {
    var item = items[i];
    if(item.submenu) {
      item.submenu = buildMenu(item.submenu);
    }
    var item = new MenuItem(item);

    menu.append(item);
  }
  return menu;
}

function setMenu() {
  var template = [
    {
      label: 'Leanote',
      submenu: [
        {
          label: 'About Leanote',
          selector: 'orderFrontStandardAboutPanel:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide Electron',
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        {
          label: 'Show All',
          selector: 'unhideAllApplications:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() { app.quit(); }
        },
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Command+Z',
          selector: 'undo:'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+Command+Z',
          selector: 'redo:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'Command+X',
          selector: 'cut:'
        },
        {
          label: 'Copy',
          accelerator: 'Command+C',
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: 'Command+V',
          selector: 'paste:'
        },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        },
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); }
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Command+I',
          click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
        },
      ]
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        {
          label: 'Close',
          accelerator: 'Command+W',
          selector: 'performClose:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Bring All to Front',
          selector: 'arrangeInFront:'
        },
      ]
    },
    {
      label: 'Mode',
      submenu: [
        {
          label: 'Toggle Fullscreen',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        {
          label: 'Toggle Presentation',
          accelerator: 'Command+W',
          selector: 'performClose:'
        }
      ]
    },
    {
      label: 'Help',
      submenu: []
    },
  ];

  // menu = Menu.buildFromTemplate(template);

  menu = buildMenu(template);

  Menu.setApplicationMenu(menu); // Must be called within app.on('ready', function(){ ... });
}

function openIt() {

  app.getPath('appData');

  // var Evt = require('evt');
  // var basePath = '/Users/life/Library/Application Support/Leanote'; // require('nw.gui').App.dataPath;
  // Evt.setDataBasePath(basePath);

  // leanote protocol
  // require('leanote_protocol');

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1050, height: 595, frame: false, transparent: false });

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/note.html');


  // 不能放在这里, 刚开始有图片, 之后添加的图片不能显示 ??
  // // 启动服务器, 图片
  // var Server = require('server');
  // Server.start();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  var ipc = require('ipc');
  mainWindow.on('focus', function() {
    // ipc.send('focusWindow'); mainProcess没有该方法
    mainWindow.webContents.send('focusWindow');
  });
  mainWindow.on('blur', function() {
    mainWindow.webContents.send('blurWindow');
  });
  /*
  mainWindow.on('close', function() {
    mainWindow.webContents.send('closeWindow');
  });
  */

/*
  ipc.on('asynchronous-message', function(event, arg) {
    console.log(arg);  // prints "ping"
    event.sender.send('asynchronous-reply', 'pong');
  });

  ipc.on('synchronous-message', function(event, arg) {
    console.log(arg);  // prints "ping"
    event.returnValue = 'pong';
  });
*/

  // setMenu();
}

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', openIt);


app.on('activate-with-no-open-windows', function(){ 
  openIt();
});