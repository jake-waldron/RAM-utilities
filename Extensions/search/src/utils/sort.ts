type Product = {
  name: string
  score: number
  partNum: string
}

function sort(arrayToSort) {
  const scores = arrayToSort.map((product) => product.score)
  const scoreSet = new Set(scores)

  const groupedByScore = [...scoreSet].map((score) => {
    return arrayToSort.filter((product) => product.score === score)
  })

  const sortedArray = groupedByScore.flatMap((group) => sortArray(group))
  console.log(sortedArray)
  return sortedArray

  function sortArray(arr): Product[] {
    const order = {
      "PINT UNIT": 0,
      "TRIAL SIZE": 0,
      "1-GAL UNIT": 1,
      "5-GAL UNIT": 2,
      UNKNOWN: 3
    }

    let newOrder = {}
    arr.forEach((entry: Product) => {
      const sizeRegex = /\b(PINT UNIT|TRIAL SIZE|1-GAL UNIT|5-GAL UNIT)\b/
      const size = entry.name.match(sizeRegex)
      const sizeName = size ? size[1] : "UNKNOWN"
      let orderIndex = order[sizeName]
      if (newOrder[orderIndex]) {
        orderIndex = parseInt(Object.keys(newOrder).at(-1)) + 1
      }
      newOrder[orderIndex] = entry
    })
    return Object.values(newOrder)
  }
}

export function sortBySize(arrayToSort): Product[] {
  return sort(arrayToSort)
}
