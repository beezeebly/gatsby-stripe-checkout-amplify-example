import React from "react"

import Layout from "../components/layout"
import CheckoutButton from "../components/CheckoutButton"

const CheckoutPage = () => {
  return (
    <Layout>
      <h1>Pro Plan</h1>
      <p>$12/month</p>
      <CheckoutButton />
    </Layout>
  )
}

export default CheckoutPage
