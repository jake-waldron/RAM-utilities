import type { PlasmoCSConfig } from "plasmo"
import cssText from "data-text:../styles.css"
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
  buttonHeight: string
}

type SearchBar = {
  searchBar: HTMLInputElement
  parentElement: HTMLElement
  buttonHeight: string
}

const searchBars: AvailableBars[] = [
  {
    selector: '#ProductSearchGrid_TextBox input[type="text"]',
    pathname: "/Product",
    searchRegex: /.*$/,
    parent: ".dx-texteditor-container:has(.dx-texteditor-input-container)",
    buttonHeight: "34px"
  },
  {
    selector: "#OrderNewLineItemSearchBox_I",
    pathname: "/Order/Create",
    searchRegex: /.*$/,
    parent: "tr:has(#OrderNewLineItemSearchBox_B-100)",
    buttonHeight: "31px"
  }
]

const addItemBars: AvailableBars[] = [
  {
    selector: "#PurchaseOrderNewLineItemSearchBox_I",
    pathname: "/PurchaseOrder/View",
    searchRegex: /\?purchaseOrderPK=([^&]*)&activeTab=lineItems/,
    parent: "tr:has(#PurchaseOrderNewLineItemSearchBox_I)",
    buttonHeight: "32px"
  },
  {
    selector: "#OrderNewLineItemSearchBox_I",
    pathname: "/Order/View",
    searchRegex: /\?orderPK=([^&]*)&showInvoice=False&activeTab=lineItems/,
    parent: "tr:has(#OrderNewLineItemSearchBox_I)",
    buttonHeight: "32px"
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
    if (!document.querySelector("#quick-search-button")) {
      const domNode = document.createElement("div")
      domNode.style.height = searchBar.buttonHeight
      searchBar.parentElement.prepend(domNode)
      const root = createRoot(domNode)
      root.render(<Button searchBar={searchBar.searchBar} />)
    }
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
        parentElement: document.querySelector(searchBar.parent),
        buttonHeight: searchBar.buttonHeight
      }
    }
  })
  return checkForBars
}
