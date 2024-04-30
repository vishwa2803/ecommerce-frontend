import { useState, useEffect } from "react";
import axios from "axios";

export default function CategoryDropdown({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    // console.log(selectedCategoryId);
    onSelectCategory(selectedCategoryId);
  };

  return (
    <select onChange={handleCategoryChange}>
      <option value="">Categories</option>
      {categories.map((category) => (
        <option key={category._id} value={category._id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}
