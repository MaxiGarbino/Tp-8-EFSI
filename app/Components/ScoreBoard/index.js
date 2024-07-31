import React, { useEffect, useState } from 'react';
import styles from './style.module.css';

const ScoreBoard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem('scores')) || [];
    setScores(storedScores);
  }, []);

  return (
    <div className={styles.scoreboard}>
      <h2>Tabla de Puntajes</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>
            {score.name}: {score.score} puntos
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScoreBoard;
