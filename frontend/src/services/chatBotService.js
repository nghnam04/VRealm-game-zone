import axiosInstance from "../api/axios";

const chatBotService = {
  askAI: (message) => axiosInstance.post("/chatbot/send", { message }),
};

export default chatBotService;
