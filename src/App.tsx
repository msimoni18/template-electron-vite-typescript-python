import React from 'react';
import Titlebar from './components/Titlebar/Titlebar';
import { ModeToggle } from './components/ToggleMode';
import { get } from './utilities/requests';
import './App.css';

export default function App() {
  const [res, setRes] = React.useState('');

  React.useEffect(() => {
    get(
      'example',
      (response: { message: string }) => setRes(response.message),
      (error) => console.error(error),
    );
  }, []);

  return (
    <div className="h-screen">
      <Titlebar />
      <div className="text-center flex flex-col gap-4 justify-center h-full text-zinc-900 dark:bg-zinc-900 dark:text-zinc-200">
        <h1 className="text-3xl">
          Template for building Electron apps with typscript+react, python, and
          tailwindcss.
        </h1>
        <p>v{import.meta.env.VITE_APP_VERSION}</p>
        <p>Message from /example route: {res}</p>
        <div>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
