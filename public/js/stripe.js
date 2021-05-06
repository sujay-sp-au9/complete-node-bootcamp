import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51Ig5bASBTAJltG8gRBS94D8Sp9cXxNH8dfZDGxlrsUIJHpyOxezpj97DnNUzXBEjB0HkwdbTfJW6rjOpKXyBDvHE00TyUqfMlx'
);
export const bookTour = async (tourId) => {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
