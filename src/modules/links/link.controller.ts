import type { Request, Response } from "express";
import { nanoid } from "nanoid";
import { linkService } from "./link.service";

const createLink = async (req: Request, res: Response) => {
  const { title, original_url } = req.body;

  const user_id = req.user?.id?? null;
  const short_code = nanoid(8);

  if (!original_url) {
    return res.status(400).json({
      success: false,
      message: "original url is required",
    });
  }

  try {
    const link = await linkService.createLinkIntoDB({
      title,
      original_url,
      short_code,
      user_id,
    });
    return res.status(201).json({
      success: true,
      message: "Short code created successfully",
      data: { ...link, short_url: `${process.env.BASE_URL}${link.short_code}` },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create link",
      error: err.message,
    });
  }
};

const redirectLink = async (req: Request, res: Response) => {
  const { short_code } = req.params;

  try {
    const link = await linkService.getLinkByShortCode(short_code as string);

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      });
    }
    //send redirect immediately
    res.redirect(link.original_url);

    //track click
    try {
      await linkService.recordClickEvent(link.id);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to redirect link",
        error: error.message,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to redirect link",
      error: err.message,
    });
  }
};

const getUserLinks = async (req: Request, res: Response) => {
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const links = await linkService.getUserLinksFromDB(user_id);
    return res.status(200).json({
      success: true,
      message: "Links fetched successfully",
      data: links,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch links",
      error: error.message,
    });
  }
};

const getTotalClick = async (req: Request, res: Response) => {
  const link_id = parseInt(req.params.id as string);
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const link = await linkService.getTotalClicksFromDB(link_id, user_id);

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Click count fetched successfully",
      data: { link_id, total_clicks: link.click_count },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch click count",
      error: error.message,
    });
  }
};
export const linkController = {
  createLink,
  redirectLink,
  getUserLinks,
  getTotalClick,
};
