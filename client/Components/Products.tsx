"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUserStore } from "@/zustand/store";
import { cleanupSocket, setupSocketListeners } from "@/socket/socket";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { User, setUser } = useUserStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://dummyjson.com/products?limit=10&skip=10"
        );
        setProducts(res.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const BuyProduct = (productId: number) => {
    const confirm = window.confirm(
      "Are you sure you want to purchase this product?"
    );
    if (!confirm) return;
    setLoading(true);

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/purchase`,
        {},
        { withCredentials: true }
      )
      .then(() => {
        toast.success(`Product ${productId} purchased!`);
        setLoading(false);
        router.push("/dashboard");
      })
      .catch((error) => {
        console.error("Purchase error:", error);
        toast.error("Failed to purchase product.");
      });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-800 text-white px-4 py-6 sm:px-8">
      {/* Header */}
      <div
        className="lg:flex items-center justify-center
  mb-8"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 lg:px-4 py-2 rounded-lg transition text-sm"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <h1 className="lg:text-4xl text-2xl font-semibold text-center py-3 lg:w-fit lg:m-auto">
          Our Products
        </h1>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full"
          ></motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-between shadow-lg hover:scale-[1.02] transition"
            >
              <img
                src={p.thumbnail}
                alt={p.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <div>
                <h2 className="text-lg font-semibold mb-1">{p.title}</h2>
                <p className="text-sm text-gray-400 mb-2 capitalize">
                  {p.category}
                </p>
                <p className="text-purple-400 font-bold">${p.price}</p>
              </div>
              <button
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition"
                onClick={() => BuyProduct(p.id)}
              >
                Buy Now
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
