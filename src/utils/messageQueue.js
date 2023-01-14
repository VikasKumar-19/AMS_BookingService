const amqplib = require("amqplib");
const {
  MESSAGE_BROKER_URL,
  EXCHANGE_NAME,
} = require("../config/server-config");

const createChannel = async () => {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel(); //channel needed to connect rabbitmq message broker to connect to multiple queues
    await channel.assertExchange(EXCHANGE_NAME, "direct", false);
    return channel;
  } catch (error) {
    throw error;
  }
};

const subscribeChannel = async (channel, service, binding_key) => {
  try {
    const appQueue = await channel.assertQueue("QUEUE_NAME"); //verify if the given queue really exists or not
    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);
    channel.consume(appQueue.queue, (msg) => {
      console.log("Recieved Data");
      console.log(msg.content.toString());
      channel.ack(msg);
    });
  } catch (error) {
    throw error;
  }
};

const publishMessage = async (channel, binding_key, message) => {
  try {
    await channel.assertQueue("QUEUE_NAME"); //verify if the given queue really exists or not
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
  } catch (error) {}
};

module.exports = {
  createChannel,
  subscribeChannel,
  publishMessage,
};
