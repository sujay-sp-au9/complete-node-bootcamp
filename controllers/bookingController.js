const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/userModel');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const createBookingCheckout = catchAsync(async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email }))._id;
  const price = session.amount_total / 100;
  await Booking.create({ tour, user, price });
});

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tour,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
        ],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });
  res.status(200).json({ status: 'success', session });
});

exports.createBooking = factory.createDocument(Booking);
exports.getBooking = factory.getDocument(Booking);
exports.getAllBookings = factory.getDocument(Booking);
exports.updateBooking = factory.updateDocument(Booking);
exports.deleteBooking = factory.deleteDocument(Booking);

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook-error: ${err.message}`);
  }
  if (stripeEvent.type === 'checkout.session.completed') {
    createBookingCheckout(stripeEvent.data.object);
  }
  res.status(200).json({ received: true });
};
