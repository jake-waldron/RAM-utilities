import React from "react"

// THIS IS WEIRD AND NEEDS FIXING

export default function Feedback({ apiResponse, hideProducts }) {
  const { products } = apiResponse

  return (
    <>
      {products.length > 0 ? (
        <ReportIssue apiResponse={apiResponse} hideProducts={hideProducts} />
      ) : (
        <RequestProduct apiResponse={apiResponse} />
      )}
    </>
  )
}

function FeedbackButton({ children, onClick }) {
  return (
    <button
      className="mt-2 w-max self-center text-center text-[13px] text-red-500"
      onClick={onClick}>
      {children}
    </button>
  )
}

function RequestProduct({ apiResponse }) {
  function handleClick() {
    console.log("request product")
    console.log(apiResponse)
  }

  return <FeedbackButton onClick={handleClick}>Request Product</FeedbackButton>
}

function sendEmail(emailOptions) {
  // const { subject, body } = emailOptions
  const { searchTerm, apiResponse, feedbackType } = emailOptions
  const email = `mailto:jakewaldron+ram@gmail.com?subject=Search - "${searchTerm}"&body=Issue: ${feedbackType}%0d%0a%0d%0aSearched for: "${searchTerm}"%0d%0a%0d%0aAPI Response:%0d%0a${JSON.stringify(
    apiResponse
  )}`
  window.open(email)
  console.log(email)
}

function FeedbackForm() {
  function handleSubmit(e) {
    e.preventDefault()
    console.log("submit form")
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <p>FEEDBACK FORM</p>
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
      {showForm && <FeedbackForm />}
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
