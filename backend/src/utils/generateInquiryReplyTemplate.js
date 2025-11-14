function generateInquiryReplyTemplate(inquiry, replyMessage) {
    // inquiry = { first_name, last_name, email, company, message }
  
    const { first_name, last_name, company, message: originalMessage } = inquiry;
  
    // HTML version
    const html = `
      <p>Dear ${first_name} ${last_name},</p>
  
      <p>Thank you for contacting M3TechOps${company ? ` from ${company}` : ""}. Below is our reply to your inquiry:</p>
  
      <hr>
      <p><strong>Your original message:</strong></p>
      <blockquote style="border-left: 4px solid #ddd; padding-left: 10px; color: #555;">
        ${originalMessage}
      </blockquote>
  
      <p><strong>Our Reply:</strong></p>
      <p>${replyMessage}</p>
      <hr>
  
      <p>Best regards,</p>
      <p><strong>M3TechOps Team</strong></p>
      <p>www.m3techops.com</p>
    `;
  
    // Plain text version
    const text = `
  Dear ${first_name} ${last_name},
  
  Thank you for contacting M3TechOps${company ? ` from ${company}` : ""}. 
  
  Your original message:
  "${originalMessage}"
  
  Our Reply:
  "${replyMessage}"
  
  Best regards,
  M3TechOps Team
  www.m3techops.com
  `;
  
    return { html, text };
  }

  module.exports = {generateInquiryReplyTemplate}