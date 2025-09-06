import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { emailService } from '@/lib/email-nodemailer';
import { googleMeetService } from '@/lib/google-meet-simple';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const meetingData = await request.json();
    const { date, time, contactInfo, meetingType } = meetingData;
    
    // Generate meeting ID
    const meetingId = uuidv4();
    
    // Create Google Meet link using the service
    const meetResult = await googleMeetService.createMeeting({
      title: `TechXak ${meetingType} - ${contactInfo.name}`,
      description: `Meeting with ${contactInfo.name} (${contactInfo.email}) - ${contactInfo.message || 'No message'}`,
      startTime: new Date(date).toISOString(),
      endTime: new Date(new Date(date).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour later
      attendees: [contactInfo.email, 'hello@techxak.com'],
    });

    // Use the Google Meet link from the service
    const googleMeetLink = meetResult.meetingLink || `https://meet.google.com/fallback-${meetingId.substring(0, 8)}`;
    const meetingCode = meetResult.meetingCode || meetingId.substring(0, 8);
    
    // Save to database
    const savedMeeting = await prisma.meeting.create({
      data: {
        meetingId: meetingId,
        title: `TechXak ${meetingType} - ${contactInfo.name}`,
        description: `Meeting with ${contactInfo.name} (${contactInfo.email}) - ${contactInfo.message || 'No message'}`,
        meetingType: meetingType,
        scheduledDate: new Date(date),
        scheduledTime: time,
        duration: 60, // Default 1 hour
        contactName: contactInfo.name,
        contactEmail: contactInfo.email,
        contactPhone: contactInfo.phone || null,
        message: contactInfo.message || null,
        googleMeetLink: googleMeetLink,
        meetingCode: meetingCode,
        googleMeetId: meetResult.meetingId || null,
        status: 'SCHEDULED',
        emailSentToClient: false,
        emailSentToAdmin: false,
      }
    });

    // Create meeting object for email service
    const meeting = {
      id: meetingId,
      date: new Date(date),
      time,
      meetingType,
      contactInfo,
      googleMeetLink,
      meetingCode,
      status: 'scheduled',
      createdAt: new Date(),
      googleMeetData: meetResult
    };
    
    console.log('🔍 Meeting object created for email service:', {
      id: meeting.id,
      date: meeting.date,
      time: meeting.time,
      contactInfo: meeting.contactInfo,
      googleMeetLink: meeting.googleMeetLink
    });
    
    // Send email notifications
    try {
      console.log('🔍 Attempting to send meeting emails...');
      console.log('Meeting data:', JSON.stringify(meeting, null, 2));
      await emailService.sendMeetingEmails(meeting);
      console.log('✅ Meeting emails sent successfully');
      
      // Update email tracking in database
      await prisma.meeting.update({
        where: { id: savedMeeting.id },
        data: {
          emailSentToClient: true,
          emailSentToAdmin: true,
        }
      });
    } catch (emailError) {
      console.error('❌ Failed to send meeting emails:', emailError);
      // Continue with the response even if email fails
    }
    
    return NextResponse.json({
      success: true,
      meeting: {
        ...meeting,
        googleMeetLink,
        databaseId: savedMeeting.id
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

