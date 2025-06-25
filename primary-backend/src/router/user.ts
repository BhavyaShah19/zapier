import { Router } from "express";
import { authMiddleware } from "../middleware";
import { SignInSchema, SignUpSchema } from "../types";
import { prisma } from "../db";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";


const router=Router();

router.post("/signup",async(req,res)=>{
    const parsedData=SignUpSchema.safeParse(req.body) 
    if(!parsedData.success){
        res.status(411).json({message:"Incorrect inputs"})
        return
    }
    const userExists=await prisma.user.findFirst({
        where:{
            email:parsedData.data.username
        }
    })
    if(userExists){
        res.status(403).json({message:"User already exists"})
        return
    }
    const user=await prisma.user.create({
        data:{
            name:parsedData.data.name,
            email:parsedData.data.username,
            password:parsedData.data.password,
        }
    })
    // await sendEmail()
    res.json({
        message:"Please verify your email",  
    })
})

router.post("/signin",async(req,res)=>{
    const parsedData=SignInSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(411).json({message:"Incorrect inputs"})
        return
    }
    const user=await prisma.user.findFirst({
        where:{
            email:parsedData.data.username ,
            password:parsedData.data.password
        }
    })
    if(!user){
        res.status(403).json({message:"Incorrect username or password"})
        return
    }
    const token=jwt.sign({id:user.id},JWT_PASSWORD)
    res.json({token:token})

})

router.get("/",authMiddleware,async(req,res)=>{
    //@ts-ignore
    const id=req.id
    const user=await prisma.user.findFirst({
        where:{
            id
        },
        select:{
            name:true,
            email:true
        }
    })
    res.json({
        user
    })

})

export const userRouter = router;
