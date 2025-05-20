import * as React from "react";
import { useAppDispatch } from "../../store/reduxhooks";
import type { IPlaylistDetail, SongsType } from "../../types";
import { getArtistDetail } from "../../api/songApi";
import { useParams } from "react-router-dom";
import { getSongsDuration } from "../../shared/utils/playlist-utils";
import { setPlaylistAction } from "../../store/slices/playlistSlice";
import Playlist from "../../containers/Playlist/Playlist";
import { followArtist, unfollowArtist } from "../../api/authApi";

export interface IArtistPageProps {}

export default function ArtistPage(props: IArtistPageProps) {
    const [artistPlaylist, setArtistPlaylist] = React.useState<IPlaylistDetail>();

    const dispatch = useAppDispatch();
    const { artistId } = useParams<{ artistId: string }>();

    React.useEffect(() => {
        getArtistDetail(artistId!).then((response) => {
            const artist = response.data;
            const songs: SongsType = artist.songs;
            const playlist: IPlaylistDetail = {
                id: artist.id,
                title: artist.first_name + " " + artist.last_name,
                image: artist.image,
                color: "purple",
                featured: false,
                hide: false,
                songs: songs,

                liked: artist.is_following,
            };
            setArtistPlaylist(playlist);
        });
    }, [artistId]);

    const toggleFollowHandler = React.useCallback(() => {
        if (artistPlaylist) {
            if (artistPlaylist.liked) {
                unfollowArtist(artistPlaylist.id).then((response) => {
                    setArtistPlaylist((prev) => {
                        return { ...prev!, liked: false };
                    });
                });
            } else {
                followArtist(artistPlaylist.id).then((response) => {
                    setArtistPlaylist((prev) => {
                        return { ...prev!, liked: true };
                    });
                });
            }
        }
    }, [artistPlaylist]);

    const durations = React.useMemo(() => {
        if (!artistPlaylist) return "";
        const songs = artistPlaylist.songs;
        return getSongsDuration(songs);
    }, [artistPlaylist]);

    const playPlaylistHandler = React.useCallback(() => {
        dispatch(setPlaylistAction({ playlist: artistPlaylist! }));
    }, [dispatch, artistPlaylist]);

    return (
        <>
            {artistPlaylist && (
                <Playlist
                    image={artistPlaylist.image}
                    playlistType="Artist"
                    title={artistPlaylist.title}
                    durations={durations}
                    playPlaylist={playPlaylistHandler}
                    toggleLikePlaylist={toggleFollowHandler}
                    hasLikeButton={true}
                    songs={artistPlaylist.songs}
                    playlist={artistPlaylist}
                />
            )}
        </>
    );
}
