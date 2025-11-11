import express from "express";
import { PurchaseProduct } from "../controller/ProductController";
import { verifyAuthToken } from "../middleware/Auth";
export const ProductRoutes=express.Router();

ProductRoutes.post("/purchase",verifyAuthToken,PurchaseProduct);
