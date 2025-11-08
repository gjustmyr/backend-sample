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

		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT),
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
			logger: true, // logs SMTP conversation
			debug: true, // prints debug info
		});

		const mailOptions = {
			from: `"Spartrack System" <${process.env.SMTP_FROM}>`,
			to: process.env.SMTP_USER,
			replyTo: email,
			subject: `📩 Message from ${name}`,
			text: message,
		};

		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent info:", info);

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
