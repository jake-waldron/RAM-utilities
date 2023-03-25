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
  console.log("content script loaded")
  console.log(window.location.pathname)
  const findBars = searchBars.map((searchBar) => {
    if (window.location.pathname === searchBar.pathname) {
      return {
        searchBar: document.querySelector(searchBar.selector),
        parentElement: document.querySelector(searchBar.parent)
      }
    }
  })
  const searchBar = findBars.find((bar) => bar?.searchBar)
  const parentElement = searchBar?.parentElement
  if (parentElement) {
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
    parentElement.prepend(button)
  }
  // searchBars.map((searchBar) => {
  //   if (window.location.pathname.includes(searchBar.pathname)) {
  //     const input = document.querySelector(searchBar.selector)
  //     if (input) {
  //       console.log("theres an input here!")
  //     }
  //   }
  // })

  // document.body.style.background = "pink"
})
