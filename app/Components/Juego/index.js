"use client";

import React, { useState, useEffect } from 'react';
import Timer from './../Timer';
import ScoreBoard from './../ScoreBoard';
import HelpButton from './../HelpButton';
import styles from './style.module.css';

const Juego = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);
  const [message, setMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // Controla si el juego está en progreso

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images');
        const data = await response.json();

        if (!data.error && data.data) {
          setCountries(data.data);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const startGame = () => {
    selectRandomCountry(countries);
    setGameStarted(true);
    setMessage('');
  };

  const selectRandomCountry = (countriesArray) => {
    const randomCountry = countriesArray[Math.floor(Math.random() * countriesArray.length)];
    setSelectedCountry(randomCountry);
    setTimeLeft(15); // Reiniciar el temporizador para la nueva bandera
  };

  const handleGuess = () => {
    if (guess.toLowerCase() === selectedCountry.name.toLowerCase()) {
      setScore(score + 10 + timeLeft);
      setMessage(`¡Correcto! Has sumado ${10 + timeLeft} puntos.`);
    } else {
      setScore(score - 1);
      setMessage(`No es la respuesta. La bandera era de ${selectedCountry.name}.`);
    }

    setGuess('');
    selectRandomCountry(countries);
  };

  const handleHelp = () => {
    if (timeLeft > 2) {
      setShowHelp(true);
      setTimeLeft(timeLeft - 2);
    } else {
      setMessage('No tienes suficiente tiempo para pedir ayuda.');
    }
  };

  const handleTimeUp = () => {
    if (gameStarted) {
      setScore(score - 1);
      const countryName = selectedCountry ? selectedCountry.name : 'desconocido';
      setMessage(`Tiempo agotado. La bandera era de ${countryName}.`);
      selectRandomCountry(countries);
    }
  };

  const handlePlayerNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  const saveScore = () => {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push({ name: playerName, score });
    localStorage.setItem('scores', JSON.stringify(scores));
  };

  const resetGame = () => {
    setScore(0);
    setPlayerName('');
    setGuess('');
    setSelectedCountry(null);
    setMessage('');
    setShowHelp(false);
    setGameStarted(false); // Detener el juego y volver a la pantalla inicial
  };

  const endGame = () => {
    saveScore();
    setMessage(`Partida terminada. Tu puntuación final es ${score}.`);
    setGameStarted(false); // Marcar que el juego ha terminado
    resetGame();
    //localStorage.clear()
  };

  return (
    <div className={styles.juegoContainer}>
      {!gameStarted ? (
        <div className={styles.startScreen}>
          <h1>Bienvenido al Juego de Adivinar la Bandera</h1>
          <input
            type="text"
            value={playerName}
            onChange={handlePlayerNameChange}
            placeholder="Ingresa tu nombre"
            className={styles.input}
          />
          <button onClick={startGame} className={styles.button2}>Comenzar Juego</button>
          <ScoreBoard />
        </div>
      ) : (
        <>
          <h1>Adivina la bandera</h1>
          <p>Puntos: {score}</p>
          <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} onTimeUp={handleTimeUp} />
          {selectedCountry ? (
            <div className={styles.flagContainer}>
              <img
                src={selectedCountry.flag}
                alt={`Bandera de ${selectedCountry.name}`}
                className={styles.flagImage}
              />
              <p>¿Cuál país es esta bandera?</p>
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Escribe el nombre del país"
                className={styles.input}
              />
              <button onClick={handleGuess} className={styles.button}>Adivinar</button>
              <HelpButton onHelp={handleHelp} />
              <button onClick={endGame} className={styles.button}>Terminar partida</button>
              {message && <p className={
                message.includes('No')
                  ? styles.messageIncorrect
                  : styles.messageCorrect
              }>{message}</p>}
              {showHelp && <p className={styles.helpMessage}>Pista: {selectedCountry.name[0]}...</p>}
            </div>
          ) : (
            <p className={styles.loading}>Cargando bandera...</p>
          )}

          <ScoreBoard />
        </>
      )}
    </div>
  );
};

export default Juego;
