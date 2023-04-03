import React from "react"
import { CgSpinner } from "react-icons/cg"
import { useQuery, useQueryClient } from "react-query"

export default function Feedback({ apiResponse, hideProducts }) {
  const queryClient = useQueryClient()
  const { products } = apiResponse

  React.useEffect(() => {
    queryClient.resetQueries({ queryKey: "email" })
  }, [apiResponse])

  return (
    <div className="mt-2 flex justify-center">
      {products.length > 0 ? (
        <ReportIssue apiResponse={apiResponse} hideProducts={hideProducts} />
      ) : (
        <RequestProduct apiResponse={apiResponse} />
      )}
    </div>
  )
}

function FeedbackButton({ children, onClick }) {
  return (
    <button
      className=" w-max self-center text-center text-[13px] text-red-500"
      onClick={onClick}>
      {children}
    </button>
  )
}

async function sendEmail(emailData) {
  const response = await fetch(`${process.env.API}/search/email`, {
    method: "POST",
    body: JSON.stringify(emailData),
    headers: {
      "Content-Type": "application/json"
    }
  })
  if (!response.ok) throw new Error("Error sending email")
  return response.json()
}

export function ReportError({ error }) {
  const emailData = {
    searchTerm: "ERROR",
    apiResponse: error.stack,
    feedbackType: "Error",
    issue: error.message
  }

  const { data, isLoading, isError, refetch } = useQuery(
    "email",
    () => sendEmail(emailData),
    { enabled: false }
  )

  async function handleClick() {
    refetch()
  }

  if (isLoading)
    return (
      <div className="flex justify-center">
        <CgSpinner className="mx-4 animate-spin text-3xl" />
        <p className="text-center">Reporting Error...</p>
      </div>
    )

  if (isError)
    return <p className="text-center">Sorry, something went wrong!</p>

  if (data) return <p className="text-center">Error reported!</p>

  return <FeedbackButton onClick={handleClick}>Report Error</FeedbackButton>
}

function RequestProduct({ apiResponse }) {
  const emailData = {
    searchTerm: apiResponse.searchTerm,
    apiResponse,
    feedbackType: "Product Request",
    issue: "Product Request"
  }

  const { data, isLoading, isError, refetch } = useQuery(
    "email",
    () => sendEmail(emailData),
    { enabled: false }
  )

  async function handleClick() {
    refetch()
  }

  if (isLoading)
    return (
      <div className="flex justify-center">
        <CgSpinner className="mx-4 animate-spin text-3xl" />
        <p className="text-center">Requesting product...</p>
      </div>
    )

  if (isError)
    return <p className="text-center">Sorry, something went wrong!</p>

  if (data) return <p className="text-center">Product requested!</p>

  return <FeedbackButton onClick={handleClick}>Request Product</FeedbackButton>
}

function FeedbackForm({ apiResponse }) {
  const otherRadioRef = React.useRef<HTMLInputElement>(null)
  const otherDescRef = React.useRef<HTMLInputElement>(null)
  const [formErrorMsg, setFormErrorMsg] = React.useState("")
  let emailData = {}

  const { data, isLoading, isError, refetch } = useQuery(
    "email",
    () => sendEmail(emailData),
    { enabled: false }
  )

  function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)
    const formJson = Object.fromEntries(formData.entries())
    const { issue, otherDescription } = formJson

    if (!issue) return setFormErrorMsg("Please select an issue")

    if (issue === "Other" && !otherDescription) {
      setFormErrorMsg("Please add a description")
      otherRadioRef.current.checked = true
      otherDescRef.current.focus()
      return
    }

    if (formErrorMsg && (issue || (issue === "Other" && otherDescription))) {
      setFormErrorMsg("")
    }

    emailData = {
      searchTerm: apiResponse.searchTerm,
      apiResponse,
      feedbackType: "Product Request",
      issue: otherDescription ? otherDescription : issue
    }

    refetch()
  }

  if (isLoading)
    return (
      <div className="flex justify-center">
        <CgSpinner className="mx-4 animate-spin text-3xl" />
        <p className="text-center">Sending feedback...</p>
      </div>
    )

  if (isError)
    return <p className="text-center">Sorry, something went wrong!</p>

  if (data) return <p className="text-center">Feedback sent!</p>

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <div className="flex flex-col">
        <label htmlFor="tooManyResults">
          <input
            type="radio"
            name="issue"
            id="tooManyResults"
            value="Too many results"
            className="mr-3"
          />
          Too many results
        </label>
        <label htmlFor="notEnoughResults">
          <input
            type="radio"
            name="issue"
            id="notEnoughResults"
            value="Not enough results"
            className="mr-3"
          />
          Not enough results
        </label>
        <label htmlFor="wrongResults">
          <input
            type="radio"
            name="issue"
            id="wrongResults"
            value="Wrong results"
            className="mr-3"
          />
          Wrong results
        </label>
        <div>
          <label htmlFor="other">
            <input
              ref={otherRadioRef}
              type="radio"
              name="issue"
              id="other"
              value="Other"
              className="mr-3"
              onClick={() => otherDescRef.current?.focus()}
            />
            Other
          </label>
          <input
            type="text"
            ref={otherDescRef}
            name="otherDescription"
            id="otherDescription"
            className="ml-2 border pl-2"
            onFocus={() => {
              otherRadioRef.current.checked = true
            }}
          />
        </div>
      </div>
      {formErrorMsg && (
        <p className="text-[13px] text-red-500">{formErrorMsg}</p>
      )}
      <button className="mt-2 w-max  rounded-lg bg-AMP_GREEN py-2 px-6 text-[13px] text-white">
        Submit
      </button>
    </form>
  )
}

function ReportIssue({ apiResponse, hideProducts }) {
  const [showForm, setShowForm] = React.useState(false)

  React.useEffect(() => {
    setShowForm(false)
  }, [apiResponse])

  function handleClick() {
    hideProducts()
    setShowForm(true)
  }

  return (
    <>
      {showForm ? (
        <FeedbackForm apiResponse={apiResponse} />
      ) : (
        <FeedbackButton onClick={handleClick}>Report Issue</FeedbackButton>
      )}
    </>
  )
}
