import { createSlice, PayloadAction } from "@reduxjs/toolkit";
//

interface IMetadataState {
  has_loaded_plan: boolean;
}

export const initialState: IMetadataState = {
  has_loaded_plan: false
};

export const metadataSlice = createSlice({
  name: "metadata",
  initialState,
  reducers: {
    setLoadedPlanFlag: (state, action: PayloadAction<{ flag: boolean }>) => {
      const { flag } = action.payload;
      state.has_loaded_plan = flag;
    }
  }
});

export const { setLoadedPlanFlag } = metadataSlice.actions;
export const selectLoadedPlanFlag = (state: { metadata: IMetadataState }) => state.metadata.has_loaded_plan;
export default metadataSlice.reducer;
