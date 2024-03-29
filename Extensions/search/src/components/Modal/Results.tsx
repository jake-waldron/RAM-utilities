import useStore from "@store"
import Feedback, { ReportError } from "./Feedback"
import { CgSpinner } from "react-icons/cg"
import React from "react"

export default function Results({ queryData }) {
  const { searchBarRef, toggleModal } = useStore()
  const [showProducts, setShowProducts] = React.useState(true)
  const { isLoading, isError, error, data } = queryData

  React.useEffect(() => {
    setShowProducts(true)
  }, [data])

  function handleSelect(partNum: string) {
    if (partNum === "") return
    searchBarRef.current.focus()
    searchBarRef.current.value = partNum
    toggleModal()
  }

  function hideProducts() {
    setShowProducts(false)
  }

  if (isLoading)
    return (
      <div className="flex justify-center">
        <CgSpinner className="mx-4 animate-spin text-3xl" />
        <p className="text-center">Searching...</p>
      </div>
    )

  if (isError) {
    return (
      <>
        <p className="text-center text-red-500">
          Sorry, something went wrong. Please try again later.
        </p>
        <div className="mt-2 flex justify-center">
          <ReportError error={error} />
        </div>
      </>
    )
  }

  const { products } = data

  return (
    <>
      {showProducts && (
        <ResultsList products={products} handleSelect={handleSelect} />
      )}
      <Feedback apiResponse={data} hideProducts={hideProducts} />
    </>
  )
}

function ResultsList({ products, handleSelect }) {
  return products.length > 0 ? (
    <ul>
      {products.map((result) => (
        <li
          key={result.partNum}
          className="cursor-pointer p-2 hover:bg-AMP_GREEN hover:text-white"
          onClick={() => handleSelect(result.partNum)}>
          <p>{result.name}</p>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-center">No products found</p>
  )
}
