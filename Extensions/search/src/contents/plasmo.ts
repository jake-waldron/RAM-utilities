import type { PlasmoCSConfig } from "plasmo"
import { showModal } from "../utils/modal"

export const config: PlasmoCSConfig = {
  matches: [
    "https://amp.reynoldsam.com/*",
    "https://ram-bam-us-web-qa.azurewebsites.net/*"
  ]
}

const searchBars = [
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
  const findBars = searchBars.map((searchBar) => {
    if (window.location.pathname === searchBar.pathname) {
      return {
        searchBar: document.querySelector(searchBar.selector),
        parentElement: document.querySelector(searchBar.parent)
      }
    }
  })
  const searchBar = findBars.find((bar) => bar?.searchBar)
  if (searchBar) {
    // const parentElement = searchBar?.parentElement
    createAndAttachButton(searchBar)
  }
})

function createAndAttachButton(searchBar) {
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
  button.innerText = "Jake's Better Search"
  button.style.display = "inline-block"
  button.addEventListener("click", async (e) => {
    e.preventDefault()
    console.log("clicked")
    showModal(searchBar.searchBar)
  })
  searchBar.parentElement.prepend(button)
}
