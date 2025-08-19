import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import styles from "./Misc.module.scss";

const Misc: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const handleCommunity = () => {
    console.log("Сообщество");
  };

  const handleForge = () => {
    console.log("Кузня");
  };

  const handleSupport = () => {
    console.log("Тех поддержка");
  };

  return (
    <div className={styles.misc}>
      <div className={styles.miscContainer}>
        <h1 className={styles.miscTitle}>Разное</h1>

        <div className={styles.miscContent}>
          <div className={styles.miscButtons}>
            <Button
              variant="primary"
              size="large"
              onClick={handleCommunity}
              className={styles.miscButton}
            >
              Сообщество
            </Button>

            <Button
              variant="secondary"
              size="large"
              onClick={handleForge}
              className={styles.miscButton}
            >
              Кузня
            </Button>

            <Button
              variant="outline"
              size="large"
              onClick={handleSupport}
              className={styles.miscButton}
            >
              Тех поддержка
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

export default Misc;
