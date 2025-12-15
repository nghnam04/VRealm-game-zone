import axiosInstance from "../api/axios";

const statusService = {
  getCurrentStatus: () => axiosInstance.get("/status").then((res) => res.data),

  getLogs: (days = 30) =>
    axiosInstance.get(`/status/logs?dayCount=${days}`).then((res) => res.data),

  getLogsByComponent: (component, days = 30) =>
    axiosInstance
      .get(`/status/logs/${component}?dayCount=${days}`)
      .then((res) => res.data),

  getUptime: (days = 30) =>
    axiosInstance.get(`/status/uptime?days=${days}`).then((res) => res.data),
};

export default statusService;
