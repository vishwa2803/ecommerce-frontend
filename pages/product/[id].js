import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductImages from "@/components/ProductImages";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import CartIcon from "@/components/icons/CartIcon";
import mongooseConnect from "@/lib/mongoose";
import productModel from "@/models/Product";
import { useContext } from "react";
import styled from "styled-components";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1.2fr;
  gap: 40px;
  margin-top: 40px;
`;

const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const Price = styled.span`
    font-size: 1.8rem;
`;
export default function ProductPage({ product }) {
    const {addProduct} = useContext(CartContext);
    // const buyProduct = (e) => {

    //   const {addProduct} = useContext(CartContext);    
    //   addProduct(product._id);  
      
    // } 
  return (
    <>
      <Header />
      <Center>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>
          <div>
            <Title>{product.title}</Title>
            <p>{product.description}</p>
            <PriceRow>
              <div><Price>
                ₹{product.price}
                </Price>
                </div>
              <div>
                <Button black outline onClick={() => addProduct(product._id)}>
                  <CartIcon />
                  Add to cart
                </Button>
              </div>
               
            </PriceRow>
          </div>
        </ColWrapper>
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;
  const product = await productModel.findById(id);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}
