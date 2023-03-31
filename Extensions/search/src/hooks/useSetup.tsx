import useStore from "@store"
import React from "react"

/** Sets up global store searchBarRef to be used througout app. Returns function to toggle modal open/closed */
export function useSetup(searchBar: HTMLInputElement) {
  const { toggleModal, setSearchBarRef } = useStore()
  const searchBarRef = React.useRef<HTMLInputElement>(searchBar)

  React.useEffect(() => {
    setSearchBarRef(searchBarRef)
  }, [])

  return { toggleModal }
}
