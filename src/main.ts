// Electron modules
import { app, BrowserWindow, ipcMain } from 'electron';

// Built-in modules
import { spawn, exec } from 'child_process';
import path from 'path';

// Extra modules
import getPort, { portNumbers } from 'get-port';
import get from 'axios';

// Shut down flask server and electron
const shutdown = (port: number) => {
  // Kill app executable if production
  if (!MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    const killcmd = {
      darwin: 'killall app',
      linux: '',
      win32: 'taskkill /f /t /im app.exe',
      aix: undefined,
      android: undefined,
      cygwin: undefined,
      freebsd: undefined,
      haiku: undefined,
      netbsd: undefined,
      openbsd: undefined,
      sunos: undefined,
    }[process.platform];

    exec(killcmd, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  }
  get(`http://localhost:${port}/quit`).then(app.quit).catch(app.quit);
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (port: number) => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    frame: false,
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Listen and respond to ipcRenderer events on the frontend.
  ipcMain.on('app-minimize', () => mainWindow.minimize());
  ipcMain.on('app-maximize', () => mainWindow.maximize());
  ipcMain.on('app-unmaximize', () => mainWindow.unmaximize());
  ipcMain.on('app-quit', () => shutdown(port));
  ipcMain.on('get-port-number', (event) => {
    event.returnValue = port;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  const port = await getPort({ port: portNumbers(3000, 3099) });

  // Start the flask server in development or production
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    spawn(`python app.py ${port}`, {
      detached: true,
      shell: true,
      stdio: 'inherit',
    });
  } else {
    const runFlask = {
      darwin: `open -gj "${path.join(
        app.getAppPath(),
        'resources',
        'app.app',
      )}" --args`,
      linux: './resources/app/app',
      win32: 'start ./resources/app/app.exe',
      aix: undefined,
      android: undefined,
      cygwin: undefined,
      freebsd: undefined,
      haiku: undefined,
      netbsd: undefined,
      openbsd: undefined,
      sunos: undefined,
    }[process.platform];

    spawn(`${runFlask} ${port}`, {
      detached: false,
      shell: true,
      stdio: 'pipe',
    });
  }

  // Delay starting browser window to give time
  // for flask server to start
  setTimeout(() => {
    createWindow(port);
  }, 5000);

  app.on('activate', () => {
    //  On macOS it's common to re-create a window in the app when the
    //  dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow(port);
  });

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      shutdown(port);
    }
  });
});
