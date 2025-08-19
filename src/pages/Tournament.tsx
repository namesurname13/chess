import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import styles from "./Tournament.module.scss";

const Tournament: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const handleRegisterTournament = () => {
    console.log("Записаться на турнир");
  };

  const handleTournamentSchedule = () => {
    console.log("График турниров");
  };

  const handleEvents = () => {
    console.log("Мероприятия");
  };

  return (
    <div className={styles.tournament}>
      <div className={styles.tournamentContainer}>
        <h1 className={styles.tournamentTitle}>Турнир</h1>

        <div className={styles.tournamentContent}>
          <div className={styles.tournamentButtons}>
            <Button
              variant="primary"
              size="large"
              onClick={handleRegisterTournament}
              className={styles.tournamentButton}
            >
              Записаться на турнир
            </Button>

            <Button
              variant="secondary"
              size="large"
              onClick={handleTournamentSchedule}
              className={styles.tournamentButton}
            >
              График турниров
            </Button>

            <Button
              variant="outline"
              size="large"
              onClick={handleEvents}
              className={styles.tournamentButton}
            >
              Мероприятия
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          size="medium"
          onClick={handleBack}
          className={styles.backButton}
        >
          ← Назад
        </Button>
      </div>
    </div>
  );
};

export default Tournament;
