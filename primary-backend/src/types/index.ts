import {z} from 'zod'

export const SignUpSchema=z.object({
    username:z.string().min(5),
    password:z.string().min(8),
    name:z.string().min(3)
})

export const SignInSchema=z.object({
    username:z.string().email(),
    password:z.string()
})

export const zapCreateSchema=z.object({
    availableTriggerId:z.string(),
    triggerMetaData:z.any().optional(), 
    actions:z.array(z.object({
        availableActionId:z.string(),
        actionMetaData:z.any().optional()
    })) 
})

 