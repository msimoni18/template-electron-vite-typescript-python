import React from 'react';
import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeMinimize,
  VscCollapseAll,
} from 'react-icons/vsc';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const buttonStyle =
  'h-8 w-8 p-0 flex items-center justify-center pointer bg-transparent hover:bg-zinc-300 dark:hover:bg-zinc-700';

const CloseButton = (props: Props) => {
  return (
    <button
      {...props}
      className={buttonStyle}
      aria-label="close"
      title="Close"
      type="button"
    >
      <VscChromeClose />
    </button>
  );
};

const ContractButton = (props: Props) => {
  return (
    <button
      {...props}
      className={buttonStyle}
      aria-label="contract"
      title="Contract"
      type="button"
    >
      <VscCollapseAll />
    </button>
  );
};

const MinimizeButton = (props: Props) => {
  return (
    <button
      {...props}
      className={buttonStyle}
      aria-label="minimize"
      title="Minimize"
      type="button"
    >
      <VscChromeMinimize />
    </button>
  );
};

const MaximizeButton = (props: Props) => {
  return (
    <button
      {...props}
      className={buttonStyle}
      aria-label="maximize"
      title="Maximize"
      type="button"
    >
      <VscChromeMaximize />
    </button>
  );
};

export { CloseButton, ContractButton, MaximizeButton, MinimizeButton };
