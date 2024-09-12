  import axios from "axios";



  const authEndpoint = "https://accounts.spotify.com/authorize?";
  const clientId = "1f42356ed83f46cc9ffd35c525fc8541";
  const redirectUri = 'https://localhost:3000';
  const scopes = [
    "streaming",
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "user-library-read",
    "user-library-modify",
    "user-read-playback-state",
    "user-modify-playback-state"
  ]

  export const loginEndpoint = `${authEndpoint}client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
      "%20"
    )}&response_type=token&show_dialog=true`;

    const apiClient = axios.create({
      baseURL: "https://api.spotify.com/v1/",
    });
    
    export const setClientToken = (token) => {
      apiClient.interceptors.request.use(async function (config) {
        config.headers.Authorization = "Bearer " + token;
        return config;
      });
    };
    
    export default apiClient;
    
    // const apiClient = axios.create({
    //   baseURL: "https://api.spotify.com/v1/",
    // });
    
    // let cachedToken = null; // Variable to cache token
    
    // export const setClientToken = (token) => {
    //   apiClient.interceptors.request.use(async function (config) {
    //     config.headers.Authorization = "Bearer " + token;
    //     return config;
    //   });
    // };
    
    // export const setAccessToken = (token) => {
    //   window.localStorage.setItem("token", token);
    //   return token; // Removed logging the token for security
    // };
    
    // export const getAccessToken = () => {
    //   return window.localStorage.getItem("token");
    // };
    
    // export const refreshToken = async () => {
    //   const token = getAccessToken();
    //   if (!token) return null;
    //   try {
    //     const response = await apiClient.post(
    //       "https://accounts.spotify.com/api/token",
    //       {
    //         grant_type: "refresh_token",
    //         refresh_token: token,
    //       },
    //       {
    //         headers: {
    //           "Content-Type": "application/x-www-form-urlencoded",
    //         },
    //       }
    //     );
    //     return setAccessToken(response.data.access_token);
    //   } catch (error) {
    //     return null;
    //   }
    // };
    
    // export const logout = () => {
    //   window.localStorage.removeItem("token");
    //   return null;
    // };  

    // export const getCurrentlyPlaying = async () => {
    //   try {
    //     const response = await apiClient.get("me/player/currently-playing");
    //     return response.data;
    //   } catch (error) {
    //     console.error("Error getting currently playing track:", error);
    //     return null;
    //   }
    // };
    // // Add error handling for API calls if needed
    // apiClient.interceptors.response.use(
    //   response => response,
    //   error => {
    //     console.error("API call error: ", error); // Log the error for debugging
    //     return Promise.reject(error);
    //   }
    // );
    
    // export default apiClient;