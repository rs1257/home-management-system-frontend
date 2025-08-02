import type { InventoryItem } from "@/routes/inventory";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface InventoryState {
	inventory: InventoryItem[];
}

interface InventoryActions {
	replace: (inventory: InventoryItem[]) => void;
}

type InventoryStore = InventoryState & InventoryActions;

export const useInventoryStore = create<InventoryStore>()(
	devtools(
		persist(
			(set) => ({
				inventory: [],
				replace: (inventory) => set(() => ({ inventory })),
			}),
			{ name: "inventory", storage: createJSONStorage(() => sessionStorage) },
		),
	),
);
