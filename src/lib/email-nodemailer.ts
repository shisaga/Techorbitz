import nodemailer from 'nodemailer';

// Email configuration using your TechXak credentials
const emailConfig = {
  host: 'smtp.hostinger.com', // Hostinger SMTP server
  port: 587, // Standard SMTP port
  secure: false, // TLS
  auth: {
    user: process.env.TECHXAK_EMAIL || 'hello@techxak.com',
    pass: process.env.TECHXAK_EMAIL_PASSWORD || 'Bitirani@123'
  },
  tls: {
    rejectUnauthorized: false
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email templates with TechXak branding
export const emailTemplates = {
  // Client confirmation email
  clientConfirmation: (meetingData: any) => ({
    subject: `🎉 Meeting Confirmed - TechXak Consultation`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meeting Confirmed - TechXak</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 0; 
            background-color: #f8fafc;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #ff6b47 0%, #ff8a65 100%); 
            padding: 40px 30px; 
            text-align: center; 
            color: white;
          }
          .logo { 
            font-size: 28px; 
            font-weight: bold; 
            margin-bottom: 10px;
          }
          .subtitle { 
            font-size: 16px; 
            opacity: 0.9;
          }
          .content { 
            padding: 40px 30px; 
            color: #374151;
          }
          .meeting-card { 
            background: linear-gradient(135deg, #fff5f2 0%, #f0f9ff 100%); 
            border: 2px solid #ff6b47; 
            border-radius: 12px; 
            padding: 24px; 
            margin: 24px 0;
          }
          .meeting-detail { 
            display: flex; 
            align-items: center; 
            margin: 12px 0; 
            font-size: 16px;
          }
          .meeting-detail .icon { 
            width: 20px; 
            margin-right: 12px; 
            color: #ff6b47;
          }
          .cta-button { 
            display: inline-block; 
            background: #ff6b47; 
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 12px; 
            font-weight: 600; 
            margin: 24px 0; 
            transition: background 0.3s;
          }
          .cta-button:hover { 
            background: #e55a3d;
          }
          .footer { 
            background: #f9fafb; 
            padding: 24px 30px; 
            text-align: center; 
            color: #6b7280; 
            font-size: 14px;
          }
          .social-links { 
            margin: 16px 0;
          }
          .social-links a { 
            color: #ff6b47; 
            text-decoration: none; 
            margin: 0 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🚀 TechXak</div>
            <div class="subtitle">Leading Technology Solutions & Development Partner</div>
          </div>
          
          <div class="content">
            <h1 style="color: #111827; margin-bottom: 24px;">Meeting Confirmed! 🎉</h1>
            
            <p style="font-size: 18px; line-height: 1.6; margin-bottom: 24px;">
              Hi <strong>${meetingData.contactInfo.name}</strong>,
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Your consultation with TechXak has been scheduled successfully. We're excited to discuss your project and provide expert insights!
            </p>
            
            <div class="meeting-card">
              <h2 style="color: #ff6b47; margin-top: 0; margin-bottom: 20px;">📅 Meeting Details</h2>
              
              <div class="meeting-detail">
                <span class="icon">📅</span>
                <strong>Date:</strong> ${new Date(meetingData.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              
              <div class="meeting-detail">
                <span class="icon">🕐</span>
                <strong>Time:</strong> ${meetingData.time}
              </div>
              
              <div class="meeting-detail">
                <span class="icon">💬</span>
                <strong>Type:</strong> ${meetingData.meetingType}
              </div>
              
              <div class="meeting-detail">
                <span class="icon">🌐</span>
                <strong>Platform:</strong> Google Meet
              </div>
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${meetingData.googleMeetLink}" class="cta-button">
                🚀 Join Meeting
              </a>
            </div>
            
            <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
              <h3 style="margin-top: 0; color: #1e40af;">💡 What to Expect</h3>
              <ul style="margin: 8px 0; padding-left: 20px;">
                <li>30-60 minute focused consultation</li>
                <li>Project requirements discussion</li>
                <li>Technical architecture review</li>
                <li>Cost estimation and timeline</li>
                <li>Next steps and recommendations</li>
              </ul>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              <strong>Need to reschedule?</strong> Please contact us at least 24 hours in advance at 
              <a href="mailto:hello@techxak.com" style="color: #ff6b47;">hello@techxak.com</a>
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              We look forward to helping you bring your vision to life!
            </p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Best regards,<br>
              <strong>The TechXak Team</strong><br>
              <span style="color: #6b7280;">Fortune 500 Technology Partner</span>
            </p>
          </div>
          
          <div class="footer">
            <div class="social-links">
              <a href="https://techxak.com">🌐 Website</a> |
              <a href="mailto:hello@techxak.com">📧 Email</a> |
              <a href="tel:+1-555-0123">📞 Phone</a>
            </div>
            <p>© 2024 TechXak. All rights reserved.</p>
            <p>Working with Google, Apple, McDonald's and Fortune 500 companies</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Internal notification email
  internalNotification: (meetingData: any) => ({
    subject: `📅 New Meeting Scheduled - ${meetingData.contactInfo.name}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Meeting - TechXak</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 0; 
            background-color: #f8fafc;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #1f2937 0%, #374151 100%); 
            padding: 40px 30px; 
            text-align: center; 
            color: white;
          }
          .logo { 
            font-size: 28px; 
            font-weight: bold; 
            margin-bottom: 10px;
          }
          .subtitle { 
            font-size: 16px; 
            opacity: 0.9;
          }
          .content { 
            padding: 40px 30px; 
            color: #374151;
          }
          .info-card { 
            background: #f3f4f6; 
            border-radius: 12px; 
            padding: 24px; 
            margin: 24px 0;
          }
          .meeting-card { 
            background: linear-gradient(135deg, #fff5f2 0%, #f0f9ff 100%); 
            border: 2px solid #ff6b47; 
            border-radius: 12px; 
            padding: 24px; 
            margin: 24px 0;
          }
          .info-row { 
            display: flex; 
            justify-content: space-between; 
            margin: 12px 0; 
            padding: 8px 0; 
            border-bottom: 1px solid #e5e7eb;
          }
          .info-row:last-child { 
            border-bottom: none;
          }
          .label { 
            font-weight: 600; 
            color: #374151;
          }
          .value { 
            color: #6b7280;
          }
          .cta-button { 
            display: inline-block; 
            background: #ff6b47; 
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 12px; 
            font-weight: 600; 
            margin: 24px 0; 
            transition: background 0.3s;
          }
          .cta-button:hover { 
            background: #e55a3d;
          }
          .footer { 
            background: #f9fafb; 
            padding: 24px 30px; 
            text-align: center; 
            color: #6b7280; 
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🚀 TechXak</div>
            <div class="subtitle">Internal Meeting Notification</div>
          </div>
          
          <div class="content">
            <h1 style="color: #111827; margin-bottom: 24px;">New Meeting Scheduled 📅</h1>
            
            <p style="font-size: 18px; line-height: 1.6; margin-bottom: 24px;">
              A new consultation meeting has been scheduled with a potential client. Please review the details below and prepare accordingly.
            </p>
            
            <div class="info-card">
              <h2 style="color: #374151; margin-top: 0; margin-bottom: 20px;">👤 Client Information</h2>
              
              <div class="info-row">
                <span class="label">Name:</span>
                <span class="value">${meetingData.contactInfo.name}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">${meetingData.contactInfo.email}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Phone:</span>
                <span class="value">${meetingData.contactInfo.phone || 'Not provided'}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Company:</span>
                <span class="value">${meetingData.contactInfo.company || 'Not provided'}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Message:</span>
                <span class="value">${meetingData.contactInfo.message || 'No message'}</span>
              </div>
            </div>
            
            <div class="meeting-card">
              <h2 style="color: #ff6b47; margin-top: 0; margin-bottom: 20px;">📅 Meeting Details</h2>
              
              <div class="info-row">
                <span class="label">Date:</span>
                <span class="value">${new Date(meetingData.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Time:</span>
                <span class="value">${meetingData.time}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Type:</span>
                <span class="value">${meetingData.meetingType}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Google Meet:</span>
                <span class="value">${meetingData.googleMeetLink}</span>
              </div>
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${meetingData.googleMeetLink}" class="cta-button">
                📅 Add to Calendar
              </a>
            </div>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin: 24px 0;">
              <h3 style="margin-top: 0; color: #92400e;">⚠️ Action Required</h3>
              <ul style="margin: 8px 0; padding-left: 20px;">
                <li>Add meeting to your calendar</li>
                <li>Review client information and requirements</li>
                <li>Prepare consultation materials</li>
                <li>Test Google Meet link before the meeting</li>
                <li>Follow up with client 24 hours before</li>
              </ul>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              <strong>Meeting ID:</strong> ${meetingData.id}
            </p>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from the TechXak meeting system.</p>
            <p>© 2024 TechXak. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Calendar invite (ICS format)
  generateCalendarInvite: (meetingData: any) => {
    const startDate = new Date(meetingData.date);
    const [hours, minutes] = meetingData.time.split(':').map(Number);
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TechXak//Meeting Scheduler//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:${meetingData.id}@techxak.com`,
      `DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `SUMMARY:TechXak Consultation - ${meetingData.meetingType}`,
      `DESCRIPTION:Meeting with ${meetingData.contactInfo.name} (${meetingData.contactInfo.email})\\n\\nGoogle Meet: ${meetingData.googleMeetLink}\\n\\nType: ${meetingData.meetingType}\\n\\nMessage: ${meetingData.contactInfo.message || 'No message'}`,
      `LOCATION:${meetingData.googleMeetLink}`,
      `ORGANIZER;CN=TechXak Team:mailto:hello@techxak.com`,
      `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${meetingData.contactInfo.name}:mailto:${meetingData.contactInfo.email}`,
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      'DESCRIPTION:TechXak Meeting Reminder',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    return icsContent;
  }
};

// Email sending functions using Nodemailer
export const emailService = {
  // Test email connection
  async testConnection() {
    try {
      await transporter.verify();
      console.log('✅ Email connection verified successfully');
      return true;
    } catch (error) {
      console.error('❌ Email connection failed:', error);
      return false;
    }
  },

  // Send meeting confirmation to client
  async sendClientConfirmation(meetingData: any) {
    try {
      const { subject, html } = emailTemplates.clientConfirmation(meetingData);
      
      const mailOptions = {
        from: `"TechXak" <${process.env.TECHXAK_EMAIL || 'hello@techxak.com'}>`,
        to: meetingData.contactInfo.email,
        subject,
        html,
        attachments: [
          {
            filename: 'meeting-invite.ics',
            content: emailTemplates.generateCalendarInvite(meetingData),
            contentType: 'text/calendar'
          }
        ]
      };
      
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Client confirmation email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Error sending client confirmation email:', error);
      throw error;
    }
  },

  // Send internal notification
  async sendInternalNotification(meetingData: any) {
    try {
      const { subject, html } = emailTemplates.internalNotification(meetingData);
      
      const mailOptions = {
        from: `"TechXak Meeting System" <${process.env.TECHXAK_EMAIL || 'hello@techxak.com'}>`,
        to: [process.env.TECHXAK_EMAIL || 'hello@techxak.com'],
        subject,
        html
      };
      
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Internal notification email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Error sending internal notification email:', error);
      throw error;
    }
  },

  // Send both emails
  async sendMeetingEmails(meetingData: any) {
    try {
      const [clientResult, internalResult] = await Promise.all([
        this.sendClientConfirmation(meetingData),
        this.sendInternalNotification(meetingData)
      ]);
      
      return {
        clientEmail: clientResult,
        internalEmail: internalResult
      };
    } catch (error) {
      console.error('❌ Error sending meeting emails:', error);
      throw error;
    }
  }
};

