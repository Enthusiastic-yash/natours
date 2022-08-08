/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51LTo1uSInsgHdQKhBuDVHbHK5E0aZeSUk3AiILMxJ3u7UG5W7mxH4xwY8xwQeRSVPlS4UGC7tV5LZRu7fBgIsJLl00Gjrt7Z5z'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
