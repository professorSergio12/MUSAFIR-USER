import { Queue } from "bullmq";
import queueConnection from "../config/queueConnection.js";

export const emailQueue = new Queue("email-queue", {
  connection: queueConnection,
});

export const otpQueue = new Queue("otp-queue", {
  connection: queueConnection,
});

export async function enqueueSignupEmail(email, name, html) {
  await emailQueue.add(
    "signup-email",
    { email, name, html },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: 1000,
      removeOnFail: 1000,
    }
  );
}

export async function enqueueResetPasswordEmail(email, name, otp) {
  await otpQueue.add(
    "reset-password-email",
    { email, name, otp },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: 1000,
      removeOnFail: 1000,
    }
  );
}
