import React from "react";

const ProductItem = ({ product }) => {
    return (
        <div className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            {product.images && product.images.length > 0 && (
                <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover mb-4" />
            )}
            <p className="mb-2">{product.description}</p>
            <p className="font-bold">Price: R{product.price.toFixed(2)}</p>
            {product.onSale && product.salePrice && (
                <p className="text-red-600 font-bold">Sale Price: R{product.salePrice.toFixed(2)}</p>
            )}
            <p>Stock: {product.stock}</p>
            {product.tags && product.tags.length > 0 && (
                <div className="mt-2">
                    {product.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-200 rounded-full px-2 py-1 text-sm mr-2">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                {product.isOnline ? "Add to Cart" : "Product not available"}
            </button>
        </div>
    );
};

export default ProductItem;