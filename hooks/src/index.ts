import express from 'express';
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();
const app = express();
app.use(express.json());

app.post('/hooks/catch/:userId/:zapId', async (req, res) => {
    const { userId, zapId } = req.params;
    const { body } = req.body

    await client.$transaction(async (tx) => {
        const run = await tx.zapRun.create({
            data: { 
                zapId: zapId,
                metadata: body,
            },
        });
        await tx.zapRunOutbox.create({
            data: {
                zapRunId: run.id,
            }
        })
    });
    res.json({message:"Webhook received"});
});
 
app.listen(3000, () => {
    console.log('listening on port 3000');  
})