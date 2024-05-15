
import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import mongooseConnect from "@/lib/mongoose";
import productModel from "@/models/Product";
import styled from "styled-components";
import CategoryDropdown from "@/components/CategoryDropdown";
import { useState, useEffect } from "react";
import categoryModel from "@/models/Category";
import axios from "axios";

const Title = styled.h1`
  font-size: 1.5em;
`;

const CategoryDropdown1 = styled.div`
position: relative;
display: flex;
  justify-content: right;

  border-width: 1px;
  --tw-border-opacity: 1;
  border-color: rgba(209, 213, 219, var(--tw-border-opacity));

  padding: 0.5rem;
  
`;
export default function ProductsPage({ initialProducts, initialCategories }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const filterProducts = () => {
      if (selectedCategory) {
        // Find all categories that are children of the selected category
        const subCategories = categories.filter(cat => cat.parent === selectedCategory).map(cat => cat._id);
        // Include the selected category itself
        const allCategoriesToMatch = [selectedCategory, ...subCategories];

        // Filter products based on category and subcategories
        const filtered = initialProducts.filter(product => 
          allCategoriesToMatch.includes(product.category.toString())
        );
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(initialProducts);
      }
    };
    filterProducts();
  }, [selectedCategory, categories, initialProducts]);

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <>
      <Header />
      <Center>
          
        <Title className="text-center">All products </Title>
        <CategoryDropdown1>

        <CategoryDropdown onSelectCategory={handleCategoryChange} categories={categories} />
        </CategoryDropdown1>
        <ProductsGrid products={filteredProducts} />
      </Center>
    </>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const products = await productModel.find({}, 'title description category price images properties', { sort: { _id: -1 } });
  const categories = await categoryModel.find({}, 'name parent');

  return {
    props: {
      initialProducts: JSON.parse(JSON.stringify(products)),
      initialCategories: JSON.parse(JSON.stringify(categories)),
    },
  };
}
