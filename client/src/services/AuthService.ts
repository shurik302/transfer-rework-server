import $api from "../http"; // Импортуйте ваш настроєний екземпляр axios
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import axios from "axios";

export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        try {
            const response = await $api.post<AuthResponse>("/login", { email, password });
            localStorage.setItem('role', response.data.user.role);
            localStorage.setItem("token", response.data.accessToken); // Додаємо збереження токену
            return response;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error response:", error.response?.data?.message);
            } else {
                console.error("Unexpected error:", error);
            }
            throw error;
        }
    }

    static async registration(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        try {
            const response = await $api.post<AuthResponse>("/registration", { email, password });
            localStorage.setItem('role', response.data.user.role);
            localStorage.setItem("token", response.data.accessToken); // Додаємо збереження токену
            return response;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error response:", error.response?.data?.message);
            } else {
                console.error("Unexpected error:", error);
            }
            throw error; // Повторно викидаємо помилку для обробки на вищому рівні
        }
    }

    static async logout(): Promise<void> {
        try {
            await $api.post("/logout");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error response:", error.response?.data?.message);
            } else {
                console.error("Unexpected error:", error);
            }
            throw error; // Повторно викидаємо помилку для обробки на вищому рівні
        }
    }

    static async activate(link: any) {
        try {
            return axios.get(`${process.env.API_URL}/activate/${link}`);
        } catch (e) {
            console.error(e);
        }
    }

    static async refresh() {
        return $api.get('/refresh', { withCredentials: true });
    }
}
