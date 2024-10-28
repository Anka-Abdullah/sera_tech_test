import amqp from 'amqplib';

export async function sendEmailMessage(to: string, subject: string, text: string): Promise<void> {
  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();

    const queue = 'emailQueue';

    await channel.assertQueue(queue, { durable: false });

    const message = JSON.stringify({ to, subject, text });

    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Sent message to ${queue}: ${message}`);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error: unknown) { 
    if (error instanceof Error) {
      console.error(`Failed to send message: ${error.message}`);
    } else {
      console.error('Failed to send message: Unknown error', error);
    }
  }
}
