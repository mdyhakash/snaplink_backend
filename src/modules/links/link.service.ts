import { pool } from "../../db";
import type { IcreateLink } from "./link.interface";

const createLinkIntoDB = async (payload: IcreateLink) => {
  const { title, original_url, short_code, user_id } = payload;
  const result = await pool.query(
    `
    INSERT INTO links (title,original_url,short_code,user_id)
    VALUES($1,$2,$3,$4)
    RETURNING *
    `,
    [title, original_url, short_code, user_id],
  );
  return result.rows[0];
};

const getLinkByShortCode = async (short_code: string) => {
  const result = await pool.query(
    `
    SELECT *
    FROM links
    WHERE short_code = $1
    `,
    [short_code],
  );

  return result.rows[0];
};

const getUserLinksFromDB = async (user_id: number) => {
  const result = await pool.query(
    `

    SELECT *
    FROM links 
    WHERE user_id = $1 
    ORDER BY
    created_at DESC        
    `,
    [user_id],
  );
  return result.rows;
};
const recordClickEvent = async (link_id: number) => {
  await pool.query(
    `
    UPDATE links 
    SET click_count = click_count + 1
    WHERE id = $1
    `,
    [link_id],
  );
};
const getTotalClicksFromDB = async (link_id: number, user_id: number) => {
  const result = await pool.query(
    `
    SELECT click_count 
    FROM links
    WHERE id =$1 AND user_id=$2
    `,
    [link_id, user_id],
  );
  return result.rows[0];
};
export const linkService = {
  createLinkIntoDB,
  getLinkByShortCode,
  getUserLinksFromDB,
  recordClickEvent,
  getTotalClicksFromDB,
};
