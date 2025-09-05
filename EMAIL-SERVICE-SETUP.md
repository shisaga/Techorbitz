# Email Service Setup for TechXak Meeting Scheduler

## Overview
This implementation provides a fully functional email service for the TechXak meeting scheduler, including:
- Beautiful, responsive email templates that match the TechXak website theme
- Client confirmation emails with calendar invites
- Internal team notifications
- Professional branding and styling

## Features

### 🎨 Email Templates
- **Client Confirmation Email**: Professional confirmation with meeting details, Google Meet link, and calendar invite
- **Internal Notification**: Team notification with client information and meeting details
- **Calendar Integration**: ICS file attachment for easy calendar integration
- **Responsive Design**: Mobile-friendly email templates
- **Brand Consistency**: Matches TechXak website theme and colors

### 📧 Email Service
- **Resend Integration**: Modern, reliable email delivery service
- **Error Handling**: Graceful fallback if emails fail to send
- **Attachment Support**: Calendar invites (.ics files)
- **Multiple Recipients**: Client and internal team notifications

## Setup Instructions

### 1. Install Dependencies
```bash
npm install resend @react-email/components @react-email/render
```

### 2. Environment Configuration
Create a `.env.local` file in your project root with:

```env
# Email Service Configuration
RESEND_API_KEY=your_resend_api_key_here

# Other configurations...
```

### 3. Get Resend API Key
1. Sign up at [resend.com](https://resend.com)
2. Create a new API key
3. Add your domain for sending emails
4. Copy the API key to your `.env.local` file

### 4. Domain Verification
To send emails from `hello@techxak.com`:
1. Add your domain in Resend dashboard
2. Configure DNS records as instructed
3. Wait for verification (usually 24-48 hours)

## Email Templates

### Client Confirmation Email
- **Header**: TechXak branding with gradient background
- **Content**: Meeting details, Google Meet link, calendar invite
- **Features**: What to expect, rescheduling instructions
- **Footer**: Contact information and social links

### Internal Notification Email
- **Header**: Professional dark theme for internal use
- **Content**: Client information, meeting details, action items
- **Features**: Meeting ID, preparation checklist
- **Footer**: Automated system notification

### Calendar Integration
- **ICS File**: Standard calendar format
- **Reminders**: 15-minute advance notification
- **Details**: Complete meeting information
- **Compatibility**: Works with Google Calendar, Outlook, Apple Calendar

## API Endpoints

### POST /api/meeting/schedule
**Request Body:**
```json
{
  "date": "2024-01-15T00:00:00.000Z",
  "time": "14:00",
  "contactInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "company": "Example Corp",
    "message": "Project discussion"
  },
  "meetingType": "consultation"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Meeting scheduled successfully",
  "meeting": {
    "id": "uuid",
    "date": "2024-01-15T00:00:00.000Z",
    "time": "14:00",
    "meetingType": "consultation",
    "googleMeetLink": "https://meet.google.com/abc-defg-hij",
    "status": "scheduled"
  }
}
```

## Customization

### Colors and Branding
The email templates use TechXak brand colors:
- **Primary**: `#ff6b47` (Coral)
- **Secondary**: `#ff8a65` (Light Coral)
- **Background**: `#f8fafc` (Light Gray)
- **Text**: `#374151` (Dark Gray)

### Template Modifications
Edit `src/lib/email.ts` to customize:
- Email subjects
- Content structure
- Styling and colors
- Branding elements

### Email Content
Modify email content in the `emailTemplates` object:
- Meeting details format
- Company information
- Contact details
- Social media links

## Testing

### Local Development
1. Set up environment variables
2. Test API endpoint with Postman or similar tool
3. Check email delivery in Resend dashboard
4. Verify email templates render correctly

### Production Testing
1. Send test emails to real addresses
2. Verify calendar invites work
3. Check email deliverability
4. Test mobile responsiveness

## Troubleshooting

### Common Issues

**Emails not sending:**
- Check RESEND_API_KEY in environment
- Verify domain verification in Resend
- Check API rate limits

**Email delivery delays:**
- Resend typically delivers within seconds
- Check spam/junk folders
- Verify sender domain reputation

**Calendar invite issues:**
- Ensure ICS file format is correct
- Test with different email clients
- Verify timezone handling

### Debug Mode
Enable detailed logging by adding to your environment:
```env
DEBUG=resend:*
```

## Security Considerations

### Email Validation
- Input sanitization for email content
- Rate limiting for API endpoints
- Email address validation

### Data Protection
- Secure storage of meeting data
- GDPR compliance for email communications
- Secure API key management

## Performance Optimization

### Email Delivery
- Resend handles delivery optimization
- Automatic retry for failed deliveries
- Global CDN for fast delivery

### Template Rendering
- Pre-built HTML templates
- Minimal JavaScript dependencies
- Optimized for email clients

## Support

For technical support:
- Check Resend documentation
- Review email template best practices
- Test with multiple email clients
- Monitor delivery analytics

## Future Enhancements

### Planned Features
- Email templates in multiple languages
- Advanced calendar integration
- Meeting reminder emails
- Custom branding per client
- Email analytics and tracking

### Integration Opportunities
- CRM system integration
- Calendar API integration
- SMS notifications
- Slack/Teams notifications

