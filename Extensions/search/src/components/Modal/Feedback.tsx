import React from "react"

// THIS IS WEIRD AND NEEDS FIXING

export default function Feedback({ apiResponse, hideProducts }) {
  const [showButton, setShowButton] = React.useState(true)
  const [showForm, setShowForm] = React.useState(false)
  const [feedbackSent, setFeedbackSent] = React.useState(false)

  let { products, searchTerm } = apiResponse
  React.useEffect(() => {
    products = apiResponse.products
    searchTerm = apiResponse.searchTerm
  }, [apiResponse])

  console.log(products)
  function handleProductRequest() {
    console.log("Request Product")
    console.log(apiResponse)
    sendEmail({
      searchTerm,
      apiResponse,
      feedbackType: "Product Request"
    })
    setShowButton(false)
    setFeedbackSent(true)
  }

  function handleReportIssue() {
    console.log("Report Issue")
    console.log(apiResponse)
    sendEmail({
      searchTerm,
      apiResponse,
      feedbackType: "Report Issue"
    })
    hideProducts()
    setShowButton(false)
    setShowForm(true)
  }

  const buttonProps = {
    onClick: products.length === 0 ? handleProductRequest : handleReportIssue,
    display: products.length === 0 ? "Request Product" : "Report Issue"
  }

  return (
    <>
      {products.length === 0 && <RequestProduct />}
      {products.length > 0 && <ReportIssue onClick={hideProducts} />}
      {/* {showButton && (
        <FeedbackButton onClick={buttonProps.onClick}>
          {buttonProps.display}
        </FeedbackButton>
      )}
      {showForm && <FeedbackForm />}
      {feedbackSent && (
        <p className="mt-2 text-center text-[13px]">Email sent!</p>
      )} */}
    </>
  )
}

function FeedbackButton({ children, ShowAfterClick }) {
  const [showButton, setShowButton] = React.useState(true)
  const [showAfter, setShowAfter] = React.useState(false)

  function handleClick() {
    setShowButton(false)
    setShowAfter(true)
  }

  return (
    <>
      {showButton && (
        <button
          className="mt-2 w-max self-center text-center text-[13px] text-red-500"
          onClick={handleClick}>
          {children}
        </button>
      )}
      {showAfter && <ShowAfterClick />}
    </>
  )
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

function RequestProduct() {
  function ShowAfterClick() {
    return <p className="mt-2 text-center text-[13px]">Email sent!</p>
  }

  return (
    <FeedbackButton ShowAfterClick={ShowAfterClick}>
      Request Product
    </FeedbackButton>
  )
}

function ReportIssue({ onClick }) {
  function ShowAfterClick() {
    onClick()
    return <FeedbackForm />
  }

  return (
    <FeedbackButton ShowAfterClick={ShowAfterClick}>
      Request Product
    </FeedbackButton>
  )
}

/*

They both:
- start off showing a button (saying different things)
- when the button is clicked, they send an email
- when the email is sent, they show a message saying the email was sent

the difference is that one has a form that shows up after the email is sent to get more info, the other doesn't


*/
