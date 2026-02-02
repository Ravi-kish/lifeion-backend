
import { Request, Response } from 'express';
import pool from '../config/db';
import { Product } from '../models/product.model';
import path from 'path';
import fs from 'fs';
import { normalizeImagePath } from "../utils/files";

const assetsDir = path.join(__dirname, '..', '..', 'assets', 'images');

function tryDeleteFile(filename?: string | null) {
  if (!filename) return;
  const p = path.join(assetsDir, filename);
  if (fs.existsSync(p)) {
    try { fs.unlinkSync(p); } catch (e) { console.warn('Could not delete file', p, e); }
  }
}


export const getAll = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        product_id,
        name,
        sub_name,
        description,
        price,
        stock_quantity,
        category_id,
        specifications,
        counter_details,
        warranty_installation,
        details,
        image_url,
        image_url1, image_url2, image_url3, image_url4, image_url5,
        image_url6, image_url7, image_url8, image_url9, image_url10,
        created_at
      FROM products
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



// product.controller.ts
export const getById = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    const [rows]: any = await pool.query(`
      SELECT
        p.product_id,
        p.name,
        p.sub_name,
        p.description,
        p.price,
        p.stock_quantity,
        p.category_id,
        p.specifications,
        p.counter_details,
        p.warranty_installation,
        p.details,
        p.image_url,
        p.image_url1, p.image_url2, p.image_url3, p.image_url4, p.image_url5,
        p.image_url6, p.image_url7, p.image_url8, p.image_url9, p.image_url10,
        p.created_at,
        c.menu_type_id
      FROM products p
      JOIN categories c ON c.category_id = p.category_id
      WHERE p.product_id = ?
    `, [productId]);

    if (!rows.length) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};




export const getByCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.categoryId);

    const [rows] = await pool.query(`
      SELECT 
        p.*,
        c.menu_type
      FROM products p
      JOIN categories c ON p.category_id = c.category_id
      WHERE p.category_id = ?
    `, [categoryId]);

    res.json(rows); // ⬅️ IMPORTANT: return ARRAY ONLY
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
