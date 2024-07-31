import React, { useEffect } from 'react';

const Timer = ({ timeLeft, setTimeLeft, onTimeUp }) => {
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      onTimeUp();
    }
  }, [timeLeft, setTimeLeft, onTimeUp]);

  return <p>Tiempo restante: {timeLeft}s</p>;
};

export default Timer;
