import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
import { Kafka } from "kafkajs";

const TOPIC_NAME = "zap-events"

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['kafka:9092']
})


async function main() {
    console.log("inside the processor and it is running")
    const producer = kafka.producer()
    await producer.connect()
    while (1) {
        const pendingRows = await client.zapRunOutbox.findMany({
            where: {},
            take: 10,
        })

        producer.send({
            topic: TOPIC_NAME,
            messages:
                pendingRows.map(row => {
                    return {
                        key: row.id,
                        value: JSON.stringify({zaprunId: row.zapRunId,stage:0}),
                    }
                })
        })
        await client.zapRunOutbox.deleteMany({
            where:{
                id:{
                    in: pendingRows.maprow => row.id()
                }
            }
        })
    }
}

main();