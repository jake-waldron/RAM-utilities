import { create } from "zustand"

type State = {
  /** Boolean. Status of whether modal should be shown or not */
  showModal: boolean
  /** Ref to the search bar input element */
  searchBarRef: React.MutableRefObject<HTMLInputElement> | null
  /** Function to toggle the modal */
  toggleModal: () => void
  /** Function to set the search bar ref */
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
