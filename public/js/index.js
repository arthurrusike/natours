const stripe = Stripe(
  'pk_test_51O2VXBLoSTzLBRfQysaqzJ2gS5wgrg82IsZY4aTqq4DFMGFE23zBcFsdg501ESfjUNX2qksyJbyW2PIvLs7alhkS00UipBqPND',
);
const bookBtn = document.getElementById('book-tour');

const bookTour = async (tourId) => {
  try {
    // 1. Get checkout Session from the API

    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`,
    );
    

    //2. Create Checkout form + charge credit card
    window.location.replace(session.data.session.url)
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id,
    // });
  } catch (error) {
   
  }
};

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing....';
    const tourId = e.target.dataset.tourId;
    bookTour(tourId);
  });
}
