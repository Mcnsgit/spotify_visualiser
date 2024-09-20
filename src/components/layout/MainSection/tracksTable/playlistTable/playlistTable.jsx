import React from "react";

import "./playlistTable.css";

import Track from "../items/track";
import withTracksState from "../hoc/trackHoc";
import EmptySection from "./components/emptySection/empty";
import InfiniteScroll from "react-infinite-scroll-component";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const playlistTable = (props) => {
	const isMine = props.playlist && props.playlist.mine;

	const onDragEnd = (result) => {
		const {source, destination} = result;

		if (!destination) {
			return;
		}

		props.movePlaylistTrack(props.playlist, source.index, destination.index);
	};

	return props.tracks.length === 0 ? (
		<EmptySection />
	) : (
		<div className="playlist-table">
			<div className="track-header-container">
				<div style={{ width: 40 }} />
				<div style={{ width: 40 }} />
				<div className="track-title-header">
					<p>Title</p>
				</div>
				<div className="track-artist-header">
					<p>Artist</p>
				</div>
				<div className="track-album-header">
					<p>Album</p>
				</div>
				{props.removeDate ? null : (
					<div className="track-added-header">
						<i className="fa fa-calendar-plus-o" aria-hidden="true" />
					</div>
				)}
				<div className="track-length-header">
					<i className="fa fa-clock-o" aria-hidden="true" />
				</div>
			</div>
			{isMine ? (
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable droppableId="droppable">
						{(provided) => (
							<div
								{...provided.droppableProps}
								ref={provided.innerRef}
								className="track-list"
							>
								<InfiniteScroll
									dataLength={props.tracks.length}
									next={props.fetchMoreTracks}
									hasMore={props.more}
									loader={<div className="loader" key={0} />}
								>
									{props.tracks.map((item, i) => (
										<Draggable key={item.id} draggableId={item.id} index={i}>
											{(provided) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													className="draggable-track"
												>
													<Track
														onAdd={() => {
															props.changeTrackStatus(i, true);
															props.addTrack(item.track ? item.track.id : item.id);
														}}
														onDelete={() => {
															props.changeTrackStatus(i, false);
															props.removeTrack(item.track ? item.track.id : item.id);
														}}
														removeDate={props.removeDate}
														added_at={item.track ? item.added_at : ""}
														contains={props.tracksStatus[i]}
														item={item.track || item}
														id={item.track ? item.track.id : item.id}
														uri={props.uri}
														offset={i}
														current={props.current}
														playing={props.playing}
														pauseTrack={props.pauseTrack}
														playTrack={props.playTrack}
													/>
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</InfiniteScroll>
							</div>
						)}
					</Droppable>
				</DragDropContext>
			) : (
				<div className="track-list">
					<InfiniteScroll
						dataLength={props.tracks.length}
						next={props.fetchMoreTracks}
						hasMore={props.more}
						loader={<div className="loader" key={0} />}
					>
						{props.tracks.map((item, i) => (
							<Track
								key={item.id}
								onAdd={() => {
									props.changeTrackStatus(i, true);
									props.addTrack(item.track ? item.track.id : item.id);
								}}
								onDelete={() => {
									props.changeTrackStatus(i, false);
									props.removeTrack(item.track ? item.track.id : item.id);
								}}
								removeDate={props.removeDate}
								added_at={item.track ? item.added_at : ""}
								contains={props.tracksStatus[i]}
								item={item.track || item}
								id={item.track ? item.track.id : item.id}
								uri={props.uri}
								offset={i}
								current={props.current}
								playing={props.playing}
								pauseTrack={props.pauseTrack}
								playTrack={props.playTrack}
							/>
						))}
					</InfiniteScroll>
				</div>
			)}
		</div>
	);
};

export default withTracksState(playlistTable);

        