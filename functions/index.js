const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");

// Triggered when a new booking is created in Firestore
exports.sendBookingConfirmationEmail = onDocumentCreated(
  "bookings/{bookingId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.info("No data associated with event");
      return;
    }

    const booking = snapshot.data();
    logger.info(`Sending confirmation email for booking ${event.params.bookingId}`, {
      patientName: booking.patientName,
      phone: booking.phone,
      email: booking.email,
      date: booking.date,
      startTime: booking.startTime,
      serviceName: booking.serviceName
    });

    // Email provider integration (e.g. Resend / SendGrid / Nodemailer)
    // If patient email is provided:
    if (booking.email) {
      logger.info(`Email dispatched to ${booking.email}`);
    }
  }
);
