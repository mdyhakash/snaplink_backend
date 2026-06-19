import type { Request, Response } from "express"
import { nanoid } from "nanoid"
import { linkService } from "./link.service"


const createLink = async(req:Request,res:Response)=>{
    const {title,original_url} = req.body

    const short_code = nanoid(8)

    if(!original_url){
        return res.status(400).json({
            success: false,
            message: "original url is required"
        })
    }
    
    try{
        const link = await linkService.createLinkIntoDB({
            title,
            original_url,
            short_code,
        })
        return res.status(201).json({
            success:true,
            message: "Short code created successfully",
            data: {...link,
                short_url:`${process.env.BASE_URL}${link.short_code}`
            }
        })
    }catch(err:any){
        res.status(500).json({
            success:false,
            message:"Failed to create link",
            error:err.message
        })
    }
}

const redirectLink = async(req:Request,res:Response)=>{
    const {short_code} = req.params

    try {
        const link = await linkService.getLinkByShortCode(short_code as string)

        if(!link){
            return res.status(404).json({
                success:false,
                message: "Link not found"
            })
        }

        return res.redirect(link.original_url)
    } catch (err:any) {
        res.status(500).json({
            success:false,
            message:"Failed to redirect link",
            error:err.message
        })
        
    }
}

const getUserLinks = async(req:Request,res:Response)=>{
    const user_id =  req.user?.id

    if(!user_id){
    return res.status(401).json({
        success:false,
        message:"Unauthorized"
    })
}

}
export const linkController = {
    createLink,
    redirectLink,
    getUserLinks
}