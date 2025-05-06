"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createStoreSlice, StoreSlice } from "./storeSlice";
import { StateCreator } from "zustand";
import { createVendorSlice, VendorSlice } from "./vendorSlice";

export type StoreState = StoreSlice & VendorSlice;

// Wrap each slice-creator so that TypeScript knows they extend StoreState:
const createStoreSliceWithStore: StateCreator<StoreState, [], [], StoreSlice> = (set,) =>
    createStoreSlice(set, );

const createVendorSliceWithStore: StateCreator<StoreState, [], [], VendorSlice> = (set,) =>
    createVendorSlice(set, );

/**
 * The main Zustand store that combines all slices.
 * Uses the persist middleware to save specific parts of state to sessionStorage.
 * Each slice has access to the full store state via the get() function.
 */
export const useStore = create<StoreState>()(
    persist(
        (set, get, store) => ({
            ...createStoreSliceWithStore(set, get, store),
            ...createVendorSliceWithStore(set, get, store),
        }),
        {
            name: "app-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                stores: state.storeState.stores,
                vendors: state.vendorState.vendors,
            }),
        }
    )
);