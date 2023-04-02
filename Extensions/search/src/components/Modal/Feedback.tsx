import { queryClient } from "@contents/content"
import React from "react"
import { CgKey, CgSpinner } from "react-icons/cg"
import { useQuery } from "react-query"

// THIS IS WEIRD AND NEEDS FIXING

export default function Feedback({ apiResponse, hideProducts }) {
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
    console.log(formJson)

    emailData = {
      searchTerm: apiResponse.searchTerm,
      apiResponse,
      feedbackType: "Product Request",
      issue: otherDescription ? otherDescription : issue
    }

    refetch()
  }

  if (isLoading) return <p className="text-center">Sending feedback...</p>

  if (isError)
    return <p className="text-center">Sorry, something went wrong!</p>

  if (data) return <p className="text-center">Feedback sent!</p>

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      {/* // four radio inputs with labels and values of "Too many results" "Not
      enough results" "Wrong results" "Other" // text input with label "Please
      describe your issue" // submit button */}
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
      <button className="mt-2 w-max self-center text-center text-[13px] text-red-500">
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
    console.log("report issue")
    console.log(apiResponse)
    hideProducts()
    setShowForm(true)
  }
  return (
    <>
      {!showForm && (
        <FeedbackButton onClick={handleClick}>Report Issue</FeedbackButton>
      )}
      {showForm && <FeedbackForm apiResponse={apiResponse} />}
    </>
  )
}

/*

They both:
- start off showing a button (saying different things)
- when the button is clicked, they send an email
- when the email is sent, they show a message saying the email was sent

the difference is that one has a form that shows up after the email is sent to get more info, the other doesn't


*/
