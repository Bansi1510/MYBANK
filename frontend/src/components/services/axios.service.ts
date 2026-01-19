import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:1510/api/v1/auth/",
  withCredentials: true,
});

api.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401) {
      try {
        const res = await api.post("refresh-token");
        console.log(res);
        const token = res.data.accessToken;

        api.defaults.headers.Authorization = `Bearer ${token}`;
        error.config.headers.Authorization = `Bearer ${token}`;

        return api(error.config);
      } catch (err:unknown) {
        console.log(err)
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
