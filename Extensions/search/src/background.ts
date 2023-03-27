export {}

function sendMessage() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      message: "add items"
    })
  })
}

chrome.webRequest.onCompleted.addListener(sendMessage, {
  urls: ["https://*/PurchaseOrder/AddLineItemsView*"]
})
