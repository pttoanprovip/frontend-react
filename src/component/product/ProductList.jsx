import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Pagination from "../Pagination";
import { getAllProducts } from "../../service/productService";
import PropTypes from "prop-types";

export default function ProductList({ searchResults }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (searchResults !== null) {
      // Nếu có kết quả tìm kiếm, sử dụng nó
      setProducts(searchResults);
      setLoading(false);
    } else {
      // Nếu không, lấy danh sách sản phẩm mặc định
      const fetchProduct = async () => {
        try {
          const data = await getAllProducts();
          setProducts(data);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [searchResults]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  if (loading) return <div className="text-center py-6 text-gray-600">Đang tải...</div>;
  if (error) return <div className="text-center text-red-600 py-6">Lỗi: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Danh sách sản phẩm</h2>
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
};

ProductList.defaultProps = {
  searchResults: null,
};