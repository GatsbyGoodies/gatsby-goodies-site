import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <div className="logo">gatsby goodies</div>
    <div className="headline">
      Premium Gatsby themes to kickstart your blog, portfolio, or e-commerce
      store.
    </div>
    <div className="signup">
      <div className="signup__tagline">
        Sign up to get notified when it's ready
      </div>
      <form className="form">
        <input type="email" name="email" placeholder="youremail@email.com" />
        <button>Get Notified</button>
      </form>
    </div>
  </Layout>
)

export default IndexPage
