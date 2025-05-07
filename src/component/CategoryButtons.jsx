import { useState, useEffect } from "react";
import { getAll } from "../service/categoryService";
import { useNavigate } from "react-router-dom";

export default function CategoryButtons() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAll();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error.message);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate("/product", { state: { category: categoryName } });
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex flex-row flex-wrap justify-center gap-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)} // Truyền category.name
              className="!bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              {category.name}
            </button>
          ))
        ) : (
          <p className="text-gray-600">Không có danh mục nào.</p>
        )}
      </div>
    </section>
  );
}