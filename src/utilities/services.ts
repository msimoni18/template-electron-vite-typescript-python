const { ipcRenderer } = window.require('electron');

export const app = {
  minimize: () => ipcRenderer.send('app-minimize'),
  maximize: () => ipcRenderer.send('app-maximize'),
  unmaximize: () => ipcRenderer.send('app-unmaximize'),
  quit: () => ipcRenderer.send('app-quit'),
};
