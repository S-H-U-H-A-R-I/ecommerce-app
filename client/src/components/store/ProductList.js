import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductItem from "./ProductItem.js";

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products: ', error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {products.map((product) => (
                <ProductItem key={product._id} product={product} />
            ))}
        </div>
    );
};

export default ProductList;