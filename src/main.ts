import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { spawn } from 'child_process';
import get from 'axios';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
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
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const port = 5050;

  // Start the flask server in development or production
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    spawn(`flask run --port ${port}`, {
      detached: true,
      shell: true,
      stdio: 'inherit',
    });
  } else {
    const runFlask = {
      darwin: `open -gj "${path.join(
        app.getAppPath(),
        'resources',
        'app',
        'app',
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

  // Delay window creation because the flask
  // server takes longer to start than the
  // browser window. If the browser window
  // starts before the flask server, fetch
  // errors occur.
  setTimeout(() => {
    createWindow();
  }, 5000);

  ipcMain.handle('ping', () => 'pong');

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/**
 * @description - Shuts down Electron & Flask.
 * @param {number} port - Port that Flask server is running on.
 */
const shutdown = (port: number) => {
  get(`http://localhost:${port}/quit`).then(app.quit).catch(app.quit);
};

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    shutdown(5050);
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
