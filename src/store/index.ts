"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createStoreSlice, StoreSlice } from "./storeSlice";
import { StateCreator } from "zustand";

export type StoreState = StoreSlice;
    // UserSlice &

// Wrap each slice-creator so that TypeScript knows they extend StoreState:
const createStoreSliceWithStore: StateCreator<StoreState, [], [], StoreSlice> = (set,) =>
    createStoreSlice(set, );

/**
 * The main Zustand store that combines all slices.
 * Uses the persist middleware to save specific parts of state to sessionStorage.
 * Each slice has access to the full store state via the get() function.
 */
export const useStore = create<StoreState>()(
    persist(
        (set, get, store) => ({
            ...createStoreSliceWithStore(set, get, store),
        }),
        {
            name: "app-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                stores: state.storeState.stores,
            }),
        }
    )
);