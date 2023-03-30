import useStore from "../store"
import React from "react"

import "../styles.css"

function Button() {
  const state = useStore()
  console.log(state, "state in button")
  return (
    <button
      onClick={() => {
        console.log("clicked react button in separate component")
        state.toggle()
      }}
      className="h-full bg-AMP_GREEN px-4 text-white "
      id="REACT-TEST">
      Quick Search
    </button>
    // <div className="h-20 w-72 bg-emerald-500">TEST</div>
  )
}

export default React.memo(Button)
