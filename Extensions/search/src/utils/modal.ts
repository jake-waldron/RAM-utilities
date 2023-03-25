import Fuse from "fuse.js/dist/fuse.basic.esm.min.js"

import { products } from "../utils/products"
import { sortBySize } from "../utils/sort"

type FuseResults = {
  item: {
    name: string
    partNum: string
  }
  score: number
}

// Add an event listener to the search bar to capture the input event.
export function showModal(searchBar) {
  const { modal, backdrop, modalSearchInput } = createModal()

  // Search the database of product names using fuse.js.
  const fuse = new Fuse(products, {
    keys: ["name"],
    threshold: 0.3,
    includeScore: true
  })

  // Display a list of matching product names in the modal.
  const dropdownMenu = document.createElement("ul")
  Object.assign(dropdownMenu.style, {
    listStyle: "none",
    padding: "0",
    margin: "0",
    maxHeight: "200px",
    overflowY: "auto"
  })
  modal.appendChild(dropdownMenu)

  // Define a debounced fuzzy search function that executes when the user stops typing.
  const debouncedFuzzySearch = debounce(() => {
    const searchResults = fuse.search(modalSearchInput.value)
    const filteredResults = filterResults(searchResults)
    const checkForScoreGaps = checkForGaps(filteredResults)
    const sortedResults = sortBySize(checkForScoreGaps)
    dropdownMenu.innerHTML = ""

    sortedResults.slice(0, 6).forEach((result) => {
      const listItem = document.createElement("li")
      Object.assign(listItem.style, {
        padding: "5px",
        cursor: "pointer"
      })
      listItem.textContent = result.name
      dropdownMenu.appendChild(listItem)
    })
    // add listener to each option here so it can easily set the value of the input
  }, 500)

  // Add an event listener to the search input to capture the input event.
  modalSearchInput.addEventListener("input", debouncedFuzzySearch)

  // Add an event listener to the modal to capture the user's selection.
  dropdownMenu.addEventListener("click", (event) => {
    // Populate the original search bar with the selected product name.
    searchBar.focus()
    const eventTarget = event.target as HTMLElement
    const selectedProduct = products.find(
      (product) => product.name === eventTarget.textContent
    )
    searchBar.value = selectedProduct.partNum
    remove(modal, backdrop)
    searchBar.focus()
    searchBar.dispatchEvent(new KeyboardEvent("keydown", { key: "Space" }))
  })

  // Add the modal to the current page.
  document.body.appendChild(backdrop)
  document.body.appendChild(modal)
  modalSearchInput.focus()
}

function createModal() {
  const modal = document.createElement("div")
  Object.assign(modal.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    backgroundColor: "#fff",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
    zIndex: "999",
    padding: "10px"
  })
  const backdrop = document.createElement("div")
  Object.assign(backdrop.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: "999"
  })
  const modalSearchInput = document.createElement("input")
  modalSearchInput.setAttribute("type", "text")
  modalSearchInput.setAttribute("placeholder", "Enter search term")
  Object.assign(modalSearchInput.style, {
    display: "block",
    marginBottom: "10px",
    width: "100%",
    padding: "5px"
  })
  modal.appendChild(modalSearchInput)

  backdrop.addEventListener("click", () => {
    remove(modal, backdrop)
  })
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      remove(modal, backdrop)
    }
  })
  return { modal, backdrop, modalSearchInput }
}

function remove(...args) {
  args.forEach((arg) => arg.remove())
}

// filter results by score, return only the result items
function filterResults(results: FuseResults[]) {
  const scores = getScores(results)
  if (results.some((result) => result.score <= 0.1)) {
    return filteredResults(results.filter((result) => result.score <= 0.1))
  }
  if (results.some((result) => result.score <= 0.4)) {
    return filteredResults(results.filter((result) => result.score <= 0.4))
  }
  if (scores[1] > 0.5 && scores[1] - scores[0] > 0.02) {
    return filteredResults(
      results.filter((result) => result.score === scores[0])
    )
  }

  return filteredResults(results)
}

function checkForGaps(results) {
  const scores = getScores(results)
  if (scores.at(-1) <= 0.1) return results
  if (scores.length <= 1 || results.length <= 3) {
    return results
  }
  let returnedResults = []
  // there's still something weird here I think
  scores.forEach((score, index) => {
    if (index === 0) return
    const gap = score - scores[index - 1]
    if (gap > 0.04) {
      returnedResults.push(...results.filter((result) => result.score < score))
    }
  })
  return returnedResults
}

function getScores(results: FuseResults[]) {
  return Array.from(new Set(results.map((result) => result.score))).sort(
    (a, b) => a - b
  )
}

function filteredResults(results) {
  return results.map((result) => {
    return {
      name: result.item.name,
      partNum: result.item.partNum,
      score: result.score
    }
  })
}

function debounce(func, wait) {
  let timeout

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
