import {api} from "../../../utils/api";

const serializeHeaders = (headers) => {
	const serializedHeaders = {};
	for (const [key, value] of Object.entries(headers)) {
			serializedHeaders[key] = value;
	}
	return serializedHeaders;
};
const fetchTracksPending = () => ({
	type: "FETCH_TRACKS_PENDING"
});

const fetchTracksSuccess = (tracks) => ({
	type: "FETCH_TRACKS_SUCCESS",
	tracks
});

const fetchMoreSuccess = (tracks, next) => ({
	type: "FETCH_MORE_TRACKS_SUCCESS",
	tracks,
	next
});

const fetchTracksError = () => ({
	type: "FETCH_TRACKS_ERROR"
});

const containsTrackSuccess = (contains) => ({
	type: "CONTAINS_CURRENT_SUCCESS",
	contains: {
			data: contains.data,
			status: contains.status,
			statusText: contains.statusText,
			headers: serializeHeaders(contains.headers)
	}
});

export const removeTrack = (id, current = false) => {
	api.delete(`/me/tracks?ids=${id}`);
	return {
			type: "REMOVE_TRACK_SUCCESS",
			current
	};
};

export const addTrack = (id, current = false) => {
	api.put(`/me/tracks?ids=${id}`);
	return {
			type: "ADD_TRACK_SUCCESS",
			current
	};
};

export const containsCurrentTrack = (id) => {
	return async (dispatch) => {
			try {
					const response = await api.get(`/me/tracks/contains?ids=${id}`);
					dispatch(containsTrackSuccess({
							data: response.data,
							status: response.status,
							statusText: response.statusText,
							headers: serializeHeaders(response.headers)
					}));
					return response.data;
			} catch (error) {
					return error;
			}
	};
};

export const containsTrack = (id) => {
	return async () => {
			try {
					const response = await api.get(`/me/tracks/contains?ids=${id}`);
					return response.data;
			} catch (error) {
					return error;
			}
	};
};

export const fetchTracks = () => {
	return async (dispatch) => {
			dispatch(fetchTracksPending());
			try {
					const response = await api.get("/me/tracks?limit=25");
					dispatch(fetchTracksSuccess(response.data));
					return response.data;
			} catch (error) {
					dispatch(fetchTracksError());
					return error;
			}
	};
};

const filterRepeatedTracks = (keyFn, array) => {
	const ids = [];
	return array.filter(x => {
			const key = keyFn(x);
			const isNew = !ids.includes(key);
			if (isNew) ids.push(key);
			return isNew;
	});
};

export const fetchMoreTracks = () => {
	return async (dispatch, getState) => {
			const next = getState().libraryReducer.tracks.next;
			try {
					if (next) {
							const response = await api.get(next);
							const tracks = filterRepeatedTracks(
									x => x.track.id,
									response.data.items
							);
							dispatch(fetchMoreSuccess(tracks, response.data.next));
							return tracks;
					}
			} catch (error) {
					dispatch(fetchTracksError());
					return error;
			}
	};
};

export const fetchRecentTracks = () => {
	return async (dispatch) => {
			dispatch(fetchTracksPending());
			try {
					const response = await api.get("/me/player/recently-played");
					const tracks = filterRepeatedTracks(
							x => x.track.id,
							response.data.items
					);
					dispatch(fetchTracksSuccess({ ...response.data, items: tracks }));
					return tracks;
			} catch (error) {
					dispatch(fetchTracksError());
					return error;
			}
	};
};