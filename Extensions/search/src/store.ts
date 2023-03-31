import { create } from "zustand"

type State = {
  showModal: boolean
  searchBarRef: React.MutableRefObject<HTMLInputElement> | null
  toggleModal: () => void
  setSearchBarRef: (
    searchBar: React.MutableRefObject<HTMLInputElement> | null
  ) => void
}

const useStore = create<State>((set) => ({
  showModal: false,
  searchBarRef: null,
  toggleModal: () => set((state) => ({ showModal: !state.showModal })),
  setSearchBarRef: (
    searchBar: React.MutableRefObject<HTMLInputElement> | null
  ) => set(() => ({ searchBarRef: searchBar }))
}))

export default useStore
