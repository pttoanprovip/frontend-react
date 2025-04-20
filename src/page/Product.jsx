import { useState } from "react";
import ProductList from "../compoment/product/ProductList";
import Header from "../compoment/Header";
import Footer from "../compoment/Footer";

export default function Product() {
  const [searchResults, setSearchResults] = useState(null); // Lưu kết quả tìm kiếm

  const handleSearchResults = (results) => {
    setSearchResults(results); // Cập nhật kết quả tìm kiếm
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-100">
      <Header onSearchResults={handleSearchResults} />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Sản phẩm</h1>
        <ProductList searchResults={searchResults} />
      </div>
      <Footer />
    </div>
  );
}