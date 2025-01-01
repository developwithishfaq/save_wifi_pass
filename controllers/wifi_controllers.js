import amqplib from "amqplib";
import { batchSaveWifiPasswords } from "../services/wifi_service.js";
import {saveFailedBufferData} from "./storage_controller.js"

export async function publishWifiPass(items, cb) {
  const connection = await amqplib.connect("amqp://guest:guest@rabbitmq");
  const channel = await connection.createChannel();
  const exchnageKey = "wifi_exchange";
  const queeKey = "wifi_passwords";
  const routing = "save_wifi_pass";
  await channel.assertExchange(exchnageKey, "direct", { durable: true });
  await channel.assertQueue(queeKey, { durable: true });
  await channel.bindQueue(queeKey, exchnageKey, routing);
  channel.publish(exchnageKey, routing, Buffer.from(JSON.stringify(items)));
  console.log("Message Published");
  cb();
  setTimeout(() => {
    connection.close();
  }, 500);
}
const buffer = [];
const batchSize = 100;
const saveDataInterval = 20000;

setInterval(async () => {
  saveBufferData(false);
}, saveDataInterval);

export async function consumeWifiPass() {
  const connection = await amqplib.connect("amqp://guest:guest@rabbitmq");
  const channel = await connection.createChannel();
  await channel.assertQueue("wifi_passwords", { durable: true });
  channel.consume("wifi_passwords", async (msg) => {
    if (msg != null) {
      const message = JSON.parse(msg.content);
      console.log("Message is ", message);
      message.forEach((item) => {
        buffer.push(item);
      });
      saveBufferData(true);
      channel.ack(msg);
    }
  });
}

async function saveBufferData(checkBatchSize) {
  if (buffer.length >= batchSize || !checkBatchSize) {
    const dataToSave = buffer.splice(0, batchSize);
    try {
        const results = await batchSaveWifiPasswords(dataToSave);
        if(results.writeErros && results.writeErros.length>0){
            saveFailedBufferData(dataToSave)
        }
    } catch(error){
        saveFailedBufferData(dataToSave)
    }
  }
}
