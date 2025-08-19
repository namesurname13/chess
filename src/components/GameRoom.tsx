import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChessBoard from "./ChessBoard";
import Button from "./Button";
import { useChessStore } from "../stores/useChessStore";
import { socketService } from "../services/socketService";
import styles from "./GameRoom.module.scss";

interface GameRoomProps {
  gameId?: string;
  gameType: "quick" | "rated" | "friend";
}

const GameRoom: React.FC<GameRoomProps> = ({ gameId, gameType }) => {
  const navigate = useNavigate();
  const {
    gameStatus,
    playerColor,
    opponent,
    gameResult,
    isConnected,
    makeMove,
    resetGame,
    leaveGame,
  } = useChessStore();

  useEffect(() => {
    // Подключаемся к серверу
    socketService.connect();

    // Инициализируем игру
    if (gameType === "quick") {
      socketService.findQuickGame();
    } else if (gameType === "rated") {
      socketService.createGame();
    } else if (gameType === "friend" && gameId) {
      socketService.joinGame(gameId);
    }

    return () => {
      socketService.disconnect();
      resetGame();
    };
  }, [gameType, gameId, resetGame]);

  const handleMove = (from: string, to: string, promotion?: string) => {
    const success = makeMove(from, to, promotion);
    if (success) {
      socketService.makeMove(from, to, promotion);
    }
    return success;
  };

  const handleLeaveGame = () => {
    socketService.leaveGame();
    leaveGame();
    navigate("/online-game");
  };

  const getStatusMessage = () => {
    switch (gameStatus) {
      case "waiting":
        return "Ожидание соперника...";
      case "playing":
        return opponent ? `Игра против ${opponent.name}` : "Игра началась";
      case "finished":
        if (gameResult === "win") return "Победа!";
        if (gameResult === "loss") return "Поражение";
        if (gameResult === "draw") return "Ничья";
        return "Игра завершена";
      case "error":
        return "Ошибка соединения";
      default:
        return "Подключение...";
    }
  };

  const getResultMessage = () => {
    if (gameResult === "win") return "🎉 Поздравляем с победой!";
    if (gameResult === "loss") return "😔 Попробуйте еще раз";
    if (gameResult === "draw") return "🤝 Ничья";
    return "";
  };

  return (
    <div className={styles.gameRoom}>
      <div className={styles.gameHeader}>
        <div className={styles.statusInfo}>
          <div className={styles.connectionStatus}>
            {isConnected ? "🟢 Подключен" : "🔴 Отключен"}
          </div>
          <div className={styles.gameStatus}>{getStatusMessage()}</div>
          {gameResult && (
            <div className={styles.gameResult}>{getResultMessage()}</div>
          )}
        </div>

        <div className={styles.playerInfo}>
          {opponent && (
            <div className={styles.opponent}>
              <span>Соперник: {opponent.name}</span>
              <span>Рейтинг: {opponent.rating}</span>
            </div>
          )}
          {playerColor && (
            <div className={styles.playerColor}>
              Играете за: {playerColor === "w" ? "Белые" : "Черные"}
            </div>
          )}
        </div>
      </div>

      <div className={styles.gameBoard}>
        <ChessBoard
          onMove={handleMove}
          disabled={gameStatus !== "playing"}
          orientation={playerColor === "b" ? "black" : "white"}
          showMoveHistory={true}
        />
      </div>

      <div className={styles.gameControls}>
        <Button variant="outline" size="medium" onClick={handleLeaveGame}>
          Покинуть игру
        </Button>

        {gameStatus === "finished" && (
          <Button
            variant="primary"
            size="medium"
            onClick={() => navigate("/online-game")}
          >
            Новая игра
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameRoom;
