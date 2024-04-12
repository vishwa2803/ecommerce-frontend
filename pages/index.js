import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import mongooseConnect from "@/lib/mongoose";
import productModel from "@/models/Product";

export default function HomePage({featuredProduct,newProducts})
{
  return (
    <div>
    <Header />
    <Featured product={featuredProduct}/>
    <NewProducts products={newProducts}/>
    </div>
  )
}

export async function getServerSideProps() {
  const featuredProductId = '6618fd0e3b5e26d8f26e3b92';
  await mongooseConnect();
  const featuredProduct = await productModel.findById(featuredProductId);
  const newProducts = await productModel.find({}, null, {sort: {'_id':-1}, limit: 10});
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  }
}