import React, { useState } from 'react';

function HelpMail() {
  const [comment, setComment] = useState('');

  const sendEmail = async () => {
    const accessToken = 'YOUR_ACCESS_TOKEN'; // Replace with your actual access token

    const userId = 'me'; // 'me' represents the authenticated user

    const message = {
      raw: window.btoa(
        `From: YOUR_EMAIL\r\nTo: taskpro.project1@gmail.com\r\nSubject: Help Request\r\n\r\n${comment}`
      ),
    };

    try {
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        }
      );

      if (response.ok) {
        console.log('Email sent successfully!');
      } else {
        console.error(
          'Failed to send email:',
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <div>
      <h1>Send Help Request Email</h1>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Enter your help request here'
      />
      <button onClick={sendEmail}>Send Email</button>
    </div>
  );
}

export default HelpMail;
