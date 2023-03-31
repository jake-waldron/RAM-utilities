import useStore from "../store"
import React, { ReactNode } from "react"
import { useQuery } from "react-query"

async function findProducts(search: string) {
  const data = await fetch(`${process.env.API}/search?q=${search}`)

  return await data.json()
}

export default function Modal() {
  const { searchBarRef, showModal, toggleModal } = useStore()

  const [inputValue, setInputValue] = React.useState("")
  const [searchTerm, setSearchTerm] = React.useState("")

  // Fetch products from API when search term changes
  const queryData = useQuery(["products", searchTerm], () =>
    findProducts(searchTerm)
  )

  // Set initial value of input if AMP search bar has a value on mount
  React.useEffect(() => {
    if (searchBarRef) {
      setInputValue(searchBarRef.current?.value || "")
    }
  }, [showModal])

  // Debounce input value and set search term after timeout
  React.useEffect(() => {
    const debounce = setTimeout(() => {
      setSearchTerm(inputValue)
    }, 500)

    return () => clearTimeout(debounce)
  }, [inputValue])

  return (
    <>
      <ModalBackdrop>
        <div className="z-10 flex flex-col rounded-xl bg-white p-4 text-3xl text-slate-400  ">
          {/* ADD MODAL COMPONENT HERE */}
          <input
            type="text"
            value={inputValue || ""}
            placeholder="Search for product..."
            onChange={(e) => setInputValue(e.target.value)}
          />
          <hr />
          {searchTerm !== "" && <Results queryData={queryData} />}
        </div>
      </ModalBackdrop>
    </>
  )
}

function ModalBackdrop({ children }: { children: ReactNode }) {
  const { toggleModal } = useStore()
  return (
    <div
      id="modal-backdrop"
      className="fixed z-0 flex h-screen w-screen items-center justify-center bg-gray-800/25"
      onClick={() => toggleModal()}>
      {children}
    </div>
  )
}

function Results({ queryData }) {
  const { searchBarRef, toggleModal } = useStore()
  // console.log("results are: ", results)
  const { isLoading, isError, error, data } = queryData

  function handleSelect(partNum: string) {
    if (partNum === "") return
    searchBarRef.current.value = partNum
    searchBarRef.current.focus()
    toggleModal()
  }

  if (isLoading) return <p className="text-center">Loading...</p>
  if (isError) return <p className="text-center">Error: {error.message}</p>

  const { products } = data.data

  return products.length > 0 ? (
    <ul>
      {products.map((result) => (
        <li key={result.partNum}>
          <p onClick={() => handleSelect(result.partNum)}>{result.name}</p>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-center">No results found</p>
  )
}
