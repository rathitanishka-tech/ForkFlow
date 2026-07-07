import { create, type StateCreator } from "zustand";
import {
  createJSONStorage,
  persist,
  type PersistOptions,
} from "zustand/middleware";

export interface Table {
  id: string;
  backendId?: number;
  number: number;
  seats: number;
  x: number;
  y: number;
  rotation: number;
}

export interface Floor {
  id: string;
  backendId?: number;
  name: string;
  tables: Table[];
}

interface OnboardingState {
  businessName: string;
  ownerName: string;
  businessId?: number;
  restaurantId?: number;
  ownerEmail: string;
  restaurantName: string;
  restaurantAddress: string;
  cuisineType: string;
  floors: Floor[];
}

interface OnboardingActions {
  updateState: (newState: Partial<OnboardingState>) => void;
  reset: () => void;
}

const initialState: OnboardingState = {
  businessName: "",
  ownerName: "",
  businessId: undefined,
  restaurantId: undefined,
  ownerEmail: "",
  restaurantName: "",
  restaurantAddress: "",
  cuisineType: "",
  floors: [{ id: "floor-1", name: "Ground Floor", tables: [] }],
};

type OnboardingStore = OnboardingState & OnboardingActions;

const store: StateCreator<OnboardingStore> = (set) => ({
  ...initialState,
  updateState: (newState) => set((state) => ({ ...state, ...newState })),
  reset: () => set(initialState),
});

const persistOptions: PersistOptions<OnboardingStore> = {
  name: "onboarding-storage",
  storage: createJSONStorage(() => sessionStorage), // Use sessionStorage for auto-save
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(store, persistOptions),
);
