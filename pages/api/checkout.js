import mongooseConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import productModel from "@/models/Product";


export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.json("should be a POST request");
    return;
  }
  const { name, email, city, postalCode, country, streetAddress, products } =
    req.body;
  await mongooseConnect();
  const productsIds = products.split(',');
  const uniqueIds = [...new Set(productsIds)];
  const productsInfos = await productModel.find({ _id: uniqueIds });
  let line_items = [];
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(
      (p) => p._id.toString() === productId
    );
    const quantity = productsIds.filter((id) => id === productId)?.length || 0;
    if (quantity > 0 && productInfo) {
      line_items.push({
        quantity,
        price_data: {
          currency: "INR",
          product_data: { name: productInfo.title },
          unit_amount: quantity * productInfo.price,
        },
      });
    }
  }
  const orderDoc = await Order.create({
    line_items,
    name,
    email,
    city,
    postalCode,
    streetAddress,
    country,
    paid:false,
  });

res.json(orderDoc);

}
