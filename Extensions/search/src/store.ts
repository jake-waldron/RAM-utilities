import { create } from "zustand"

type State = {
  showModal: boolean
  toggle: () => void
}

const useStore = create<State>((set) => ({
  showModal: false,
  toggle: () => set((state) => ({ showModal: !state.showModal }))
}))

export default useStore
