import { create } from "zustand"

const useStore = create((set) => ({
  showModal: false,
  toggle: () => set((state) => ({ showModal: !state.showModal }))
}))

export default useStore
