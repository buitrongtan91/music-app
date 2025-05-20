import type { SongsType } from "../../types";

export const getSongsDuration = (songs: SongsType): string => {
    if (!songs) return "";
    let totalDuration = 0;
    songs.forEach((song) => {
        totalDuration += song.duration;
    });
    const totalMinute = Math.floor(totalDuration / 60);
    const resultMinute = totalMinute % 60;
    const resultHour = Math.floor(totalMinute / 60);
    return `${songs.length} Songs, about ${resultHour} hr ${resultMinute} min`;
};

export const getArtistName = (songs: SongsType): string => {
    if (!songs) return "";
    const artists = songs.map((song) => song.artists[0].first_name + " " + song.artists[0].last_name);

    const uniqueArtists = Array.from(new Set(artists));
    return uniqueArtists.join(", ");
};
