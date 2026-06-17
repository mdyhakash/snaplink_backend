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
            data: link
        })
    }catch(err:any){
        res.status(500).json({
            success:false,
            message:"Failed to create link",
            error:err.message
        })
    }
}

export const linkController = {
    createLink,
}