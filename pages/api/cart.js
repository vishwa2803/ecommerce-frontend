import mongooseConnect from "@/lib/mongoose";
import productModel from "@/models/Product";

export default async function handle(req,res){
    await mongooseConnect();
    const ids = req.body.ids;
    res.json(await productModel.find({_id: ids}));
}