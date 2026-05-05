import { Worker, QueueEvents } from "bullmq";
import queueConnection from "../config/queueConnection.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const otpWorker = new Worker(
  "otp-queue",
  async (job) => {
    const { email, name, otp } = job.data;
    console.log(email, name, otp);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP for Reset Password",
      html: `<p>Hello <strong>${name}</strong>! Your OTP for reset password is ${otp}</p>`,
    });
  },
  { connection: queueConnection }
);

// Queue event listeners
const queueEvents = new QueueEvents("otp-queue", {
  connection: queueConnection,
});

queueEvents.on("completed", ({ jobId }) => {
  console.log(`Job ${jobId} completed`);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(`Job ${jobId} failed: ${failedReason}`);
});
