import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    breadcrumbs: {},
};

const breadcrumbSlice = createSlice({
    name: 'breadcrumbs',
    initialState,
    reducers: {
        setBreadcrumb: (state, action) => {
            const { key, label, icon, id } = action.payload;
            state.breadcrumbs[key] = { label, icon, id };

            if (label) {
                document.title = label;
            }
        },
        clearBreadcrumbs: (state) => {
            state.breadcrumbs = {};
            document.title = 'Default Title';
        },
    },
});

export const { setBreadcrumb, clearBreadcrumbs } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;
