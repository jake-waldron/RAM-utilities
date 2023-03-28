import { AMP_GREEN } from "./constants"

type Props = {
  buttonText: string
  requestArray: string[]
  searchTerm: string
  products: ProductResults[] | null
  runBefore?(): void
}

type ProductResults = {
  name: string
  partNum: string
  score: number
}

let _requestContainer

function createRequestContainer(buttonText, runOnClick) {
  // create the container
  const requestContainer = createContainer()

  // create the button
  const requestButton = createButton(buttonText)
  if (!document.getElementById("request-button")) {
    requestContainer.appendChild(requestButton)
  }

  requestButton.addEventListener("click", () => {
    runOnClick()

    requestButton.remove()
  })

  return requestContainer
}

export function createErrorContainer({ searchTerm, error }) {
  function onClick() {
    const apiResponse = {
      message: error.message,
      stack: error.stack
    } as Error
    const emailOptions = {
      request: "Error",
      searchTerm: searchTerm,
      apiResponse
    }
    sendEmail(emailOptions)

    return
  }
  return createRequestContainer("Report Error", onClick)
}

export function createRequestProductContainer({ searchTerm, apiResponse }) {
  function onClick() {
    const emailOptions = {
      request: "Request product",
      searchTerm: searchTerm,
      apiResponse
    }
    sendEmail(emailOptions)

    return
  }
  return createRequestContainer("Request product", onClick)
}

export function createReportIssueContainter({
  searchTerm,
  apiResponse,
  clearResults
}) {
  function onClick() {
    clearResults()
    const requestArray = [
      "Too many results",
      "Not enough results",
      "Unfocused results",
      "Other"
    ]

    const form = createForm()

    const optionDiv = document.createElement("div")
    Object.assign(optionDiv.style, {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      justifyContent: "center",
      alignItems: "center"
    })
    const formOptions = addFormOptions(requestArray)
    formOptions.forEach((option) => optionDiv.appendChild(option))

    form.appendChild(optionDiv)
    const sendBtn = document.createElement("button")
    sendBtn.type = "submit"
    sendBtn.textContent = "Send"
    Object.assign(sendBtn.style, {
      backgroundColor: AMP_GREEN,
      width: "100px",
      height: "30px",
      borderRadius: "5px",
      color: "white",
      border: "none",
      marginTop: "8px"
    })

    form.appendChild(sendBtn)
    _requestContainer.appendChild(form)

    form.addEventListener("submit", (event) => {
      event.preventDefault()
      let request = Array.from(optionDiv.querySelectorAll("input")).find(
        (option: HTMLInputElement) => option.checked
      ).value
      if (request === "Other") {
        const otherInput: HTMLInputElement =
          document.querySelector("#other-input")
        request = `Other - ${otherInput.value}`
        if (otherInput.value === "") {
          return otherInput.focus()
        }
      }
      const emailOptions = {
        request,
        searchTerm,
        apiResponse
      }
      sendEmail(emailOptions)
    })
  }
  return createRequestContainer("Report issue", onClick)
}

function createForm(): HTMLFormElement {
  const form = document.createElement("form")
  Object.assign(form.style, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  })

  return form
}

function addFormOptions(requestArray) {
  const options = requestArray.map((request: string) => {
    const radioContainer = document.createElement("div")
    Object.assign(radioContainer.style, {
      display: "flex",
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "start",
      gap: "8px",
      width: "60%"
    })
    const radio = document.createElement("input")
    radio.type = "radio"
    radio.name = "report-request"
    radio.value = request
    radio.id = request
    radioContainer.appendChild(radio)

    const label = document.createElement("label")
    label.style.marginLeft = "6px"
    label.style.marginBottom = "0"
    label.textContent = request
    label.htmlFor = request
    radioContainer.appendChild(label)

    if (request === "Other") {
      const otherInput = document.createElement("input")
      otherInput.type = "text"
      otherInput.name = "other"
      otherInput.id = "other-input"
      otherInput.placeholder = "Please specify"
      otherInput.required = radio.checked
      radioContainer.appendChild(otherInput)

      otherInput.addEventListener("focus", () => {
        if (!radio.checked) {
          radio.checked = true
        }
      })
    }
    return radioContainer
  })
  return options
}

function createContainer(): HTMLDivElement {
  const requestContainer = document.createElement("div")
  requestContainer.id = "request-container"
  Object.assign(requestContainer.style, {
    padding: "4px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  })
  _requestContainer = requestContainer

  return requestContainer
}

function createButton(buttonText): HTMLButtonElement {
  const button = document.createElement("button")
  button.textContent = buttonText
  button.id = "request-button"
  Object.assign(button.style, {
    border: "none",
    backgroundColor: "inherit",
    color: "red",
    fontSize: "12px",
    cursor: "pointer"
  })
  return button
}

function sendEmail({
  request,
  searchTerm,
  apiResponse
}: {
  request: string
  searchTerm: string
  apiResponse: ProductResults[] | Error
}) {
  window.open(
    `mailto:jakewaldron+ram@gmail.com?subject=Search - "${searchTerm}"&body=Issue: ${request}%0d%0a%0d%0aSearched for: "${searchTerm}"%0d%0a%0d%0aAPI Response:%0d%0a${JSON.stringify(
      apiResponse
    )}`
  )
  _requestContainer.textContent = "Email sent!"
}
