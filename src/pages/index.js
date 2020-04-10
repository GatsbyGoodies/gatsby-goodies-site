import React, { useState } from "react"
import Amplify, { API } from "aws-amplify"

import Layout from "../components/layout"
import SEO from "../components/seo"
import awsconfig from "../aws-exports"

Amplify.configure(awsconfig)

const feedbackMap = {
  DEFAULT: {
    message: "Sign up to get notified when it's ready",
    className: "feedback",
  },
  SUCCESS: {
    message: "Thanks for subscribing!",
    className: "feedback feedback--success",
  },
  INVALID_EMAIL: {
    message: "That email address is already subscribed",
    className: "feedback feedback--error",
  },
  EMAIL_EXISTS: {
    message: "That email address is already subscribed",
    className: "feedback feedback--error",
  },
  ERROR: {
    message:
      "There was an error subscribing. Refresh the page or try again later",
    className: "feedback feedback--error",
  },
}

const IndexPage = () => {
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState("DEFAULT")
  const [email, setEmail] = useState("")
  const handleChange = e => setEmail(e.target.value)
  const subscribe = e => {
    e.preventDefault()
    setLoading(true)
    API.post("api", "/subscribe", {
      body: { email },
    })
      .then(res => {
        setLoading(false)
        setFeedback(res.type)
      })
      .catch(err => {
        setLoading(false)
        setFeedback(err.type)
      })
  }
  return (
    <Layout>
      <SEO title="Home" />
      <div className="logo">gatsby goodies</div>
      <div className="headline">
        Premium Gatsby themes to kickstart your blog, portfolio, or online
        store.
      </div>
      <div className="signup">
        <div className={feedbackMap[feedback].className}>
          {feedbackMap[feedback].message}
        </div>
        <form className="form">
          <input
            onChange={handleChange}
            value={email}
            type="email"
            name="email"
            placeholder="youremail@email.com"
          />
          <div className="button" role="button" onClick={subscribe}>
            <span style={{ opacity: loading ? 0 : 1 }}>Get Notified</span>
            <div style={{ opacity: loading ? 1 : 0 }} className="loader"></div>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default IndexPage
