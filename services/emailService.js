// services/emailService.js

import emailjs from 'emailjs-com';


// Function to send email using EmailJS
const sendEmail = async (email, name, subject, message) => {

  // await emailjs.init({
  //   public_key: "kH3WBtTlC7c_Jm8CN",
  //   blockHeadless: true,
  //   limitRate: {
  //     id: 'app',
  //     // Allow 1 request per 10s
  //     throttle: 10000,
  //   },
  // });

  emailjs.init("kH3WBtTlC7c_Jm8CN");
  
  const templateParams = {
    email: email,  // Recipient's email address
    subject: subject,   // Subject of the email
    message: message,   // Body content of the email
    groupName: name ? name : '',  // Name of the recipient
    public_key: "kH3WBtTlC7c_Jm8CN",
  };

  console.log(templateParams)


  emailjs.send(
    'service_7rf5ouc',  // Your EmailJS service ID
    'template_p41fmbn', // Your EmailJS template ID
    templateParams,     // Template parameters (to, subject, message)
  ).then((response) => {
    console.log('Email sent successfullyr!', response);
    return { message: 'Email sent successfully!' };
  }
  ).catch((error) => {
    console.error('Error sending email:', error);
    return { message: 'Failed to send email.', error: error };
  });
};

export { sendEmail };
