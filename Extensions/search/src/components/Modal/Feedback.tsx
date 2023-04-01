export default function Feedback({ apiResponse }) {
  const { products, searchTerm } = apiResponse

  if (products.length === 0)
    return (
      <p
        className="text-center text-red-500"
        onClick={() => console.log(apiResponse)}>
        Request Product
      </p>
    )
  return (
    <p
      className="text-center text-red-500"
      onClick={() => console.log(apiResponse)}>
      Report Issue
    </p>
  )
}
