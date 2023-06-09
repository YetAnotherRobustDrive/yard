import configData from "../../config/config.json"
import jwtDecode from "jwt-decode";

export default async function RefreshToken() {
    const time = Math.ceil(Date.now() / 1000);
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken == null) {
        return false;        
    }
    const accessTokenExp = jwtDecode(accessToken).exp;

    if (accessTokenExp > time) {
        return true;
    }

    const refreshToken = localStorage.getItem("refreshToken");
    const refreshTokenExp = jwtDecode(refreshToken).exp;

    if (refreshTokenExp < time) {
        return false;
    }

    let model = {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + refreshToken,
        },
    };

    try {
        const res = await fetch(configData.API_SERVER + 'auth/refresh', model);
        if (!res.ok) {
            throw new Error('');
        }
        const data = await res.json();
        localStorage.setItem("accessToken", data.result);
        return true;
    } catch (error) {
        return false;
    }
}