import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const meetingData = await request.json();
    const { date, time, contactInfo, meetingType } = meetingData;
    
    // Generate Google Meet link
    const meetingId = uuidv4();
    const googleMeetLink = `https://meet.google.com/${meetingId.replace(/-/g, '').substring(0, 12)}`;
    
    // Create meeting object
    const meeting = {
      id: meetingId,
      date: new Date(date),
      time,
      meetingType,
      contactInfo,
      googleMeetLink,
      status: 'scheduled',
      createdAt: new Date()
    };
    
    // TODO: Save to database
    // await prisma.meeting.create({ data: meeting });
    
    // TODO: Send email notifications
    await sendMeetingEmails(meeting);
    
    return NextResponse.json({
      success: true,
      meeting: {
        ...meeting,
        googleMeetLink
      }
    });

  } catch (error) {
    console.error('Error scheduling meeting:', error);
    return NextResponse.json(
      { error: 'Failed to schedule meeting' },
      { status: 500 }
    );
  }
}

async function sendMeetingEmails(meeting: any) {
  // TODO: Implement actual email sending
  console.log('Sending meeting emails:', {
            to: [meeting.contactInfo.email, 'hello@techonigx.com'],
    subject: `Meeting Scheduled - ${meeting.contactInfo.name}`,
    meetingLink: meeting.googleMeetLink,
    date: meeting.date,
    time: meeting.time
  });

  // Email template for client
  const clientEmailTemplate = `
    <h2>Meeting Confirmed! 🎉</h2>
    <p>Hi ${meeting.contactInfo.name},</p>
            <p>Your meeting with TechOnigx has been scheduled successfully.</p>
    
    <div style="background: #ffe5e0; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h3>Meeting Details:</h3>
      <p><strong>Date:</strong> ${meeting.date.toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${meeting.time}</p>
      <p><strong>Type:</strong> ${meeting.meetingType}</p>
      <p><strong>Google Meet:</strong> <a href="${meeting.googleMeetLink}">${meeting.googleMeetLink}</a></p>
    </div>
    
    <p>We look forward to discussing your project!</p>
            <p>Best regards,<br>TechOnigx Team</p>
  `;

  // Email template for internal team
  const internalEmailTemplate = `
    <h2>New Meeting Scheduled 📅</h2>
    <p>A new meeting has been scheduled with a potential client.</p>
    
    <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h3>Client Information:</h3>
      <p><strong>Name:</strong> ${meeting.contactInfo.name}</p>
      <p><strong>Email:</strong> ${meeting.contactInfo.email}</p>
      <p><strong>Company:</strong> ${meeting.contactInfo.company || 'Not provided'}</p>
      <p><strong>Phone:</strong> ${meeting.contactInfo.phone || 'Not provided'}</p>
      <p><strong>Message:</strong> ${meeting.contactInfo.message || 'No message'}</p>
    </div>
    
    <div style="background: #ffe5e0; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h3>Meeting Details:</h3>
      <p><strong>Date:</strong> ${meeting.date.toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${meeting.time}</p>
      <p><strong>Type:</strong> ${meeting.meetingType}</p>
      <p><strong>Google Meet:</strong> <a href="${meeting.googleMeetLink}">${meeting.googleMeetLink}</a></p>
    </div>
    
    <p>Please prepare for the consultation and add this to your calendar.</p>
  `;

  return {
    clientEmail: clientEmailTemplate,
    internalEmail: internalEmailTemplate
  };
}
