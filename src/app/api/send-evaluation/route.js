import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// --- HTML Email Template Function (Full implementation) ---
const generateEmailHtml = (data) => {
  // Escape string values to prevent basic HTML injection issues in the email content
  const escapeHtml = (str) =>
    str
      ? String(str)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;")
      : "";

  const htmlTemplate = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Weekly Task Evaluation</title>
  <style type="text/css">
    body { margin: 0; padding: 0; min-width: 100%; background-color: #f4f4f4; }
    table { border-collapse: collapse; }
    .content { width: 100%; max-width: 600px; }
    .table-cell { border: 1px solid #333333; padding: 10px; font-size: 14px; color: #333333; vertical-align: top; text-align: left;}
    .table-header { background-color: #e8e8e8; font-weight: bold; }
    .green-header { color: #16a34a; font-size: 20px; font-weight: bold; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
<center style="width: 100%; background-color: #f4f4f4;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f4f4f4">
    <tr>
      <td align="center" style="padding: 20px 0 30px 0;">
        <table class="content" align="center" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border: 1px solid #dddddd; border-radius: 8px;">
          
          <!-- Title Section -->
          <tr>
            <td align="center" style="padding: 20px 30px 10px 30px;">
              <p class="green-header">WEB79 ICT SOLUTIONS</p>
              <h1 style="color: #154360; font-weight: bold; font-size: 24px; line-height: 1.2; padding-bottom: 5px;">WEEKLY TASK COMPLETION AND EVALUATION REPORT</h1>
              <p style="font-size: 14px; color: #555555; margin-top: 10px;">Submitted by: ${escapeHtml(
                data.supervisorName
              )} (${escapeHtml(data.staffEmail)})</p> 
            </td>
          </tr>

          <!-- Data Table -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border: 1px solid #333333;">
                
                <!-- Metadata Row (Week and Supervisor) -->
                <tr>
                  <td class="table-header table-cell" width="30%">WEEK ENDING DATE:</td>
                  <td class="table-cell" width="70%">
                    <span style="font-weight: bold;">${escapeHtml(
                      data.weekEndingDate
                    )}</span>
                    <span style="float: right;">(Week: ${escapeHtml(
                      data.weekNumber
                    )})</span>
                  </td>
                </tr>
                <tr>
                  <td class="table-header table-cell">SUPERVISOR</td>
                  <td class="table-cell">${escapeHtml(data.supervisorName)}</td>
                </tr>

                <!-- Task Description -->
                <tr>
                  <td class="table-header table-cell" width="30%">TASK DESCRIPTION</td>
                  <td class="table-cell" width="70%" style="white-space: pre-wrap;">${escapeHtml(
                    data.taskDescription
                  )}</td>
                </tr>
                
                <!-- Start/End Date/Time -->
                <tr>
                  <td class="table-header table-cell">TASK DURATION</td>
                  <td class="table-cell">
                    Start: ${escapeHtml(data.taskStartDate)} at ${escapeHtml(
    data.taskStartTime || "N/A"
  )}<br/>
                    End: ${escapeHtml(data.taskEndDate)} at ${escapeHtml(
    data.taskEndTime || "N/A"
  )}
                  </td>
                </tr>

                <!-- Completion Status -->
                <tr>
                  <td class="table-header table-cell">WAS THE TASK SUCCESSFULLY COMPLETED?</td>
                  <td class="table-cell" style="font-weight: bold; color: ${
                    data.isCompleted === "Y" ? "#16a34a" : "#dc2626"
                  };">
                    ${data.isCompleted === "Y" ? "YES (Y)" : "NO (N)"}
                  </td>
                </tr>

                <!-- Method Used -->
                <tr>
                  <td class="table-header table-cell">METHOD USED</td>
                  <td class="table-cell" style="white-space: pre-wrap;">${escapeHtml(
                    data.methodUsed
                  )}</td>
                </tr>

                <!-- Problems Encountered -->
                <tr>
                  <td class="table-header table-cell">PROBLEMS ENCOUNTERED</td>
                  <td class="table-cell" style="white-space: pre-wrap;">${escapeHtml(
                    data.problemsEncountered
                  )}</td>
                </tr>
                
                <!-- Suggestion -->
                <tr>
                  <td class="table-header table-cell">SUGGESTION</td>
                  <td class="table-cell" style="white-space: pre-wrap;">${escapeHtml(
                    data.suggestion
                  )}</td>
                </tr>
                
                <!-- Supervisor's Comment -->
                <tr>
                  <td class="table-header table-cell">SUPERVISOR'S COMMENT/RECOMMENDATION:</td>
                  <td class="table-cell" style="white-space: pre-wrap;">${escapeHtml(
                    data.supervisorComment
                  )}</td>
                </tr>
                
                <!-- STATIC SEALS/COMMENTS -->
                <tr>
                  <td class="table-header table-cell">SUPERVISOR'S SEAL</td>
                  <td class="table-cell" style="height: 50px;">&nbsp;</td>
                </tr>
                <tr>
                  <td class="table-header table-cell">C.E.O.'S COMMENT:</td>
                  <td class="table-cell" style="height: 50px;">&nbsp;</td>
                </tr>
                <tr>
                  <td class="table-header table-cell">C.E.O.'S SEAL</td>
                  <td class="table-cell" style="height: 50px;">&nbsp;</td>
                </tr>

              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 10px 20px; font-size: 12px; color: #999999;">
              This report was submitted by ${escapeHtml(
                data.supervisorName
              )} (${escapeHtml(
    data.staffEmail
  )}) via the WEB79|SMI Admin Portal.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</center>
</body>
</html>
    `;
  return htmlTemplate;
};

// 2. Configure the Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 3. Define the POST handler function
export async function POST(request) {
  try {
    const formData = await request.json();

    // 💡 Validation: Check if the staff email (sender) is present
    if (
      !formData.supervisorComment ||
      !formData.supervisorName ||
      !formData.staffEmail
    ) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: Supervisor Name, Comment, or Staff Email.",
        },
        { status: 400 }
      );
    }

    // --- Define Company Recipient and Subject ---
    const companyRecipientEmail = "bol3xy@gmail.com"; // **CRITICAL: COMPANY MAILBOX**
    const staffEmail = formData.staffEmail;

    // 💡 SUBJECT CHANGE: Dynamic full name in the subject line for easy tracking
    const emailSubject = `Weekly Evaluation Report from ${
      formData.supervisorName
    } (Week ${formData.weekNumber || "N/A"})`;
    const emailHtml = generateEmailHtml(formData);

    // 4. Send the email (Only to the company, no BCC to staff)
    const mailOptions = {
      // Set the generic company sender email (must match EMAIL_USER)
      from: process.env.EMAIL_USER,
      // Send the main copy to the company mailbox
      to: companyRecipientEmail,
      // ❌ REMOVED: bcc: staffEmail (No copy to staff member)
      // Set the staff member's email as Reply-To
      replyTo: staffEmail,
      subject: emailSubject,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Evaluation email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email sending error:", error);

    return NextResponse.json(
      {
        message:
          "Failed to send evaluation email. Check your Nodemailer config and environment variables.",
      },
      { status: 500 }
    );
  }
}
