import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import mongooseConnect from "@/lib/mongoose";
import productModel from "@/models/Product";
import styled from "styled-components";
import CategoryDropdown from "@/components/CategoryDropdown";
import { useState, useEffect } from "react";

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
export default function ProductsPage({ products, categories }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (selectedCategory) {
      const filteredProducts = products.filter(product => product.category.toString() === selectedCategory);
      setFilteredProducts(filteredProducts);
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
  
  //   if (filteredProducts === null) {
  //   try {
  //     const response = await axios.get(`/api/categories`);
  //     const categories = response.data;
  //     const selectedCategory = categories.find(category => category._id === categoryId);
  //     if (selectedCategory) {
  //       const filteredProducts = products.filter(product => {
  //         return product.category.toString() === selectedCategory._id || product.category.toString() === categories.parent;
  //       });
  //       setFilteredProducts(filteredProducts);
  //     } else {
  //       console.log("No category selected");
  //       setFilteredProducts([]);
  //     }
  //   }  catch (error) {
  //     console.error("Error fetching categories:", error);
  //     setFilteredProducts([]);
  //   }
  // }
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
  const categoriesSet = new Set();
  products.forEach(product => {
    categoriesSet.add(product.category.toString()); 
  });
  const categories = Array.from(categoriesSet);

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categories
    },
  };
}
