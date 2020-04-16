import React, { useState, useRef } from 'react'
import Amplify, { API } from 'aws-amplify'
import { Form } from 'informed'

import Layout from '../components/layout'
import TextField from '../components/TextField'
import SEO from '../components/seo'
import awsconfig from '../aws-exports'
import feedbackMap from '../data/feedbackMap'
import emailField from '../data/emailField'

Amplify.configure(awsconfig)

const IndexPage = () => {
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('DEFAULT')
  const formApi = useRef()

  const subscribe = async () => {
    const formState = formApi.current.getState()
    const { email } = formState.values

    const data = { body: { email } }

    try {
      setLoading(true)
      const res = await API.post('api', '/subscribe', data)
      setLoading(false)
      setFeedback(res.type)
    } catch (error) {
      setLoading(false)
      setFeedback(error.type)
    }
  }

  return (
    <Layout>
      <SEO title='Home' />
      <div className='logo'>gatsby goodies</div>
      <h1 className='headline'>
        Premium Gatsby themes to kickstart your blog, portfolio, or online
        store.
      </h1>
      <div className='signup'>
        <div className={feedbackMap[feedback].className}>
          {feedbackMap[feedback].message}
        </div>
        <Form className='form' onSubmit={subscribe} apiRef={formApi}>
          <TextField {...emailField} />
          <button className='button'>
            <span style={{ opacity: loading ? 0 : 1 }}>Get Notified</span>
            <div style={{ opacity: loading ? 1 : 0 }} className='loader'></div>
          </button>
        </Form>
      </div>
    </Layout>
  )
}

export default IndexPage
