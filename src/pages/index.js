import React, { useState } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => {
  const [email, setEmail] = useState("")
  const handleChange = e => setEmail(e.target.value)
  const subscribe = async e => {
    e.preventDefault()
    try {
      const customer = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { email },
      })
      const json = await customer.json()
      console.log(json)
    } catch (err) {
      console.log("Error processing request", err)
    }
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
        <div className="signup__tagline">
          Sign up to get notified when it's ready
        </div>
        <form className="form">
          <input
            onChange={handleChange}
            value={email}
            type="email"
            name="email"
            placeholder="youremail@email.com"
          />
          <button onClick={subscribe}>Get Notified</button>
        </form>
      </div>
    </Layout>
  )
}

export default IndexPage
