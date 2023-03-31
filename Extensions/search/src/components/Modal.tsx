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
        <ModalBox>
          <ModalInput
            value={inputValue || ""}
            onChange={(e) => setInputValue(e.target.value)}
            className="mb-4 block w-full border-2 p-1 focus:outline-AMP_GREEN"
          />
          {searchTerm !== "" && <Results queryData={queryData} />}
        </ModalBox>
      </ModalBackdrop>
    </>
  )
}

function ModalBackdrop({ children }: { children: ReactNode }) {
  const { toggleModal } = useStore()
  const windowRef = React.useRef(window)

  React.useEffect(() => {
    function handleKeyPress(e) {
      if (e.key === "Escape") {
        toggleModal()
      }
    }
    windowRef.current.addEventListener("keydown", handleKeyPress)

    return () => {
      windowRef.current.removeEventListener("keydown", handleKeyPress)
    }
  }, [])

  function closeModal(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      toggleModal()
    }
  }

  return (
    <div
      id="modal-backdrop"
      className="fixed z-0 flex h-screen w-screen items-center justify-center bg-gray-800/25"
      onClick={closeModal}>
      {children}
    </div>
  )
}

function ModalBox({ children }: { children: ReactNode }) {
  return (
    <div className="z-10 flex w-[400px] flex-col rounded-xl bg-white p-4 text-2xl text-FONT_COLOR shadow-2xl  ">
      {children}
    </div>
  )
}

type ModalInputProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string
  className?: string
}

function ModalInput(props: ModalInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { onChange, ...delegated } = props

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <input
      type="text"
      ref={inputRef}
      placeholder="Search for product..."
      onChange={onChange}
      {...delegated}
    />
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

  if (isLoading) return <p className="text-center">Searching...</p>
  if (isError) return <p className="text-center">Error: {error.message}</p>

  const { products } = data.data

  return products.length > 0 ? (
    <ProductList products={products} handleSelect={handleSelect} />
  ) : (
    <p className="text-center">No products found</p>
  )
}

function ProductList({ products, handleSelect }) {
  return (
    <ul>
      {products.map((result) => (
        <li
          key={result.partNum}
          className="cursor-pointer p-2 hover:bg-AMP_GREEN hover:text-white">
          <p onClick={() => handleSelect(result.partNum)}>{result.name}</p>
        </li>
      ))}
    </ul>
  )
}
