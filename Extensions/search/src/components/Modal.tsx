import useStore from "../store"
import React, { ReactNode } from "react"

export default function Modal() {
  const state = useStore()

  const [searchTerm, setSearchTerm] = React.useState("")
  const [results, setResults] = React.useState([])

  React.useEffect(() => {
    if (state.searchBarRef) {
      setSearchTerm(state.searchBarRef.current?.value || "")
    }
  }, [state.showModal])

  React.useEffect(() => {
    async function getResults() {
      const data = await fetch(`${process.env.API}/search?q=${searchTerm}`)

      const apiResponse = await data.json()

      const { products, error } = apiResponse.data
      console.log(products)
      setResults(products)
    }
    const debounce = setTimeout(() => {
      if (!searchTerm) return setResults([])
      if (searchTerm) {
        getResults()
      }
    }, 500)

    return () => clearTimeout(debounce)
  }, [searchTerm])

  function closeModal(e: React.MouseEvent<HTMLDivElement>) {
    // e.preventDefault()
    if (e.target === e.currentTarget) {
      state.toggleModal()
    }
  }

  function handleSelect(partNum: string) {
    if (partNum === "") return
    state.searchBarRef.current.value = partNum
    state.searchBarRef.current.focus()
    state.toggleModal()
  }

  return (
    <>
      <ModalBackdrop closeModal={closeModal}>
        <div className="z-10 flex flex-col rounded-xl bg-white p-4 text-3xl text-slate-400  ">
          {/* ADD MODAL COMPONENT HERE */}
          <input
            type="text"
            value={searchTerm || ""}
            placeholder="Search for product..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <hr />
          {results && (
            <ul>
              {results.map((result) => (
                <li key={result.partNum}>
                  <p onClick={() => handleSelect(result.partNum)}>
                    {result.name}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {results.length === 0 && (
            <p className="text-center">No results found</p>
          )}
        </div>
      </ModalBackdrop>
    </>
  )
}

function ModalBackdrop({
  children,
  closeModal
}: {
  children: ReactNode
  closeModal: (e: React.MouseEvent) => void
}) {
  return (
    <div
      id="modal-backdrop"
      className="fixed z-0 flex h-screen w-screen items-center justify-center bg-gray-800/25"
      onClick={closeModal}>
      {children}
    </div>
  )
}
