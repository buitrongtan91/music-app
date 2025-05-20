import * as React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
export interface ISearchBarProps {}

export default function SearchBar(props: ISearchBarProps) {
    const [value, setValue] = React.useState("");

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);

        if (e.target.value) navigate("/search/" + e.target.value);
    };
    return (
        <div className="w-80 flex bg-white p-2 rounded-full">
            <div className="mr-3">
                <SearchIcon />
            </div>
            <input
                value={value}
                onChange={handleChange}
                className="outline-none grow"
                type="text"
                placeholder="Search"
            />
        </div>
    );
}
