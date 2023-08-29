import { spawnSync } from 'child_process';

function buildPython() {
  console.log('Creating Python distribution files...');

  const app = 'app.py';
  // const icon = './public/favicon.ico';

  const options = [
    // '--noconsole', // No shell
    '--noconfirm', // Don't confirm overwrite
    '--distpath ./resources', // Dist (out) path
    // `--icon ${icon}`, // Icon to use
  ].join(' ');

  spawnSync(`pyinstaller ${options} ${app}`, {
    detached: false,
    shell: true,
    stdio: 'inherit',
  });
}

function buildElectron() {
  console.log('Creating Electron build...')
  spawnSync('electron-forge make', {
    detached: false,
    shell: true,
    stdio: 'inherit',
  });
}

buildPython();
buildElectron();
