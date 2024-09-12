import { storeAccessToken, getAuthToken, clearAccessToken } from '../src/helpers/auth.jsx';

describe('Token Management', () => {
  it('should store and retrieve access token correctly', () => {
    storeAccessToken('sample_access_token');
    const token = getAuthToken();
    expect(token).toBe('sample_access_token');
  });

  it('should clear the access token', () => {
    storeAccessToken('sample_access_token');
    clearAccessToken();
    const token = getAuthToken();
    expect(token).toBeNull();
  });
});

