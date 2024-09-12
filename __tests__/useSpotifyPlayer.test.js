import React from 'react';
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import useSpotifyPlayer from '../src/hooks/useSpotifyPlayer';


describe('useSpotifyPlayer', () => {
 
//   it('should set player when token is provided');
//   it('should disconnect player on unmount');
//   it('should return null if player is not set');
//   it('should return player if player is set');
})
let mockSpotifyPlayer;
let mockAddListener;
let mockConnect;
let mockDisconnect;

//test/it = individualtest
//   test('should return null initially', () => {
beforeEach(() => {
  // Mock window object
  global.window = global.window || {};
  global.window.Spotify = undefined;

  mockAddListener = jest.fn();
  mockConnect = jest.fn().mockResolvedValue(true);
  mockDisconnect = jest.fn();

  mockSpotifyPlayer = jest.fn().mockImplementation(() => ({
    addListener: mockAddListener,
    connect: mockConnect,
    disconnect: mockDisconnect,
  }));

  global.window.Spotify = {
    Player: mockSpotifyPlayer,
  };

  // Mock document object
  global.document = global.document || {};
  global.document.createElement = jest.fn().mockReturnValue({
    addEventListener: jest.fn((event, cb) => cb()),
  });
  global.document.body = global.document.body || {
    appendChild: jest.fn(),
    removeChild: jest.fn(),
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

it('should set player when token is provided', async () => {
  const { result } = renderHook(() => useSpotifyPlayer('mock-token'));

  expect(result.current).toBeNull();

  // Simulate the 'ready' event
  await act(async () => {
    const readyCallback = mockAddListener.mock.calls.find(call => call[0] === 'ready')[1];
    readyCallback({ device_id: 'mock-device-id' });
  });

  expect(result.current).not.toBeNull();
  expect(mockSpotifyPlayer).toHaveBeenCalledWith({
    name: 'Web Playback SDK',
    getOAuthToken: expect.any(Function),
    volume: 0.5,
  });
  expect(mockConnect).toHaveBeenCalled();
});

it('should disconnect player on unmount', async () => {
  const { result, unmount } = renderHook(() => useSpotifyPlayer('mock-token'));

  // Simulate the 'ready' event to set the player
  await act(async () => {
    const readyCallback = mockAddListener.mock.calls.find(call => call[0] === 'ready')[1];
    readyCallback({ device_id: 'mock-device-id' });
  });

  unmount();

  expect(mockDisconnect).toHaveBeenCalled();
});

it('should return null if player is not set', () => {
  const { result } = renderHook(() => useSpotifyPlayer('mock-token'));
  expect(result.current).toBeNull();
});

it('should handle "not_ready" event', async () => {
  renderHook(() => useSpotifyPlayer('mock-token'));

  // Simulate the 'not_ready' event
  await act(async () => {
    const notReadyCallback = mockAddListener.mock.calls.find(call => call[0] === 'not_ready')[1];
    notReadyCallback({ device_id: 'mock-device-id' });
  });

  // This test mainly checks if the 'not_ready' event doesn't cause any errors
  expect(mockAddListener).toHaveBeenCalledWith('not_ready', expect.any(Function));
});

it('should handle connection failure', async () => {
  mockConnect.mockResolvedValue(false);
  const consoleLogSpy = jest.spyOn(console, 'log');

  renderHook(() => useSpotifyPlayer('mock-token'));

  // Simulate the 'ready' event
  await act(async () => {
    const readyCallback = mockAddListener.mock.calls.find(call => call[0] === 'ready')[1];
    readyCallback({ device_id: 'mock-device-id' });
  });

  expect(consoleLogSpy).not.toHaveBeenCalledWith('The Web Playback SDK successfully connected to Spotify!');
  
  consoleLogSpy.mockRestore();
});
