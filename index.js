require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-email", async (req, res) => {
	try {
		const { name, email, message } = req.body;
		console.log("Received request:", req.body);

		// Create transporter
		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT),
			secure: process.env.SMTP_PORT == "465", // true for 465, false for other ports
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});

		// Verify transporter connection
		await transporter.verify();
		console.log("SMTP Connection verified!");

		// Mail options
		const mailOptions = {
			from: `"Spartrack System" <${process.env.SMTP_FROM}>`,
			to: process.env.SMTP_USER, // your receiving email
			replyTo: email,
			subject: `📩 Message from ${name}`,
			text: message,
		};

		// Send email
		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent info:", info);

		res
			.status(200)
			.json({ success: true, message: "✅ Email sent successfully!" });
	} catch (error) {
		console.error("Email sending error:", error);
		res
			.status(500)
			.json({
				success: false,
				message: "❌ Failed to send email.",
				error: error.message,
			});
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
