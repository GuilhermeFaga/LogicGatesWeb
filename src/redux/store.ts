import { configureStore } from '@reduxjs/toolkit'
import { appSlice } from './appReducer'


export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'app/addChip',
          'app/setWires',
          'app/setSelectedPin',
          'app/setTempWire',
          'app/handleSelectedWire',
          'app/addSelectedWire',
          'app/removeSelectedWire',
          'app/handleSelectedChip',
          'app/addSelectedChip',
          'app/removeSelectedChip'
        ],
        // Ignore these paths in the state
        ignoredPaths: ['app'],
      },
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch