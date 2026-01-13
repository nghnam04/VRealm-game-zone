import axiosInstance from "../api/axios";

const authService = {
  login: async (username, password) => {
    const response = await axiosInstance.post("/auth/login", {
      username,
      password,
    });
    // BE trả về { token, userDetails }
    if (response.data.token) {
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("user", JSON.stringify(response.data.userDetails));
    }
    return response.data;
  },

  register: async (name, email, username, password) => {
    return await axiosInstance.post("/auth/register", {
      name,
      username,
      email,
      password,
    });
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      console.log("Backend logout success - Token blacklisted");
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    }
  },
};

export default authService;
