  import PropTypes from "prop-types";
  import { Link } from "react-router-dom";

  export default function ProductCard({ product }) {
    return (
      <div className="border rounded-xl shadow-sm hover:shadow-lg transition w-full max-w-[250px] bg-white">
        <Link to={`/product/${product.id}`}>
        <div className="relative">
          <img
            src={product.productImages?.[0]?.imageUrl || "https://via.placeholder.com/150"}
            alt={product.name}
            className="rounded-t-xl object-contain h-[180px] w-full p-4 transition-transform hover:scale-105"
          />
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Trả góp 0%
          </span>
        </div>
        <div className="p-4 flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 h-[40px]">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            ⭐⭐⭐⭐⭐ <span className="text-gray-500 text-xs">(125)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-600 text-lg font-bold">{product.price.toFixed(2)} VNĐ</span>
          </div>
          <button className="mt-2 !bg-red-600 text-white text-sm py-2 rounded hover:bg-red-700 transition">
            Mua ngay
          </button>
        </div>
        </Link>
      </div>
    );
  }

  ProductCard.propTypes = {
    product: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      detail: PropTypes.string,
      cpu: PropTypes.string.isRequired,
      ram: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      storage: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      screen_size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      brand: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      productImages: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          imageUrl: PropTypes.string,
        })
      ).isRequired,
    }).isRequired,
  };
