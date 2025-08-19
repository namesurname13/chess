import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import GameRoom from "../components/GameRoom";
import styles from "./OnlineGame.module.scss";

const OnlineGame: React.FC = () => {
  const navigate = useNavigate();
  const [currentGame, setCurrentGame] = useState<{
    type: "quick" | "rated" | "friend";
    gameId?: string;
  } | null>(null);
  const [friendGameId, setFriendGameId] = useState("");

  const handleBack = () => {
    navigate("/");
  };

  const handleRatedGame = () => {
    setCurrentGame({ type: "rated" });
  };

  const handleFriendGame = () => {
    if (friendGameId.trim()) {
      setCurrentGame({ type: "friend", gameId: friendGameId.trim() });
    }
  };

  const handleQuickGame = () => {
    setCurrentGame({ type: "quick" });
  };

  const handleBackToMenu = () => {
    setCurrentGame(null);
    setFriendGameId("");
  };

  if (currentGame) {
    return (
      <div className={styles.onlineGame}>
        <GameRoom gameType={currentGame.type} gameId={currentGame.gameId} />
        <Button
          variant="outline"
          size="medium"
          onClick={handleBackToMenu}
          className={styles.backButton}
        >
          ← Назад в меню
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.onlineGame}>
      <div className={styles.onlineGameContainer}>
        <h1 className={styles.onlineGameTitle}>Игра по сети</h1>

        <div className={styles.onlineGameContent}>
          <div className={styles.onlineGameButtons}>
            <Button
              variant="primary"
              size="large"
              onClick={handleRatedGame}
              className={styles.onlineGameButton}
            >
              Игра по рейтингу
            </Button>

            <Button
              variant="secondary"
              size="large"
              onClick={handleQuickGame}
              className={styles.onlineGameButton}
            >
              Быстрая игра
            </Button>

            <div className={styles.friendGameSection}>
              <h3>Игра с другом</h3>
              <div className={styles.friendGameInput}>
                <input
                  type="text"
                  placeholder="Введите ID игры"
                  value={friendGameId}
                  onChange={(e) => setFriendGameId(e.target.value)}
                  className={styles.gameIdInput}
                />
                <Button
                  variant="outline"
                  size="medium"
                  onClick={handleFriendGame}
                  disabled={!friendGameId.trim()}
                >
                  Присоединиться
                </Button>
              </div>
            </div>
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

export default OnlineGame;
