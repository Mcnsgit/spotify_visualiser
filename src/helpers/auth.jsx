/**
 * Extracts access token from URL fragment.
 * @returns {string} - The access token.
 */
export const extractTokenFromUrl = () => {
	const hash = window.location.hash.substring(1);
	const params = new URLSearchParams(hash);
	return params.get("accessToken");
};


/**
 * Store the access token in local storage or another secure place.
 * @param {string} token - The access token.
 */

export const storeAccessToken = (token) => {
	localStorage.setItem('accessToken', token);
};

export const getAuthToken = () => {
	return localStorage.getItem('accessToken');
  };
  /**const storedToken = getAuthToken();
console.log(storedToken);
   * Clear the access token from local storage.
   */
  export const clearAccessToken = () => {
	localStorage.removeItem('accessToken');
  };