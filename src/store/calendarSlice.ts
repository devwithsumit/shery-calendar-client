import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CalendarState {
    enabledCalendarIds: string[];
    enabledAppCalendarIds: number[];
    firstLoad?: boolean;
    showSheryEvents: boolean;
}

const initialState: CalendarState = {
    enabledCalendarIds: [],
    enabledAppCalendarIds: [],
    firstLoad: true,
    showSheryEvents: true,
};

const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        toggleCalendar: (state, action: PayloadAction<string>) => {
            const calendarId = action.payload;
            const index = state.enabledCalendarIds.indexOf(calendarId);

            if (index === -1) {
                state.enabledCalendarIds.push(calendarId);
            } else {
                state.enabledCalendarIds.splice(index, 1);
            }
            state.firstLoad = false;
        },
        setEnabledCalendars: (state, action: PayloadAction<string[]>) => {
            state.enabledCalendarIds = action.payload;
            state.firstLoad = false;
        },
        enableAllCalendars: (state) => {
            state.enabledCalendarIds = [];
            state.firstLoad = false;
        },
        toggleSheryEvents: (state) => {
            state.showSheryEvents = !state.showSheryEvents;
        },
        toggleAppCalendar: (state, action: PayloadAction<number>) => {
            const calendarId = action.payload;
            const index = state.enabledAppCalendarIds.indexOf(calendarId);
            if (index === -1) {
                // console.log('Toggling App Calendar ID:', calendarId, 'Current Index:', index);
                state.enabledAppCalendarIds.push(calendarId);
            } else {
                state.enabledAppCalendarIds.splice(index, 1);
            }
        },
        setEnabledAppCalendars: (state, action: PayloadAction<number[]>) => {
            state.enabledAppCalendarIds = action.payload;
        },
    },
});

export const {
    toggleCalendar,
    setEnabledCalendars,
    enableAllCalendars,
    toggleSheryEvents,
    toggleAppCalendar,
    setEnabledAppCalendars
} = calendarSlice.actions;
export default calendarSlice.reducer;
