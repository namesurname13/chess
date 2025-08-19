import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import LocalGame from "../components/LocalGame";
import styles from "./Training.module.scss";

const Training: React.FC = () => {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState<string | null>(null);

  const handleBack = () => {
    navigate("/");
  };

  const handleBackToMenu = () => {
    setCurrentMode(null);
  };

  const handleAITraining = () => {
    console.log("Тренировка против ИИ");
  };

  const handleSelfGame = () => {
    setCurrentMode("self-game");
  };

  const handleTasks = () => {
    console.log("Задачи и квесты");
  };

  if (currentMode === "self-game") {
    return (
      <div className={styles.training}>
        <LocalGame onBackToMenu={handleBackToMenu} />
      </div>
    );
  }

  return (
    <div className={styles.training}>
      <div className={styles.trainingContainer}>
        <h1 className={styles.trainingTitle}>Тренировка</h1>

        <div className={styles.trainingContent}>
          <div className={styles.trainingButtons}>
            <Button
              variant="primary"
              size="large"
              onClick={handleAITraining}
              className={styles.trainingButton}
            >
              Тренировка против ИИ
            </Button>

            <Button
              variant="secondary"
              size="large"
              onClick={handleSelfGame}
              className={styles.trainingButton}
            >
              Игра сам с собой
            </Button>

            <Button
              variant="outline"
              size="large"
              onClick={handleTasks}
              className={styles.trainingButton}
            >
              Задачи и квесты
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

export default Training;
