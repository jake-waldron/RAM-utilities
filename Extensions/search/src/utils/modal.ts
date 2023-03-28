import createReportContainer from "./report"

import { AMP_GREEN, FONT_COLOR } from "./constants"

// Add an event listener to the search bar to capture the input event.
export function showModal(searchBar) {
  const { modal, backdrop, modalSearchInput } = createModal()

  // Display a list of matching product names in the modal.
  const resultsDisplay = createResultsDisplay()
  modal.appendChild(resultsDisplay)

  // Define a debounced fuzzy search function that executes when the user stops typing.
  const debouncedFuzzySearch = debounce(async () => {
    clearResults(resultsDisplay)
    showLoading(resultsDisplay)

    const searchTerm = modalSearchInput.value

    try {
      const data = await fetch(`${process.env.API}/search?q=${searchTerm}`)

      const results = await data.json()
      const { products, error } = results.data

      clearResults(resultsDisplay)

      if (error) {
        const errorItem = document.createElement("li")
        errorItem.textContent = error
        Object.assign(errorItem.style, {
          padding: "5px",
          textAlign: "center",
          color: "red"
        })
        return resultsDisplay.appendChild(errorItem)
      }

      if (searchTerm !== "") {
        if (products.length === 0) {
          // If there are no results, display a message in the modal.
          const noResults = document.createElement("li")
          noResults.textContent = "No results found."
          Object.assign(noResults.style, {
            padding: "5px",
            textAlign: "center"
          })
          resultsDisplay.appendChild(noResults)
          // Add a button to the modal that allows the user to request a product.
          const requestItem = createReportContainer({
            buttonText: "Request product",
            requestArray: ["Request product"],
            searchTerm,
            products
          })
          if (!document.querySelector("#report-container")) {
            return resultsDisplay.appendChild(requestItem)
          }
        }

        // If there are results, display them in the modal.
        const resultListItems = products.slice(0, 6).map((result) => {
          return createResultListItem(result)
        })

        resultListItems.forEach((item) => {
          resultsDisplay.appendChild(item)
          item.addEventListener("click", (event) => {
            // Populate the original search bar with the selected product name.
            searchBar.focus()
            const eventTarget = event.target as HTMLElement
            searchBar.value = eventTarget.dataset.partNum
            remove(modal, backdrop)
            searchBar.focus()
          })
        })

        // Add a button to the modal that allows the user to report an issue.
        const requestItem = createReportContainer({
          buttonText: "Report Issue",
          requestArray: [
            "Too many results",
            "Not enough results",
            "Unfocused results",
            "Other"
          ],
          searchTerm,
          products,
          runBefore: () => (resultsDisplay.innerHTML = "")
        })
        if (!document.querySelector("#report-container")) {
          modal.appendChild(requestItem)
        }
      }
      // add reportContainer
    } catch (error) {
      console.error(error)
    }
  }, 500)

  // Add an event listener to the search input to capture the input event.
  modalSearchInput.addEventListener("input", debouncedFuzzySearch)

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
    zIndex: "99999",
    padding: "10px",
    height: "auto"
  })
  modal.id = "jake-modal"
  const backdrop = document.createElement("div")
  Object.assign(backdrop.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: "99998"
  })
  backdrop.id = "jake-modal-backdrop"
  const modalSearchInput = document.createElement("input")
  modalSearchInput.setAttribute("type", "text")
  modalSearchInput.setAttribute("placeholder", "Enter search term")
  Object.assign(modalSearchInput.style, {
    display: "block",
    marginBottom: "10px",
    width: "100%",
    padding: "5px"
  })
  modalSearchInput.placeholder = "Enter product name..."
  modal.appendChild(modalSearchInput)

  backdrop.addEventListener("click", () => {
    console.log("backdrop clicked")
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

function createResultListItem(result) {
  const listItem = document.createElement("li")
  Object.assign(listItem.style, {
    padding: "5px",
    cursor: "pointer"
  })
  listItem.onmouseenter = () => {
    listItem.style.backgroundColor = AMP_GREEN
    listItem.style.color = "#fff"
  }
  listItem.onmouseleave = () => {
    listItem.style.backgroundColor = "#fff"
    listItem.style.color = FONT_COLOR
  }
  listItem.textContent = result.name
  listItem.dataset.partNum = result.partNum
  return listItem
}

function showLoading(container: HTMLElement) {
  const loadingDisplay = document.createElement("li")
  loadingDisplay.textContent = "Loading..."
  Object.assign(loadingDisplay.style, {
    padding: "5px",
    textAlign: "center"
  })
  container.appendChild(loadingDisplay)
}

function createResultsDisplay(): HTMLUListElement {
  document.createElement("ul")
  const resultsDisplay = document.createElement("ul")
  Object.assign(resultsDisplay.style, {
    listStyleType: "none",
    margin: "0",
    padding: "0",
    overflow: "auto",
    maxHeight: "200px"
  })
  return resultsDisplay
}

function clearResults(resultsDisplay: HTMLUListElement) {
  resultsDisplay.innerHTML = ""
  const resultsContainer = document.querySelector("#report-container")
  if (resultsContainer) {
    remove(resultsContainer)
  }
}
