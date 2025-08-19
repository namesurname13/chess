import { create } from "zustand";
import { Chess } from "chess.js";

export interface GameState {
  game: Chess;
  gameId: string | null;
  playerColor: "w" | "b" | null;
  isMyTurn: boolean;
  gameStatus: "waiting" | "playing" | "finished" | "error";
  opponent: {
    name: string;
    rating: number;
  } | null;
  gameResult: "win" | "loss" | "draw" | null;
  moveHistory: string[];
  isConnected: boolean;
}

interface ChessActions {
  // Game management
  initializeGame: (gameId?: string) => void;
  makeMove: (from: string, to: string, promotion?: string) => boolean;
  setPlayerColor: (color: "w" | "b") => void;
  setGameStatus: (status: GameState["gameStatus"]) => void;
  setOpponent: (opponent: GameState["opponent"]) => void;
  setGameResult: (result: GameState["gameResult"]) => void;
  setConnected: (connected: boolean) => void;
  resetGame: () => void;

  // Network actions
  joinGame: (gameId: string, color?: "w" | "b") => void;
  leaveGame: () => void;
}

export const useChessStore = create<GameState & ChessActions>((set, get) => ({
  game: new Chess(),
  gameId: null,
  playerColor: null,
  isMyTurn: false,
  gameStatus: "waiting",
  opponent: null,
  gameResult: null,
  moveHistory: [],
  isConnected: false,

  initializeGame: (gameId) => {
    const newGame = new Chess();
    set({
      game: newGame,
      gameId: gameId || null,
      gameStatus: "waiting",
      moveHistory: [],
      gameResult: null,
      isMyTurn: false,
    });
  },

  makeMove: (from, to, promotion) => {
    const { game } = get();
    try {
      const move = game.move({ from, to, promotion });
      if (move) {
        set({
          game: new Chess(game.fen()),
          moveHistory: [...get().moveHistory, move.san],
          isMyTurn: false,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Invalid move:", error);
      return false;
    }
  },

  setPlayerColor: (color) => set({ playerColor: color }),
  setGameStatus: (status) => set({ gameStatus: status }),
  setOpponent: (opponent) => set({ opponent }),
  setGameResult: (result) => set({ gameResult: result }),
  setConnected: (connected) => set({ isConnected: connected }),

  resetGame: () => {
    set({
      game: new Chess(),
      gameId: null,
      playerColor: null,
      isMyTurn: false,
      gameStatus: "waiting",
      opponent: null,
      gameResult: null,
      moveHistory: [],
    });
  },

  joinGame: (gameId, color) => {
    set({
      gameId,
      playerColor: color || null,
      gameStatus: "waiting",
    });
  },

  leaveGame: () => {
    set({
      gameId: null,
      playerColor: null,
      gameStatus: "waiting",
      opponent: null,
      isMyTurn: false,
    });
  },
}));
