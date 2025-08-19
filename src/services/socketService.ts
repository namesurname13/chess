import { io, Socket } from "socket.io-client";
import { useChessStore } from "../stores/useChessStore";

class SocketService {
  private socket: Socket | null = null;
  private gameId: string | null = null;

  connect(url: string = "http://localhost:3001") {
    this.socket = io(url);

    this.socket.on("connect", () => {
      console.log("Подключен к серверу");
      useChessStore.getState().setConnected(true);
    });

    this.socket.on("disconnect", () => {
      console.log("Отключен от сервера");
      useChessStore.getState().setConnected(false);
    });

    this.socket.on(
      "gameJoined",
      (data: { gameId: string; color: "w" | "b" }) => {
        const { gameId, color } = data;
        this.gameId = gameId;
        useChessStore.getState().setPlayerColor(color);
        useChessStore.getState().setGameStatus("waiting");
      }
    );

    this.socket.on(
      "gameStarted",
      (data: { opponent: { name: string; rating: number } }) => {
        useChessStore.getState().setOpponent(data.opponent);
        useChessStore.getState().setGameStatus("playing");
        useChessStore.getState().setPlayerColor("w"); // Первый игрок всегда белые
      }
    );

    this.socket.on(
      "opponentJoined",
      (data: { opponent: { name: string; rating: number } }) => {
        useChessStore.getState().setOpponent(data.opponent);
        useChessStore.getState().setGameStatus("playing");
      }
    );

    this.socket.on(
      "moveMade",
      (data: { from: string; to: string; promotion?: string }) => {
        const { from, to, promotion } = data;
        useChessStore.getState().makeMove(from, to, promotion);
        useChessStore.getState().setPlayerColor("w"); // Ход переходит к нам
      }
    );

    this.socket.on("gameEnded", (data: { result: "win" | "loss" | "draw" }) => {
      useChessStore.getState().setGameStatus("finished");
      useChessStore.getState().setGameResult(data.result);
    });

    this.socket.on("error", (error: string) => {
      console.error("Ошибка сервера:", error);
      useChessStore.getState().setGameStatus("error");
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.gameId = null;
  }

  joinGame(gameId: string, color?: "w" | "b") {
    if (this.socket) {
      this.socket.emit("joinGame", { gameId, color });
      this.gameId = gameId;
    }
  }

  createGame() {
    if (this.socket) {
      this.socket.emit("createGame");
    }
  }

  makeMove(from: string, to: string, promotion?: string) {
    if (this.socket && this.gameId) {
      this.socket.emit("makeMove", {
        gameId: this.gameId,
        from,
        to,
        promotion,
      });
    }
  }

  leaveGame() {
    if (this.socket && this.gameId) {
      this.socket.emit("leaveGame", { gameId: this.gameId });
      this.gameId = null;
    }
  }

  findQuickGame() {
    if (this.socket) {
      this.socket.emit("findQuickGame");
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
