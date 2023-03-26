import { group } from "console"

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

  const sortedArray = groupedByScore.map((group) => sortArray(group))
  return sortedArray
}

function sortArray(arr): Product[] {
  const order = {
    "2-OZ": 0,
    "4-OZ": 1,
    PINT: 2,
    TRIAL: 3,
    "1-GAL": 4,
    "5-GAL": 5,
    "5-GAL PART": 99,
    UNKNOWN: 6
  }

  let newOrder = {}
  arr.forEach((entry: Product) => {
    const sizeRegex = /\b(2-OZ|4-OZ|PINT|TRIAL|1-GAL|5-GAL|5-GAL PART)\b/
    const size = entry.name.match(sizeRegex)
    const sizeName = size ? size[1] : "UNKNOWN"
    let orderIndex = order[sizeName]
    if (newOrder[orderIndex]) {
      orderIndex = parseInt(Object.keys(newOrder).at(-1)) + 1
    }
    newOrder[orderIndex] = entry
  })
  return Object.keys(newOrder)
    .sort((a, b) => +a - +b)
    .map((key) => newOrder[key])
}

export function sortBySize(arrayToSort): Product[] {
  return sort(arrayToSort).flat()
}
