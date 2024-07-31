import React from 'react';
import styles from './style.module.css';

const HelpButton = ({ onHelp }) => {
  return (
    <button onClick={onHelp} className={styles.button}>
      Pedir Ayuda (-2s)
    </button>
  );
};

export default HelpButton;
