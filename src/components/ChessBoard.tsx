import React, { useState, useMemo } from "react";
import type { Square } from "chess.js";
import { useChessStore } from "../stores/useChessStore";
import styles from "./ChessBoard.module.scss";

interface ChessBoardProps {
  onMove?: (from: string, to: string, promotion?: string) => void;
  disabled?: boolean;
  orientation?: "white" | "black";
  showMoveHistory?: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  onMove,
  disabled = false,
  orientation = "white",
  showMoveHistory = true,
}) => {
  const { game, isMyTurn, gameStatus, moveHistory } = useChessStore();
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  // Вычисляем доступные ходы для выбранной фигуры
  const availableMoves = useMemo(() => {
    if (!selectedSquare || disabled || gameStatus !== "playing" || !isMyTurn)
      return new Set();

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
  }, [selectedSquare, game, disabled, gameStatus, isMyTurn]);

  const handleSquareClick = (square: Square) => {
    if (disabled || gameStatus !== "playing" || !isMyTurn) return;

    const piece = game.get(square);
    const isSelected = selectedSquare === square;
    const isAvailableMove = availableMoves.has(square);

    // Если кликнули на доступный ход - делаем ход
    if (isAvailableMove) {
      const success = onMove?.(selectedSquare!, square);
      if (success) {
        setSelectedSquare(null);
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

  const renderBoard = () => {
    const board = [];
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const ranks =
      orientation === "white"
        ? ["8", "7", "6", "5", "4", "3", "2", "1"]
        : ["1", "2", "3", "4", "5", "6", "7", "8"];

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

  return (
    <div className={styles.chessBoardContainer}>
      <div className={styles.boardWrapper}>
        <div className={styles.board}>{renderBoard()}</div>
      </div>

      {showMoveHistory && moveHistory.length > 0 && (
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
    </div>
  );
};

export default ChessBoard;
