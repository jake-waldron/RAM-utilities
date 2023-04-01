import useStore from "@store"
import Feedback from "./Feedback"

export default function Results({ queryData }) {
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

  const { products } = data

  return (
    <>
      <ResultsList products={products} handleSelect={handleSelect} />
      <Feedback apiResponse={data} />
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
