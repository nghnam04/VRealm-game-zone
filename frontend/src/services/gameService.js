import axiosInstance from "../api/axios";

const gameService = {
  getAllGames: (params = {}) => axiosInstance.get("/games", { params }),

  getGameById: (id) => axiosInstance.get(`/games/${id}`),

  createGame: (gameData) => axiosInstance.post("/games", gameData),

  updateGame: (id, gameData) => axiosInstance.put(`/games/${id}`, gameData),

  deleteGame: (id) => axiosInstance.delete(`/games/${id}`),
};

export default gameService;
