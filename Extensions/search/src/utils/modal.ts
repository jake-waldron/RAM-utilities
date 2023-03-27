// Add an event listener to the search bar to capture the input event.
export function showModal(searchBar) {
  const { modal, backdrop, modalSearchInput } = createModal()

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
  const debouncedFuzzySearch = debounce(async () => {
    dropdownMenu.innerHTML = ""
    const loadingDisplay = document.createElement("li")
    loadingDisplay.textContent = "Loading..."
    Object.assign(loadingDisplay.style, {
      padding: "5px",
      cursor: "pointer",
      textAlign: "center"
    })
    dropdownMenu.appendChild(loadingDisplay)
    try {
      const data = await fetch(
        `http://127.0.0.1:3000/api/search?q=${modalSearchInput.value}`
      )

      const results = await data.json()
      const { products } = results.data

      dropdownMenu.innerHTML = ""

      products.slice(0, 6).forEach((result) => {
        const listItem = document.createElement("li")
        Object.assign(listItem.style, {
          padding: "5px",
          cursor: "pointer"
        })
        listItem.textContent = result.name
        listItem.dataset.partNum = result.partNum
        dropdownMenu.appendChild(listItem)
      })
    } catch (error) {
      console.error(error)
    }
  }, 500)

  // Add an event listener to the search input to capture the input event.
  modalSearchInput.addEventListener("input", debouncedFuzzySearch)

  // Add an event listener to the modal to capture the user's selection.
  dropdownMenu.addEventListener("click", (event) => {
    // Populate the original search bar with the selected product name.
    searchBar.focus()
    const eventTarget = event.target as HTMLElement
    searchBar.value = eventTarget.dataset.partNum
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
