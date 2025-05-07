import { useState } from "react";
import { useLocation } from "react-router-dom";
import ProductList from "../component/product/ProductList";
import Header from "../component/Header";
import Footer from "../component/Footer";

export default function Product() {
  const [searchResults, setSearchResults] = useState(null);
  const location = useLocation();
  const selectedCategory = location.state?.category || null; // Lấy category từ state

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-100">
      <Header onSearchResults={handleSearchResults} />
      <div className="container mx-auto py-10">
        <ProductList searchResults={searchResults} category={selectedCategory} />
      </div>
      <Footer />
    </div>
  );
}