import React from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  ExpressCheckoutElement,
  LinkAuthenticationElement
} from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { getURL } from "@/utils/helpers";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();


  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent!.status) {
        case "succeeded":
          // setMessage("Payment succeeded!");
          break;
        case "processing":
          // setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          // setMessage("Your payment was not successful, please try again.");
          break;
        default:
          // setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        // return_url: "http://localhost:3000",
        return_url: getURL(),
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    // if (error.type === "card_error" || error.type === "validation_error") {
    //   setMessage(error.message);
    // } else {
    //   setMessage("An unexpected error occurred.");
    // }

    setIsLoading(false);
  };

  const options = {
    layout: "tabs" as const,
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement options={{defaultValues: {email: 'alanyao.training@gmail.com'}}} />
      {/* <ExpressCheckoutElement onConfirm={() => {}}/> */}
      <PaymentElement 
        id="payment-element" 
        options={{
          defaultValues: {
            billingDetails: {
              name: 'John Doe',
              // email: 'john@joih.com',
              phone: '888-888-8888',
              address: {
                postal_code: '10001',
                country: 'US',
              }
            },
          },
        }}
      />
      {/* <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{clientSecret: 'pi_1J2f6v2eZvKYlo2CQrZvZU7v_secret_6zqD2Dq5qXZ4e2wZ1CqZpZqZ'}}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider> */}
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}