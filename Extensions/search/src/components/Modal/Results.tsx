import useStore from "@store"
import Feedback from "./Feedback"
import { CgSpinner } from "react-icons/cg"
import React from "react"

export default function Results({ queryData }) {
  const { searchBarRef, toggleModal } = useStore()
  const [showProducts, setShowProducts] = React.useState(true)
  // console.log("results are: ", results)
  const { isLoading, isError, error, data } = queryData

  React.useEffect(() => {
    setShowProducts(true)
  }, [data])

  function handleSelect(partNum: string) {
    if (partNum === "") return
    searchBarRef.current.value = partNum
    searchBarRef.current.focus()
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
  if (isError) return <p className="text-center">Error: {error.message}</p>

  const { products } = data

  return (
    <>
      <>
        {showProducts && (
          <ResultsList products={products} handleSelect={handleSelect} />
        )}
        <Feedback apiResponse={data} hideProducts={hideProducts} />
      </>
    </>
  )
}

function ResultsList({ products, handleSelect }) {
  return products.length > 0 ? (
    <ul>
      {products.map((result) => (
        <li
          key={result.partNum}
          className="cursor-pointer p-2 hover:bg-AMP_GREEN hover:text-white">
          <p onClick={() => handleSelect(result.partNum)}>{result.name}</p>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-center">No products found</p>
  )
}
