import type { PlasmoCSConfig } from "plasmo"
import { showModal } from "../utils/modal"

export const config: PlasmoCSConfig = {
  matches: [
    "https://amp.reynoldsam.com/*",
    "https://ram-bam-us-web-qa.azurewebsites.net/*"
  ]
}

type AvailableBars = {
  selector: string
  pathname: string
  parent: string
}

type SearchBar = {
  searchBar: Element
  parentElement: Element
}

const searchBars: AvailableBars[] = [
  {
    selector: '#ProductSearchGrid_TextBox input[type="text"]',
    pathname: "/Product",
    parent: ".dx-texteditor-container:has(.dx-texteditor-input-container)"
  },
  {
    selector: "#OrderNewLineItemSearchBox_I",
    pathname: "/Order/Create",
    parent: "tr:has(#OrderNewLineItemSearchBox_B-100)"
  }
]

window.addEventListener("load", () => {
  const checkForBars = searchBars.map((searchBar) => {
    if (window.location.pathname === searchBar.pathname) {
      return {
        searchBar: document.querySelector(searchBar.selector),
        parentElement: document.querySelector(searchBar.parent)
      }
    }
  })
  const searchBar: SearchBar = checkForBars.find((bar) => bar?.searchBar)
  if (searchBar) {
    createAndAttachButton(searchBar)
  }
})

function createAndAttachButton(searchBar: SearchBar) {
  const button = document.createElement("button")
  Object.assign(button.style, {
    display: "inline-block",
    height: "34px",
    width: "max-content",
    background: "#1ab394",
    color: "white",
    border: "0",
    padding: "4px 8px"
  })
  button.innerText = "Quick Search"
  button.style.display = "inline-block"
  button.addEventListener("click", async (e) => {
    e.preventDefault()
    console.log("clicked")
    showModal(searchBar.searchBar)
  })
  searchBar.parentElement.prepend(button)
}

// TDOD:
// - Figure out how to trigger search on product page without using keyboard
// - See if there's a way to re-trigger search when category is changed on product page
// - Add tabbing to the modal
// - Add tests to check filtering logic
