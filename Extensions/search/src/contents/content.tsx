import type { PlasmoCSConfig } from "plasmo"
import cssText from "data-text:../styles.css"
import { showModal } from "../utils/modal"
import React from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "react-query"

import Button from "../components/Button"
import useStore from "@/store"
import Modal from "@components/Modal"

export const config: PlasmoCSConfig = {
  matches: [
    "https://amp.reynoldsam.com/*",
    "https://ram-bam-us-web-qa.azurewebsites.net/*"
  ]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const queryClient = new QueryClient()

type AvailableBars = {
  selector: string
  pathname: string
  searchRegex: RegExp
  parent: string
}

type SearchBar = {
  searchBar: HTMLInputElement
  parentElement: HTMLElement
}

const searchBars: AvailableBars[] = [
  {
    selector: '#ProductSearchGrid_TextBox input[type="text"]',
    pathname: "/Product",
    searchRegex: /.*$/,
    parent: ".dx-texteditor-container:has(.dx-texteditor-input-container)"
  },
  {
    selector: "#OrderNewLineItemSearchBox_I",
    pathname: "/Order/Create",
    searchRegex: /.*$/,
    parent: "tr:has(#OrderNewLineItemSearchBox_B-100)"
  }
]

const addItemBars: AvailableBars[] = [
  {
    selector: "#PurchaseOrderNewLineItemSearchBox_I",
    pathname: "/PurchaseOrder/View",
    searchRegex: /\?purchaseOrderPK=([^&]*)&activeTab=lineItems/,
    parent: "tr:has(#PurchaseOrderNewLineItemSearchBox_I)"
  },
  {
    selector: "#OrderNewLineItemSearchBox_I",
    pathname: "/Order/View",
    searchRegex: /\?orderPK=([^&]*)&showInvoice=False&activeTab=lineItems/,
    parent: "tr:has(#OrderNewLineItemSearchBox_I)"
  }
]

export default function ReactContainer() {
  const { showModal } = useStore()
  // Creates a container for the modal to appear in
  return (
    <QueryClientProvider client={queryClient}>
      {showModal && <Modal />}
    </QueryClientProvider>
  )
}

// TESTING REACT
// Add button to Add Items bars
// handles differently because we have to wait for the request to be made before the bar is on the page
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "add items") {
    findBarAndAddButton(addItemBars)
  }
})

// Handles normal search bars that load with the page
window.addEventListener("load", () => {
  findBarAndAddButton(searchBars)
})

// TDOD:
// - Figure out how to trigger search on product page without using keyboard
// - See if there's a way to re-trigger search when category is changed on product page
// - Add tabbing to the modal
// - Add tests to check filtering logic

// checks page for search bars and adds button to them
function findBarAndAddButton(listOfBars: AvailableBars[]) {
  const foundBars = checkForBars(listOfBars)
  const searchBar: SearchBar = foundBars.find((bar) => bar?.searchBar)
  if (searchBar) {
    // creates dom node to render react button component into
    const domNode = document.createElement("div")
    searchBar.parentElement.prepend(domNode)
    const root = createRoot(domNode)
    console.log("adding button!")
    root.render(<Button searchBar={searchBar.searchBar} />)
  }
}

function checkForBars(searchBars) {
  const checkForBars = searchBars.map((searchBar) => {
    if (
      window.location.pathname === searchBar.pathname &&
      searchBar.searchRegex.test(window.location.search)
    ) {
      return {
        searchBar: document.querySelector(searchBar.selector),
        parentElement: document.querySelector(searchBar.parent)
      }
    }
  })
  return checkForBars
}

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
  button.id = "jake-search-button"
  button.innerText = "Quick Search"
  button.style.display = "inline-block"
  button.addEventListener("click", async (e) => {
    e.preventDefault()
    try {
      fetch(`${process.env.API}/wake-up`)
    } catch (error) {
      console.error(error)
    }
    if (
      !document.querySelector("#jake-modal") &&
      !document.querySelector("#jake-modal-backdrop")
    ) {
      showModal(searchBar.searchBar)
    }
  })
  if (!document.querySelector("#jake-search-button")) {
    searchBar.parentElement.prepend(button)
  }
}

class SearchButton {
  button: HTMLButtonElement
  searchBar: HTMLInputElement
  parentElement: HTMLElement

  constructor(searchBar: SearchBar) {
    this.searchBar = searchBar.searchBar
    this.parentElement = searchBar.parentElement

    this.button = document.createElement("button")
    Object.assign(this.button.style, {
      display: "inline-block",
      height: "34px",
      width: "max-content",
      background: "#1ab394",
      color: "white",
      border: "0",
      padding: "4px 8px"
    })
    this.button.id = "jake-search-button"
    this.button.innerText = "Quick Search"
    this.button.style.display = "inline-block"
    this.button.addEventListener("click", async (e) => {
      e.preventDefault()
      try {
        fetch(`${process.env.API}/wake-up`)
      } catch (error) {
        console.error(error)
      }
      if (
        !document.querySelector("#jake-modal") &&
        !document.querySelector("#jake-modal-backdrop")
      ) {
        // showModal(this.searchBar)
        // setState({ showModal: true })
      }
    })
  }

  attachButtonTo() {
    if (!document.querySelector("#jake-search-button")) {
      this.parentElement.prepend(this.button)
    }
  }
}
