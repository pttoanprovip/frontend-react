import PropTypes from "prop-types";

export default function CartItem({ item, onUpdateQuantity, onRemoveItem, isSelected, onToggleSelect }) {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="bg-white rounded-sm p-4 flex items-center border-b">
      {/* Checkbox */}
      <div className="flex items-center mr-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(item.id)}
          className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500"
        />
      </div>

      {/* Product image */}
      <div className="w-20 h-20 flex-shrink-0 border rounded-sm overflow-hidden mr-4">
        <img
          src={item.image || "https://via.placeholder.com/80"}
          alt={item.productName}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Product info */}
      <div className="flex-grow mr-4">
        <h3 className="font-medium text-gray-800 line-clamp-2">{item.productName}</h3>
      </div>

      {/* Price */}
      <div className="w-32 text-right mr-4">
        <div className="text-red-500 font-semibold">
          {item.price.toLocaleString()}₫
        </div>
      </div>

      {/* Quantity control */}
      <div className="flex items-center mx-4">
        <div className="flex items-center border rounded-sm">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
          >
            -
          </button>
          <div className="w-10 h-8 flex items-center justify-center border-x">
            {item.quantity}
          </div>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Total price */}
      <div className="w-32 text-right mr-4">
        <div className="text-red-500 font-semibold">
          {(item.price * item.quantity).toLocaleString()}₫
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={() => onRemoveItem(item.id)}
        className="text-gray-400 hover:text-red-500"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    productName: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    image: PropTypes.string,
  }).isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggleSelect: PropTypes.func.isRequired,
};