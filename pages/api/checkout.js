import mongooseConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import productModel from "@/models/Product";
const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(400).json({ error: "Only POST requests are allowed" });
    return;
  }
  
  const { name, email, city, postalCode, country, streetAddress, cartProducts } =
    req.body;
  await mongooseConnect();
  const productsIds = cartProducts;
  // console.log(line_items);
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
        // product_id: productId, 
          quantity,
        price_data: {
          currency: "INR",
          product_data: { name: productInfo.title },
          unit_amount: quantity * productInfo.price * 100,
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

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode:'payment',
    customer_email: email,
    success_url: process.env.PUBLIC_URL + '/cart?success=1',
    cancel_url: process.env.PUBLIC_URL + '/cart?canceled=1',
    metadata: {orderId: orderDoc._id.toString(),test:'ok'},
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB'], // Specify allowed shipping countries
    },
    
  })
  res.json({
    url:session.url,
  })
}



