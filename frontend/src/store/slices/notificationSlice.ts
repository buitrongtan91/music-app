import type { AlertColor } from "@mui/material/Alert";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IToast {
    open: boolean;
    type: AlertColor | undefined;
    message: string;
}

export interface INotficiationState {
    toast: IToast;
}

const initialState: INotficiationState = {
    toast: {
        open: false,
        type: undefined,
        message: "",
    },
};

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setToast: (state, action: PayloadAction<IToast>) => {
            state.toast = action.payload;
        },
        closeToast: (state) => {
            state.toast.open = false;
        },
    },
});

export const { setToast, closeToast } = notificationSlice.actions;

export default notificationSlice;

export {};
