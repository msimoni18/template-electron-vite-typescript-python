const { ipcRenderer } = window.require('electron');

const port = ipcRenderer.sendSync('get-port-number');

export const get = (
  route: string,
  callback: (response: object) => void,
  errorCallback?: (response: object) => void,
) => {
  fetch(`http://localhost:${port}/${route}`)
    .then((response) => response.json())
    .then(callback)
    .catch((error) =>
      errorCallback ? errorCallback(error as Error) : console.error(error),
    );
};

export const post = (
  body: string,
  route: string,
  callback: (response: object) => void,
  errorCallback?: (response: object) => void,
) => {
  fetch(`http://localhost:${port}/${route}`, {
    body,
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
  })
    .then((response) => response.json())
    .then(callback)
    .catch((error) =>
      errorCallback ? errorCallback(error as Error) : console.error(error),
    );
};
