import React from "react";
import moment from "moment";

import withUiActions from "../../../../hoc/uiHoc";
import {formatDuration} from "../../../../helpers/format";


const track = props => {
	const active = props.id === props.current && props.playing;
	const buttonClass = active ? "fa-pause-circle-o" : "fa-play-circle-o";

	const artists = props.item.artists ? props.item.artists.length : 0;

	const event = active
		? props.pauseTrack
		: () => props.playTrack(props.uri, props.offset);

	return (
		<li className={"user-track-item" + (active ? " active" : "")}>
			{props.isAlbum ? (
				<div className="r-track" onClick={event}>
					<i className={`fa ${buttonClass} play-btn`} aria-hidden="true" />
					{active ? (
						<i className="fa fa-volume-up playing" />
					) : (
						<span>{props.index}</span>
					)}
				</div>
			) : (
				<div className="play-track" onClick={event}>
					<i className={`fa ${buttonClass} play-btn`} aria-hidden="true" />
					{active ? <i className="fa fa-volume-up" /> : null}
				</div>
			)}
			<div className="add-remove-section">
				{props.contains ? (
					<i
						className="fa fa-check"
						aria-hidden="true"
						onClick={props.onDelete}
					/>
				) : (
					<i className="fa fa-plus" aria-hidden="true" onClick={props.onAdd} />
				)}
			</div>
			<div className="track-title">
				<p>{props.item.name}</p>
			</div>
			<div className="track-artist">
				<p>
					{props.item.artists
						? props.item.artists.map((a, i) => (
							<span key={i}>
								<span
									className="artist"
									onClick={() => props.onArtistClick(a.id)}
								>
									{a.name}
								</span>
								{artists !== i + 1 ? <span>, </span> : null}
							</span>
						))
						: ""}
				</p>
			</div>
			{!props.isAlbum && (
				<div className="track-album">
					<p
						className="album"
						onClick={() => props.onAlbumClick(props.item.album.id)}
					>
						{props.item.album.name}
					</p>
				</div>
			)}
			{!props.isAlbum && !props.removeDate && (
				<div className="track-added">
					<p>{moment(props.added_at).format("YYYY-MM-DD")}</p>
				</div>
			)}
			{props.isAlbum && (
				<div className="track-explicit">
					{props.item.explicit ? <p className="explicit">EXPLICIT</p> : null}
				</div>
			)}
			<div className="track-length">
				<p>{formatDuration(props.item.duration_ms)}</p>
			</div>
		</li>
	);
};

export default withUiActions(track);
