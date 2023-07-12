import { create } from "zustand";

const useSignupForm = create((set) => ({
  form: {
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    image: "",
    imagePreviewUrl: "",
  },
  // eslint-disable-next-line no-unused-vars
  setForm: (form) => set((state) => ({ form })),
}));

export default useSignupForm;
