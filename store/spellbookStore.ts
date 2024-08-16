import { create } from "zustand";

//set type definitions
interface SpellbookState {
	title: string;
	description: string;
	setTitle: (title: string) => void;
	setDescription: (description: string) => void;
	resetFields: () => void;
}

// create provides set function to assign new value to the state
const useSpellbookStore = create<SpellbookState>()((set) => ({
	title: "",
	description: "",
	setTitle: (title) => set({ title }),
	setDescription: (description) => set({ description }),
	resetFields: () => set({ title: "", description: "" }),
}));

export default useSpellbookStore;
