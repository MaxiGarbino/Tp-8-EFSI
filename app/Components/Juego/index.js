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

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images');
        const data = await response.json();

        if (!data.error && data.data) {
          setCountries(data.data);
          selectRandomCountry(data.data);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

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
      setMessage(`Incorrecto. La bandera era de ${selectedCountry.name}.`);
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
    setScore(score - 1);
    const countryName = selectedCountry ? selectedCountry.name : 'desconocido';
    setMessage(`Tiempo agotado. La bandera era de ${countryName}.`);
    selectRandomCountry(countries);
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
    setTimeLeft(15);
    setMessage('');
    setShowHelp(false);
    fetchCountries(); // Volver a cargar las banderas
  };

  const endGame = () => {
    saveScore();
    setMessage(`Partida terminada. Tu puntuación final es ${score}.`);
    setTimeLeft(0); // Detener el temporizador
    // Reiniciar el juego después de un pequeño retraso para que el mensaje sea visible
    setTimeout(resetGame, 2000);
  };

  useEffect(() => {
    saveScore();
  }, [score]);

  return (
    <div className={styles.juegoContainer}>
      <h1>Adivina la bandera</h1>
      <p>Puntos: {score}</p>
      <input
        type="text"
        value={playerName}
        onChange={handlePlayerNameChange}
        placeholder="Ingresa tu nombre"
        className={styles.input}
      />
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
          {message && <p className={styles.message}>{message}</p>}
          {showHelp && <p className={styles.helpMessage}>Pista: {selectedCountry.name[0]}...</p>}
        </div>
      ) : (
        <p className={styles.loading}>Cargando bandera...</p>
      )}
      <ScoreBoard />
    </div>
  );
};


export default Juego;
