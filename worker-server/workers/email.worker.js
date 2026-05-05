import { Worker, QueueEvents } from "bullmq";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import queueConnection from "../config/queueConnection.js";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    const { email, name, html } = job.data;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to MUSAFIR",
      html:
        html || `<p>Hello <strong>${name}</strong>! Successfully signup</p>`,
    });
  },
  { connection: queueConnection }
);

export const emailQueueEvents = new QueueEvents("email-queue", {
  connection: queueConnection,
});

emailWorker.on("completed", (job) => {
  console.log(`Email job completed: ${job.id}`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Email job failed: ${job?.id}`, err);
});

emailQueueEvents.on("failed", ({ jobId, failedReason }) => {
  console.error(`Email job event failed: ${jobId} reason: ${failedReason}`);
});
