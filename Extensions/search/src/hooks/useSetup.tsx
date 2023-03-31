import useStore from "@store"
import React from "react"

export function useSetup(searchBar: HTMLInputElement) {
  const { toggleModal, setSearchBarRef } = useStore()
  const searchBarRef = React.useRef<HTMLInputElement>(searchBar)

  React.useEffect(() => {
    setSearchBarRef(searchBarRef)
  }, [])

  return { toggleModal }
}
