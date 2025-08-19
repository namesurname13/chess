import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import styles from "./Home.module.scss";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleTraining = () => {
    navigate("/training");
  };

  const handleOnlineGame = () => {
    navigate("/online-game");
  };

  const handleTournament = () => {
    navigate("/tournament");
  };

  const handleMisc = () => {
    navigate("/misc");
  };

  return (
    <div className={styles.home}>
      <div className={styles.homeContainer}>
        <h1 className={styles.homeTitle}>Шахматы</h1>

        <div className={styles.homeButtons}>
          {/* Кнопка тренировка */}
          <Button
            variant="primary"
            size="large"
            onClick={handleTraining}
            className={`${styles.homeButton} ${styles.trainingButton}`}
          >
            Тренировка
          </Button>

          {/* Две кнопки в ряд */}
          <div className={styles.homeButtonRow}>
            <Button
              variant="secondary"
              size="medium"
              onClick={handleOnlineGame}
              className={styles.homeButton}
            >
              Игра по сети
            </Button>

            <Button
              variant="secondary"
              size="medium"
              onClick={handleTournament}
              className={styles.homeButton}
            >
              Турнир
            </Button>
          </div>

          {/* Кнопка разное */}
          <Button
            variant="outline"
            size="medium"
            onClick={handleMisc}
            className={`${styles.homeButton} ${styles.miscButton}`}
          >
            Разное
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
