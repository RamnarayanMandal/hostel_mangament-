// SMS Service for sending OTP verification
// This is a mock implementation. In production, you would integrate with services like:
// - Twilio
// - AWS SNS
// - MessageBird
// - Vonage (formerly Nexmo)

export class SmsService {
  constructor() {
    // Initialize SMS service configuration
    // In production, you would configure your SMS provider here
  }

  // Send verification SMS
  async sendVerificationSMS(phoneNumber: string, otp: string): Promise<void> {
    try {
      // In production, this would send an actual SMS
      // For now, we'll just log the OTP for development purposes
      console.log(`SMS OTP for ${phoneNumber}: ${otp}`);
      
      // Example Twilio implementation (uncomment and configure for production):
      /*
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = require('twilio')(accountSid, authToken);

      await client.messages.create({
        body: `Your Hotel Management System verification code is: ${otp}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
      */

      // Example AWS SNS implementation (uncomment and configure for production):
      /*
      const AWS = require('aws-sdk');
      const sns = new AWS.SNS({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      });

      await sns.publish({
        Message: `Your Hotel Management System verification code is: ${otp}. Valid for 10 minutes.`,
        PhoneNumber: phoneNumber
      }).promise();
      */

    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new Error('Failed to send SMS verification');
    }
  }

  // Send welcome SMS
  async sendWelcomeSMS(phoneNumber: string, firstName: string): Promise<void> {
    try {
      console.log(`Welcome SMS for ${phoneNumber}: Welcome ${firstName} to Hotel Management System!`);
      
      // Production SMS implementation would go here
      
    } catch (error) {
      console.error('Error sending welcome SMS:', error);
      // Don't throw error for welcome SMS as it's not critical
    }
  }

  // Send booking confirmation SMS
  async sendBookingConfirmationSMS(phoneNumber: string, bookingId: string, hotelName: string, checkInDate: string): Promise<void> {
    try {
      console.log(`Booking confirmation SMS for ${phoneNumber}: Booking ${bookingId} confirmed at ${hotelName} for ${checkInDate}`);
      
      // Production SMS implementation would go here
      
    } catch (error) {
      console.error('Error sending booking confirmation SMS:', error);
      // Don't throw error for booking confirmation SMS as it's not critical
    }
  }

  // Validate phone number format
  validatePhoneNumber(phoneNumber: string): boolean {
    // Basic validation for Indian phone numbers
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  }

  // Format phone number for SMS
  formatPhoneNumber(phoneNumber: string): string {
    // Add country code if not present
    if (!phoneNumber.startsWith('+91')) {
      return `+91${phoneNumber}`;
    }
    return phoneNumber;
  }
} 