import useStore from "@store"
import React, { ReactNode } from "react"
import { useQuery } from "react-query"
import Results from "./Results"
import ModalInput from "./ModalInput"

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
    if (searchBarRef?.current.value) {
      setInputValue(searchBarRef.current.value)
      setSearchTerm(searchBarRef.current.value)
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
        <ModalContainer>
          <ModalInput
            value={inputValue || ""}
            onChange={(e) => setInputValue(e.target.value)}
            className="mb-4 block w-full border-2 p-1 focus:border-AMP_GREEN focus:outline-AMP_GREEN"
          />
          {searchTerm !== "" && <Results queryData={queryData} />}
        </ModalContainer>
      </ModalBackdrop>
    </>
  )
}

function ModalContainer({ children }: { children: ReactNode }) {
  return (
    <div className="z-10 flex w-[400px] flex-col rounded-xl bg-white p-4 text-2xl text-FONT_COLOR shadow-2xl  ">
      {children}
    </div>
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
