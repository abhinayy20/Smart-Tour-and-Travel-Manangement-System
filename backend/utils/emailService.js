const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (email, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

const bookingConfirmationEmail = (booking, user, packageDetails) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px; }
                .content { margin: 20px 0; }
                .footer { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-top: 20px; }
                .button { background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Booking Confirmation!</h1>
                    <p>Thank you for booking with TravelSphere</p>
                </div>
                <div class="content">
                    <h2>Booking Details</h2>
                    <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
                    <p><strong>Package:</strong> ${packageDetails.name}</p>
                    <p><strong>Departure Date:</strong> ${new Date(booking.departureDate).toLocaleDateString()}</p>
                    <p><strong>Number of Travelers:</strong> ${booking.numberOfTravelers}</p>
                    <p><strong>Total Price:</strong> ₹${booking.totalPrice}</p>
                    <p><strong>Status:</strong> ${booking.status}</p>
                    <p><strong>Payment Status:</strong> ${booking.paymentStatus}</p>
                </div>
                <div class="footer">
                    <p>For any queries, contact: support@travelsphere.com</p>
                    <p>© 2026 TravelSphere. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

const paymentConfirmationEmail = (user, booking, packageDetails) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .success { background: #4caf50; color: white; padding: 20px; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="success">
                    <h1>Payment Successful!</h1>
                    <p>Your booking is now confirmed.</p>
                </div>
                <div style="margin: 20px 0;">
                    <h2>Payment Details</h2>
                    <p><strong>Amount:</strong> ₹${booking.totalPrice}</p>
                    <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
                    <p><strong>Package:</strong> ${packageDetails.name}</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

module.exports = { sendEmail, bookingConfirmationEmail, paymentConfirmationEmail };
