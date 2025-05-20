import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IArtistSummary, ISong } from "../../types";

interface IState {
    songId: number;
    songImage: string;
    songTitle: string;
    songArtists: IArtistSummary[];
    audioSrc: string;
    audioDuration: number;
    audioCurrentTime: number;
    audioVolume: number;
    audioIsPlaying: boolean;
    shouldPlay: boolean;
    songLiked: boolean;
}

const initialState: IState = {
    songId: 0,
    songImage: "",
    songTitle: "",
    songArtists: [],
    audioSrc: "",
    audioDuration: 0,
    audioCurrentTime: 0,
    audioVolume: 1,
    audioIsPlaying: false,
    shouldPlay: false,
    songLiked: false,
};

export const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setNewAudio: (state, action: PayloadAction<{ song: ISong; play: boolean }>) => {
            state.audioSrc = action.payload.song.audio;
            state.songImage = action.payload.song.image;
            state.songTitle = action.payload.song.title;
            state.songArtists = action.payload.song.artists;
            state.songLiked = action.payload.song.liked;
            state.songId = action.payload.song.id;
            state.shouldPlay = action.payload.play;
        },

        setAudioIsPlaying: (state, action: PayloadAction<boolean>) => {
            state.audioIsPlaying = action.payload;
        },
        toggleAudioIsPlaying: (state, action) => {
            return { ...state, audioIsPlaying: !state.audioIsPlaying };
        },

        setVolume(state, action: PayloadAction<number>) {
            state.audioVolume = action.payload;
        },
        setPlayerSongLikedStatus(state, action) {
            state.songLiked = action.payload;
        },
    },
});

export const { setNewAudio, toggleAudioIsPlaying, setAudioIsPlaying, setVolume, setPlayerSongLikedStatus } =
    playerSlice.actions;
