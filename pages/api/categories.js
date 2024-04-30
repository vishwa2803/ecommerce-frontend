import mongooseConnect from "@/lib/mongoose";
import categoryModel from "@/models/Category";

export default async function handle(req, res) {
  await mongooseConnect();

  try {
    const categories = await categoryModel.find({}, 'name parent'); 
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}