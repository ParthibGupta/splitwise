// services/emailService.js

import emailjs from 'emailjs-com';

// Function to send email using EmailJS
const sendEmail = async (toEmail, subject, message) => {
  try {
    const templateParams = {
      to_email: toEmail,  // Recipient's email address
      subject: subject,   // Subject of the email
      message: message,   // Body content of the email
    };

    const response = await emailjs.send(
      'service_7rf5ouc',  // Your EmailJS service ID
      'template_p41fmbn', // Your EmailJS template ID
      templateParams,     // Template parameters (to, subject, message)
      'kH3WBtTlC7c_Jm8CN'      // Your EmailJS user ID
    );
    
    console.log('Email sent successfully!', response);
    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email.' };
  }
};

export { sendEmail };
