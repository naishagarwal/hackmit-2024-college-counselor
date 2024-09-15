import { createSlice, PayloadAction } from "@reduxjs/toolkit";
//

interface IMetadataState {
  has_loaded_plan: boolean;
  similarities: {
    results: object[];
    form: {
      name: string;
      college: string;
      major: string;
      query: string;
    } | null;
  };
  college_plan: {
    personalized_college_plan: string | null;
  };
  fetch_college_plan: boolean;
}

export const initialState: IMetadataState = {
  has_loaded_plan: false,
  similarities: {
    results: [],
    form: null
  },
  college_plan: {
    personalized_college_plan: null
  },
  fetch_college_plan: false
};

export const metadataSlice = createSlice({
  name: "metadata",
  initialState,
  reducers: {
    setLoadedPlanFlag: (state, action: PayloadAction<{ flag: boolean }>) => {
      const { flag } = action.payload;
      state.has_loaded_plan = flag;
    },
    setSimilaritiesResults: (state, action: PayloadAction<{ results: object[] }>) => {
      const { results } = action.payload;
      state.similarities.results = results;
    },
    setCollegePlan: (state, action: PayloadAction<{ plan: string }>) => {
      const { plan } = action.payload;
      state.college_plan.personalized_college_plan = plan;
    },
    setFetchCollegePlanFlag: (state, action: PayloadAction<{ flag: boolean }>) => {
      const { flag } = action.payload;
      state.fetch_college_plan = flag;
    },
    setSimilaritiesForm: (state, action: PayloadAction<{ form: IMetadataState["similarities"]["form"] }>) => {
      const { form } = action.payload;
      state.similarities.form = form;
    }
  }
});

export const { setLoadedPlanFlag, setSimilaritiesResults, setCollegePlan, setFetchCollegePlanFlag } = metadataSlice.actions;
export const selectLoadedPlanFlag = (state: { metadata: IMetadataState }) => state.metadata.has_loaded_plan;
export const selectSimilaritiesResults = (state: { metadata: IMetadataState }) => {
  const results = state.metadata.similarities.results;
  if (!results || !results.length) {
    return [];
  }
}
export const selectCollegePlan = (state: { metadata: IMetadataState }) => state.metadata.college_plan.personalized_college_plan;
export const selectCollegePlanFlag = (state: { metadata: IMetadataState }) => state.metadata.fetch_college_plan;
export const selectSimilaritiesForm = (state: { metadata: IMetadataState }) => state.metadata.similarities.form;
export default metadataSlice.reducer;
