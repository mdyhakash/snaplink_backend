import { pool } from "../../db"
import type { IcreateLink } from "./link.interface"


const createLinkIntoDB= async(payload:IcreateLink)=>{

    const {title,original_url,short_code,user_id} = payload
    const result = await pool.query(`
    INSERT INTO links (title,original_url,short_code,user_id)
    VALUES($1,$2,$3,$4)
    RETURNING *
    `,[title,original_url,short_code,user_id]
    )
    return result.rows[0]
}

const getLinkByShortCode = async(short_code:string)=>{

    const result = await pool.query(`
    SELECT *
    FROM links
    WHERE short_code = $1
    `,[short_code])

    return result.rows[0]

}


export const linkService ={
    createLinkIntoDB,
    getLinkByShortCode,

}