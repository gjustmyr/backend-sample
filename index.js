require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

require("dotenv").config();

// ✅ Email route
app.post("/send-email", async (req, res) => {
	try {
		const { name, email, message } = req.body;

		// Create transporter using SMTP config
		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT),
			secure: false, // use TLS (true for 465, false for 587)
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
			logger: true,
			debug: true,
		});

		const mailOptions = {
			from: `"Spartrack System" <${process.env.SMTP_FROM}>`,
			to: process.env.SMTP_USER, // receiver (you)
			replyTo: email, // user’s email
			subject: `📩 Message from ${name}`,
			text: message,
			html: `
				<h3>New message from ${name}</h3>
				<p><strong>Email:</strong> ${email}</p>
				<p><strong>Message:</strong></p>
				<p>${message}</p>
			`,
		};

		await transporter.sendMail(mailOptions);
		console.log("Email sent successfully", transporter);
		res
			.status(200)
			.json({ success: true, message: "✅ Email sent successfully!" });
	} catch (error) {
		console.error("Email sending error:", error);
		res
			.status(500)
			.json({ success: false, message: "❌ Failed to send email." });
	}
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
