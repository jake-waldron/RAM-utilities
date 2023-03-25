import Fuse from "fuse.js"

import { products } from "../utils/products"

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

// Add an event listener to the search bar to capture the input event.
export function showModal(searchBar) {
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

  backdrop.addEventListener("click", () => {
    modal.remove()
    backdrop.remove()
  })
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      modal.remove()
      backdrop.remove()
    }
  })

  // Add a new text input for the user to enter their search term.
  const searchInput = document.createElement("input")
  searchInput.setAttribute("type", "text")
  searchInput.setAttribute("placeholder", "Enter search term")
  Object.assign(searchInput.style, {
    display: "block",
    marginBottom: "10px",
    width: "100%",
    padding: "5px"
  })
  modal.appendChild(searchInput)

  // Search the database of product names using fuse.js.
  // const productNames = ["er205", "er400", "product3"] // Replace with your own database
  const fuse = new Fuse(products, { keys: ["name"] })

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
    const searchResults = fuse.search(searchInput.value)
    dropdownMenu.innerHTML = ""

    searchResults.slice(0, 10).forEach((result) => {
      const listItem = document.createElement("li")
      Object.assign(listItem.style, {
        padding: "5px",
        cursor: "pointer"
      })
      listItem.classList.add("dropdown-item")
      listItem.textContent = result.item.name
      dropdownMenu.appendChild(listItem)
    })
    // add listener to each option here so it can easily set the value of the input
  }, 500)

  // Add an event listener to the search input to capture the input event.
  searchInput.addEventListener("input", debouncedFuzzySearch)

  // Add an event listener to the modal to capture the user's selection.
  dropdownMenu.addEventListener("click", (event) => {
    // Populate the original search bar with the selected product name.
    searchBar.focus()
    const eventTarget = event.target as HTMLElement
    const selectedProduct = products.find(
      (product) => product.name === eventTarget.textContent
    )
    searchBar.value = selectedProduct.partNum
    modal.remove()
    backdrop.remove()
  })

  // Add an event listener to the modal to close it on user click outside.
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove()
    }
  })

  // Add the modal to the current page.
  document.body.appendChild(backdrop)
  document.body.appendChild(modal)
  searchInput.focus()
}

export {}
