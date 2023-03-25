import Fuse from "fuse.js"

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
    backgroundColor: "#fff",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
    zIndex: "999",
    padding: "10px"
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
  const productNames = ["er205", "er400", "product3"] // Replace with your own database
  const fuse = new Fuse(productNames, { keys: ["name"] })

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

    searchResults.forEach((result) => {
      const listItem = document.createElement("li")
      Object.assign(listItem.style, {
        padding: "5px",
        cursor: "pointer"
      })
      listItem.classList.add("dropdown-item")
      listItem.textContent = result.item
      dropdownMenu.appendChild(listItem)
    })
  }, 500)

  // Add an event listener to the search input to capture the input event.
  searchInput.addEventListener("input", debouncedFuzzySearch)

  // Add an event listener to the modal to capture the user's selection.
  dropdownMenu.addEventListener("click", (event) => {
    // Populate the original search bar with the selected product name.
    searchBar.focus()
    const eventTarget = event.target as HTMLElement
    searchBar.value = eventTarget.textContent
    modal.remove()
  })

  // Add an event listener to the modal to close it on user click outside.
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove()
    }
  })

  // Add the modal to the current page.
  document.body.appendChild(modal)
  searchInput.focus()
}

export {}
