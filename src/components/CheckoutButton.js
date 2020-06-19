import React from "react"
import { API } from "aws-amplify"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe("<PUBLIC_KEY>")

const CheckoutButton = () => {
  const redirectToCheckout = async () => {
    const fetchSession = async () => {
      const apiName = "stripeAPI"
      const apiEndpoint = "/checkout"
      const body = {
        quantity: 1,
        client_reference_id: "<UNIQUE_REF>",
        priceId: "<PRICE_ID>",
      }
      const session = await API.post(apiName, apiEndpoint, { body })
      return session
    }

    const session = await fetchSession()
    const sessionId = session.id
    const stripe = await stripePromise
    stripe.redirectToCheckout({ sessionId })
  }

  return <button onClick={redirectToCheckout}>Continue to payment</button>
}

export default CheckoutButton
