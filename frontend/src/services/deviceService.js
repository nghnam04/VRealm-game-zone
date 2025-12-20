import axiosInstance from "../api/axios";

const deviceService = {
  getAllDevices: (params = {}) => axiosInstance.get("/devices", { params }),

  getDeviceById: (id) => axiosInstance.get(`/devices/${id}`),

  createDevice: (deviceData) => axiosInstance.post("/devices", deviceData),

  updateDevice: (id, deviceData) =>
    axiosInstance.put(`/devices/${id}`, deviceData),

  deleteDevice: (id) => axiosInstance.delete(`/devices/${id}`),
};

export default deviceService;
