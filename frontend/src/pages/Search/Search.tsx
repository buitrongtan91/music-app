import * as React from "react";
import GenreList from "../../containers/Search/GenreList";
import SearchList from "../../containers/Search/SearchList";
import { getGenreList, searchSongs, searchPlaylists } from "../../api/songApi";
import type { GenreSummriesType, IPlaylistDetail, PlaylistsType } from "../../types";
import { useParams } from "react-router-dom";

export interface ISearchProps {}

export default function Search(props: ISearchProps) {
    const [genres, setGenres] = React.useState<GenreSummriesType>([]);

    const { query } = useParams<{ query: string }>();
    const [findedSongsPlaylist, setFindedSongsPlaylist] = React.useState<IPlaylistDetail>();
    const [findedPlaylists, setFindedPlaylists] = React.useState<PlaylistsType>([]);

    const search = React.useCallback((query: string) => {
        (async () => {
            const newFindedPlaylists = await searchPlaylists(query);
            const songsResult = await searchSongs(query);
            setFindedPlaylists(newFindedPlaylists.data);

            const newFindedSongsPlaylist: IPlaylistDetail = {
                id: 0,
                title: "Search Result",
                songs: songsResult.data,
            };
            setFindedSongsPlaylist(newFindedSongsPlaylist);
        })();
    }, []);

    const currentSearchQuery = { value: query };
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (query && currentSearchQuery.value === query) {
                search(query);
            }
        }, 1500);
        return () => {
            clearTimeout(timer);
        };
    }, [query, currentSearchQuery.value, search]);

    React.useEffect(() => {
        getGenreList().then((res) => {
            setGenres(res.data);
        });
    }, []);

    const contentJSX = React.useMemo(() => {
        if (query) {
            if (findedSongsPlaylist) {
                return <SearchList songPlaylist={findedSongsPlaylist} playlists={findedPlaylists} />;
            }
        } else {
            return <GenreList genres={genres} />;
        }
    }, [genres, findedPlaylists, findedSongsPlaylist, query]);

    return <div className="p-10">{contentJSX}</div>;
}
