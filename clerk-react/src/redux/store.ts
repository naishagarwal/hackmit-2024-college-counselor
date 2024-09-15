import { configureStore } from "@reduxjs/toolkit";
//
import metadataReducer from "./slices/metadata";

const store = configureStore({
  reducer: {
    metadata: metadataReducer
  },
  devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
