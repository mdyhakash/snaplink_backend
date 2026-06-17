import { pool } from "../../db"


const createLinkIntoDB= async(payload)=>{

    const {title,original_url,short_code,user_id} = payload
    const result = await pool.query(`
    INSERT INTO links (title,original_url,short_code,user_id)
    VALUES($1,$2,$3,$4)
    RETURNING *
    `,[title,original_url,short_code,user_id]
    )
    return result.rows[0]
}


export const linkService ={
    createLinkIntoDB,

}