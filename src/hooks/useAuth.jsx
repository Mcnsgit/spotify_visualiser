import { useState, useEffect } from "react"
import axios from "axios"

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();

    useEffect(() => {
        if (!code) return;
    
        axios.post("https://localhost:3001/login", {
            code,
        })
        .then(response => {
            setAccessToken(response.data.accessToken);
            setRefreshToken(response.data.refreshToken); 
            setExpiresIn(response.data.expiresIn);

            window.history.pushState({}, null, "/dashboard");

        })
        .catch(() => {
            window.location = "/login";
        })
    }, [code])  

    useEffect(() => {   
        if (!refreshToken || !expiresIn) return;
        const interval = setInterval(() => {
            axios
            .post("https://localhost:3001/refresh", {
                refreshToken
            })
            .then(response => {
                setAccessToken(response.data.accessToken);
                setExpiresIn(response.data.expiresIn);
            })
            .catch(() => {
                window.location = "/login";
            })
        }, (expiresIn - 60) * 1000) 

        return () => clearInterval(interval)
    }, [refreshToken, expiresIn])

    return accessToken
}