import React, { useState, useMemo } from "react";
import { Chess } from "chess.js";
import type { Square } from "chess.js";
import Button from "./Button";
import styles from "./LocalGame.module.scss";

interface LocalGameProps {
  onBackToMenu?: () => void;
}

const LocalGame: React.FC<LocalGameProps> = ({ onBackToMenu }) => {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<string>("");

  // Вычисляем доступные ходы для выбранной фигуры
  const availableMoves = useMemo(() => {
    if (!selectedSquare) return new Set();

    const moves = new Set<Square>();
    const piece = game.get(selectedSquare);

    if (!piece) return moves;

    // Получаем все возможные ходы для выбранной фигуры
    const allMoves = game.moves({ square: selectedSquare, verbose: true });

    allMoves.forEach((move) => {
      if (typeof move === "object" && "to" in move) {
        moves.add(move.to as Square);
      }
    });

    return moves;
  }, [selectedSquare, game]);

  const handleSquareClick = (square: Square) => {
    if (gameOver) return;

    const piece = game.get(square);
    const isSelected = selectedSquare === square;
    const isAvailableMove = availableMoves.has(square);

    // Если кликнули на доступный ход - делаем ход
    if (isAvailableMove) {
      try {
        const move = game.move({ from: selectedSquare!, to: square });
        if (move) {
          const newGame = new Chess(game.fen());
          setGame(newGame);
          setMoveHistory((prev) => [...prev, move.san]);
          setSelectedSquare(null);

          // Check if game is over
          if (newGame.isGameOver()) {
            setGameOver(true);
            if (newGame.isCheckmate()) {
              setGameResult("Шах и мат!");
            } else if (newGame.isDraw()) {
              setGameResult("Ничья!");
            } else if (newGame.isStalemate()) {
              setGameResult("Пат!");
            }
          }
        }
      } catch (error) {
        console.error("Invalid move:", error);
      }
      return;
    }

    // Если кликнули на ту же фигуру - отменяем выбор
    if (isSelected) {
      setSelectedSquare(null);
      return;
    }

    // Если кликнули на фигуру - выбираем её
    if (piece) {
      setSelectedSquare(square);
      return;
    }

    // Если кликнули на пустую клетку - отменяем выбор
    setSelectedSquare(null);
  };

  const resetGame = () => {
    setGame(new Chess());
    setSelectedSquare(null);
    setMoveHistory([]);
    setGameOver(false);
    setGameResult("");
  };

  const renderBoard = () => {
    const board = [];
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const square = (files[file] + ranks[rank]) as Square;
        const piece = game.get(square);
        const isLightSquare = (file + rank) % 2 === 0;
        const isSelected = selectedSquare === square;
        const isAvailableMove = availableMoves.has(square);

        board.push(
          <div
            key={square}
            className={`${styles.square} ${
              isLightSquare ? styles.light : styles.dark
            } ${isSelected ? styles.selected : ""} ${
              isAvailableMove ? styles.availableMove : ""
            }`}
            onClick={() => handleSquareClick(square)}
          >
            {piece && (
              <div
                className={`${styles.piece} ${styles[piece.color]} ${
                  styles[piece.type]
                }`}
              >
                {getPieceSymbol(piece.type, piece.color)}
              </div>
            )}
            {isAvailableMove && !piece && (
              <div className={styles.moveIndicator}></div>
            )}
          </div>
        );
      }
    }

    return board;
  };

  const getPieceSymbol = (type: string, color: string) => {
    const symbols: Record<string, Record<string, string>> = {
      p: { w: "♙", b: "♟" },
      r: { w: "♖", b: "♜" },
      n: { w: "♘", b: "♞" },
      b: { w: "♗", b: "♝" },
      q: { w: "♕", b: "♛" },
      k: { w: "♔", b: "♚" },
    };
    return symbols[type]?.[color] || "";
  };

  return (
    <div className={styles.localGame}>
      <div className={styles.gameHeader}>
        <h2>Игра сам с собой</h2>
        {gameOver && <div className={styles.gameResult}>{gameResult}</div>}
      </div>

      <div className={styles.boardContainer}>
        <div className={styles.board}>{renderBoard()}</div>
      </div>

      {moveHistory.length > 0 && (
        <div className={styles.moveHistory}>
          <h3>История ходов</h3>
          <div className={styles.movesList}>
            {moveHistory.map((move, index) => (
              <span key={index} className={styles.move}>
                {Math.floor(index / 2) + 1}.{index % 2 === 0 ? "" : " "}
                {move}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={styles.controls}>
        <Button variant="primary" size="medium" onClick={resetGame}>
          Новая игра
        </Button>

        {onBackToMenu && (
          <Button variant="outline" size="medium" onClick={onBackToMenu}>
            ← Назад в меню
          </Button>
        )}
      </div>
    </div>
  );
};

export default LocalGame;
