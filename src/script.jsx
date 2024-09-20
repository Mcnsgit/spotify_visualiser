import { useState, useEffect } from "react";
import { redirectToAuthCodeFlow, getAccessToken } from "./authcodePkce";

function Profile() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
            redirectToAuthCodeFlow("1f42356ed83f46cc9ffd35c525fc8541");
        } else {
            (async () => {
                const accessToken = await getAccessToken("1f42356ed83f46cc9ffd35c525fc8541", code);
                const profile = await fetchProfile(accessToken);
                setProfile(profile);
            })();
        }
    }, []);

    async function fetchProfile(token) {
        const result = await fetch("https://api.spotify.com/v1/me", {
            method: "GET", headers: { Authorization: `Bearer ${token}` }
            
        });

        
        return await result.json();
        
    }

    return (
        <div>
            {profile && (
                <div>
                    <p>Name: {profile.display_name} </p>
                    <p>ID: {profile.id}</p>
                    <p>Email: {profile.email}</p>
                    <p>Profile URL: <a href={profile.href}>{profile.href}</a></p>
                    <p>Spotify URL: <a href={profile.external_urls.spotify}>{profile.external_urls.spotify}</a></p>
                    {profile.images[0] && <img src={profile.images[0].url} alt="Profile image" />}
                </div>
            )}
        </div>
    );
}

export default Profile;
