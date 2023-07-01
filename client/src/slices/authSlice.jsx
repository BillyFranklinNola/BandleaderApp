import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import authService from './authService';

const musician = JSON.parse(localStorage.getItem('musician'));

const initialState = {
    musician: musician? musician : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const register = createAsyncThunk(
    'auth/register', 
    async (musician, thunkAPI) => {
        try {
            return await authService.register(musician)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message)
        }
    })

export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout();
})

export const login = createAsyncThunk(
    'auth/login', 
    async (musician, thunkAPI) => {
        try {
            return await authService.login(musician)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message)
        }
    })

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(register.pending, (state) => {
            state.isLoading = true;
        })  
        .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.musician = action.payload;
        })
        .addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            state.musician = null;
        })
        .addCase(login.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.musician = action.payload;
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            state.musician = null;
        })
        .addCase(logout.fulfilled, (state) => {
            state.musician = null;
        })
    }
})

export const {reset} = authSlice.actions;
export default authSlice.reducer;