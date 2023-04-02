import useStore from "../store"
import React from "react"

import "../styles.css"
import { useSetup } from "@hooks/useSetup"

/** Button element that gets added to the AMP page. Takes the product search bar as an argument to get value from / set value of after searching for product */
function Button({ searchBar }: { searchBar: HTMLInputElement }) {
  const { toggleModal } = useSetup(searchBar)

  React.useEffect(() => {
    fetch(`${process.env.API}/wake-up`)
  }, [])

  React.useEffect(() => {
    // add event listener for CTRL + SHIFT + S
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "S") {
        console.log("shortcut pressed!")
        toggleModal()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <button
      onClick={() => {
        console.log("clicked react button in separate component")
        toggleModal()
      }}
      className="h-full bg-AMP_GREEN px-4 text-white "
      id="REACT-TEST">
      Quick Search
    </button>
  )
}

export default React.memo(Button)
