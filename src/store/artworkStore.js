import { create } from "zustand";

const useArtworkStore = create((set) => ({
  artworks: [],
  addArtwork: (artwork) =>
    set((state) => ({ artworks: [...state.artworks, artwork] })),
  form: {
    artistName: "",
    artworkName: "",
    dateOfArtwork: "",
    artisticMovement: "",
    image: null,
  },
  setForm: (form) => set({ form }),
  updateImageUrlInForm: (imageUrl) =>
    set((state) => ({ form: { ...state.form, image: imageUrl } })),
}));

export default useArtworkStore;
