require('dotenv').config()
import { Kafka } from "kafkajs";
import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { parse } from "./parser";
import { sendEmail } from "./email";

const prismaclient = new PrismaClient();
const TOPIC_NAME = "zap-events"

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['kafka:9092']
})

async function main() {
    const consumer = kafka.consumer({ groupId: 'main-worker' })
    await consumer.connect()
    const producer = kafka.producer()
    await producer.connect()

    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })
    await consumer.run({

        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString(),
            })
            if (!message.value?.toString()) {
                return
            }
            const parsedValue = JSON.parse(message.value.toString())
            const zapRunId = parsedValue.zaprunId
            const stage = parsedValue.stage

            const zapRunDetails = await prismaclient.zapRun.findFirst({
                where: {
                    id: zapRunId
                },
                include: {
                    zap: {
                        include: {
                            actions: {
                                include: {
                                    type: true
                                }
                            }
                        }
                    }
                }
            })

            const currentAction = zapRunDetails?.zap.actions.find(x => x.sortingOrder === stage)
            if (!currentAction) {
                console.log("current action not found");
                return
            }

            const zapRunMetaData=zapRunDetails?.metadata//{comment:{email:"bshah@gmail.com",amount:100}}
            if (currentAction.type.id === "email") {
                const body=parse((currentAction.metadata as JsonObject)?.body as string ,zapRunMetaData)//You recv this at{comment.amount} 
                const to=parse((currentAction.metadata as JsonObject)?.email as string,zapRunMetaData)//{comment.email}
                await sendEmail(to,body)
            }
            if (currentAction.type.id === 'send-sol') {
                const amount=parse((currentAction.metadata as JsonObject)?.amount as string ,zapRunMetaData)//You recv this at{comment.amount} 
                const to=parse((currentAction.metadata as JsonObject)?.email as string,zapRunMetaData)//{comment.email}
            }



            await new Promise(resolve => setTimeout(resolve, 500))

            const lastStage = (zapRunDetails?.zap.actions.length || 1) - 1

            if (stage !== lastStage) {
                await producer.send({
                    topic: TOPIC_NAME,
                    messages: [{
                        value: JSON.stringify({
                            stage: stage + 1,
                            zapRunId
                        })
                    }]
                })
            }

            console.log("processing done!",)
            await consumer.commitOffsets([{
                topic: TOPIC_NAME,
                partition: partition,
                offset: (parseInt(message.offset) + 1).toString(),
            }])
        }
    })

}
main()