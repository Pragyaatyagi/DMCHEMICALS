const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// Manually load .env.local in local development if needed
if (!process.env.GMAIL_USER) {
    try {
        const envPath = path.resolve(process.cwd(), ".env.local");
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, "utf-8");
            envConfig.split("\n").forEach(line => {
                const trimmedLine = line.trim();
                if (trimmedLine && !trimmedLine.startsWith("#")) {
                    const parts = trimmedLine.split("=");
                    if (parts.length >= 2) {
                        const key = parts[0].trim();
                        const value = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
                        process.env[key] = value;
                    }
                }
            });
        }
    } catch (e) {
        console.error("Failed to load .env.local manually:", e);
    }
}

module.exports = async function handler(req, res) {

    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { name, email, phone, product, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }

        // Gmail transporter using App Password
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        await transporter.sendMail({
            from: `"DM Chemicals Website" <${process.env.GMAIL_USER}>`,
          to: "dmchemicals77@gmail.com",
            subject: `New Enquiry from ${name} - DM Chemicals Website`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">

                    <div style="background: #082447; padding: 25px 30px;">
                        <h2 style="color: white; margin: 0; font-size: 22px;">&#128232; New Customer Enquiry</h2>
                        <p style="color: #f47721; margin: 5px 0 0; font-size: 13px;">Received from DM Chemicals Website</p>
                    </div>

                    <div style="padding: 30px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; width: 120px; color: #082447; font-weight: bold;">Name</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #082447; font-weight: bold;">Email</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">${email}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #082447; font-weight: bold;">Phone</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">${phone || "Not provided"}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #082447; font-weight: bold;">Product</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">${product || "Not selected"}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; vertical-align: top; color: #082447; font-weight: bold;">Message</td>
                                <td style="padding: 12px 0; color: #333; line-height: 1.6;">${message}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="background: #f5f7f9; padding: 15px 30px; text-align: center;">
                        <p style="margin: 0; color: #888; font-size: 12px;">
                            Sent automatically from the DM Chemicals website contact form.
                        </p>
                    </div>

                </div>
            `
        });

        return res.status(200).json({
            success: true,
            message: "Enquiry sent successfully!"
        });

    } catch (error) {
        console.error("Nodemailer error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
};
