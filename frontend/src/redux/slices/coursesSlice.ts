/* 
//coursesSlice.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import{createSlice}from "@reduxjs/toolkit"
import axios from "axios";

 export const fetchData = createAsyncThunk("courses/fetchData",(_,thunkAPI)=>{

try{

const response= await axios.get("http://localhost:5000/courses")


return response.data

}catch(err){
  return thunkAPI.rejectWithValue(err.response?.data || err.message); 

}
 }
)

 
const coursesSlice=createSlice({
 name: "courses",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers:{},
   extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default coursesSlice.reducer;
 */