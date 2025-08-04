import { Router } from "express";
import { authMiddleware } from "../middleware";
import { zapCreateSchema } from "../types";
import { prisma } from "../db";
const router = Router();

router.post("/", authMiddleware, async (req, res) => {
    // @ts-ignore
    const id = req.id
    const parsedData = zapCreateSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(411).json({ message: "Incorrect data format" })
    }
    const zapId=await prisma.$transaction(async tx=>{
        const zap=await tx.zap.create({
            data: {
                userId:parseInt(id),
                triggerId:"",
                actions:{
                    create:parsedData?.data?.actions.map((action,index)=>({
                        actionId:action.availableActionId,
                        sortingOrder:index,
                        metadata:action.actionMetaData
                    }))
                }
            }
        })
        const trigger=await tx.trigger.create({
            data:{
                triggerId:parsedData?.data?.availableTriggerId as string,
                zapId:zap.id
            }
        })
        await tx.zap.update({
            where:{
                id:zap.id
            },
            data:{
                triggerId:trigger.id
            }
        }) 
        return zap.id
    })
    res.json({zapId})
})

router.get("/", authMiddleware, async(req, res) => {
    // @ts-ignore
    const id=req.id
    const zaps=await prisma.zap.findMany({
        where:{
            userId:id
        },
        include:{
            actions:{
                include:{
                    type:true
                }
            },
            trigger:{
                include:{
                    type:true
                }
            }
        }
    })
    res.json({zaps})
})

router.get("/:zapId", authMiddleware, async(req, res) => {
    // @ts-ignore
    const id = req.id
    const zapId=req.params.zapId
    const zap=await prisma.zap.findFirst({
        where:{
            id:zapId,
            userId:id
        },
        include:{
            actions:{
                include:{
                    type:true
                }
            },
            trigger:{
                include:{
                    type:true
                }
            }
        } 
    })
    res.json({zap})
})

export const zapRouter = router;
