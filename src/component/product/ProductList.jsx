import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Pagination from "../Pagination";
import { getAllProducts, getProductByCriteria } from "../../service/productService"; // Thêm getProductByCriteria
import PropTypes from "prop-types";

export default function ProductList({ searchResults, category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let data;
        if (searchResults !== null) {
          // Nếu có kết quả tìm kiếm, sử dụng nó
          data = searchResults;
        } else if (category) {
          // Nếu có danh mục, sử dụng getProductByCriteria
          data = await getProductByCriteria({ category });
        } else {
          // Nếu không, lấy toàn bộ sản phẩm
          data = await getAllProducts();
        }
        setProducts(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchResults, category]); // Thêm category vào dependency array

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  if (loading) return <div className="text-center py-6 text-gray-600">Đang tải...</div>;
  if (error) return <div className="text-center text-red-600 py-6">Lỗi: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        {category ? `Sản phẩm thuộc danh mục ${category}` : "Danh sách sản phẩm"}
      </h2>
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <p className="text-center text-gray-600">Không có sản phẩm nào</p>
      )}
    </div>
  );
}

ProductList.propTypes = {
  searchResults: PropTypes.array,
  category: PropTypes.string,
};

ProductList.defaultProps = {
  searchResults: null,
  category: null,
};