

export async function redirectToAuthCodeFlow() {
    const clientId = '1f42356ed83f46cc9ffd35c525fc8541'; // Replace with your actual Client ID
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);
  
    localStorage.setItem('verifier', verifier);
  
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('response_type', 'code');
    params.append('redirect_uri', 'http://localhost:3000'); // Ensure this matches your Spotify app settings
    params.append('scope', 'user-read-private user-read-email playlist-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state');
    params.append('code_challenge_method', 'S256');
    params.append('code_challenge', challenge);

    console.log('Generated code verifier:', verifier);
    console.log('Generated code challenge:', challenge);
    console.log('Authorization URL:', `https://accounts.spotify.com/authorize?${params.toString()}`);
    
    console.log('Redirecting to authorization URL with params:', params.toString());
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }
  

  export async function getAccessToken(code) {
    const verifier = localStorage.getItem('verifier');
  
    if (!verifier) {
      throw new Error('Code verifier not found in localStorage.');
    }
  
    const params = new URLSearchParams();
    params.append('client_id', '1f42356ed83f46cc9ffd35c525fc8541'); // Use your actual Client ID
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', 'http://localhost:3000'); // Ensure this matches your Spotify app settings
    params.append('code_verifier', verifier);
  
    console.log('Exchanging authorization code for access token with params:', params.toString());
  
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
  
    const data = await response.json();
  
    console.log('Token endpoint response:', data);
  
    if (response.ok) {
      return data.accessToken;
    } else {
      throw new Error(data.error_description || 'Failed to get access token');
    }
  }
    function generateCodeVerifier(length) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    return Array.from(array, (byte) => possible[byte % possible.length]).join('');
  }
  

  async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
  

async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}
function populateUI(profile) {
    document.getElementById("displayName").innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar").appendChild(profileImage);
        document.getElementById("imgUrl").innerText = profile.images[0].url;
    }
    document.getElementById("id").innerText = profile.id;
    document.getElementById("email").innerText = profile.email;
    document.getElementById("uri").innerText = profile.uri;
    document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url").innerText = profile.href;
    document.getElementById("url").setAttribute("href", profile.href);
}