const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

async function sendEmail(transporter, to, subject, text) {
  const mailOptions = {
    from: `Sender Name <${process.env.EMAIL}>`,
    to: `Recipient <${to}>`,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.log(error )
    console.error(`Failed to send email: ${error.message}`);
  }
}

async function start() {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS
        }
      });

  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();

    const queue = 'emailQueue';

    await channel.assertQueue(queue, { durable: false });

    console.log(`Waiting for messages in ${queue}...`);

    channel.consume(queue, async (msg) => {
      const { to, subject, text } = JSON.parse(msg.content.toString());
      console.log(`Received message: ${msg.content.toString()}`);

      await sendEmail(transporter, to, subject, text);

      channel.ack(msg);
    });
  } catch (error) {
    console.error(`Failed to connect to RabbitMQ: ${error.message}`);
  }
}

start();
