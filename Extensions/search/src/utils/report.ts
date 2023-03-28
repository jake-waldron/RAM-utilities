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

export default function createReportContainer({
  buttonText,
  requestArray,
  searchTerm,
  products,
  runBefore
}: Props) {
  // create the container
  const reportContainer = createContainer()

  // create the button
  const reportBtn = createButton(buttonText)
  if (!document.getElementById("report-btn")) {
    reportContainer.appendChild(reportBtn)
  }

  reportBtn.addEventListener("click", () => {
    // if there is only one request, it means the user is requesting to add an item
    // so just send an email with the search term
    if (requestArray.length === 1) {
      const emailOptions = {
        request: requestArray[0],
        searchTerm: searchTerm,
        products
      }

      sendEmail(emailOptions)
      return
    }

    // if there are multiple requests, it means the user is reporting an issue
    if (requestArray.length >= 2) {
      // create form and attach, then add button
      runBefore()
      const form = createForm()

      const optionDiv = document.createElement("div")
      Object.assign(optionDiv.style, {
        display: "flex",
        flexDirection: requestArray.length === 2 ? "row" : "column",
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
      reportContainer.appendChild(form)

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
          products
        }
        sendEmail(emailOptions)
        // return

        reportContainer.textContent = "Email sent!"
      })
    }
    reportBtn.remove()
  })

  return reportContainer
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
  const reportContainer = document.createElement("div")
  reportContainer.id = "report-container"
  Object.assign(reportContainer.style, {
    padding: "4px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  })
  return reportContainer
}

function createButton(buttonText): HTMLButtonElement {
  const button = document.createElement("button")
  button.textContent = buttonText
  button.id = "report-btn"
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
  products
}: {
  request: string
  searchTerm: string
  products: ProductResults[]
}) {
  window.open(
    `mailto:jakewaldron+ram@gmail.com?subject=Search - "${searchTerm}"&body=Request: ${request}%0d%0a%0d%0aSearched for: "${searchTerm}"%0d%0a%0d%0aAPI Response:%0d%0a${JSON.stringify(
      products
    )}`
  )
}
