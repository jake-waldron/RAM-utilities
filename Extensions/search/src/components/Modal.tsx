import useStore from "../store"
import React from "react"

export default function Modal() {
  const state = useStore()
  console.log("overlay loaded")

  return (
    state.showModal && (
      <div
        id="jake-quick-search"
        className="fixed flex h-screen w-screen items-center justify-center bg-gray-800/25"
        onClick={() => state.toggle()}>
        <div className="rounded-xl bg-white p-4 text-3xl text-slate-400 hover:bg-sky-200 hover:text-white">
          {/* ADD MODAL COMPONENT HERE */}
          <h1>Modal</h1>
        </div>
      </div>
    )
  )
}
