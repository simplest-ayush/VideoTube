import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({
    baseURL: "https://videotube-fxsg.onrender.com/api/v1",
    withCredentials: true,
});

API.interceptors.response.use(
    (res) => res,
    (err) => {
        const msg =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Something went wrong";
        if (err.response?.status !== 401) toast.error(msg);
        return Promise.reject(err);
    }
);

export default API;