import { makeAutoObservable } from "mobx";
import React from 'react';
import { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";
import { AuthResponse } from "../models/response/AuthResponse";
import axios from "axios";
import { API_URL } from "../http";

export default class Store {
    user: IUser = { email: '', role: '', isActivated: false, id: '' };
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken); // Зберігаємо refreshToken
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async registration(email: string, password: string) {
        try {
            const response = await AuthService.registration(email, password);
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken); // Зберігаємо refreshToken
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async logout(callback?: () => void) {
        try {
            await AuthService.logout();
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            this.setAuth(false);
            this.setUser({ email: '', role: '', isActivated: false, id: '' });
            if (callback) callback();
        } catch (e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            const response = await axios.post<AuthResponse>(`${API_URL}/refresh`, { refreshToken }, { withCredentials: true });
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken); // Зберігаємо refreshToken
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: any) {
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }
}

export const Context = React.createContext(null);
