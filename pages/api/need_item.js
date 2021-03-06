import { ObjectID } from "mongodb";
import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
  console.log("need_item API method " + req.method)

  if (req.method === 'GET') {
    const { db } = await connectToDatabase();
    const items = await db
      .collection("need_item")
      .find({})
      .sort({})
      .limit(20)
      .toArray();
    res.json(items);
  } else if (req.method === 'POST') {
    console.log("ADDING ", req.body)
    let data = req.body;
    // data = JSON.parse(data);
    // let title = data.title;
    // let metacritic = data.metacritic;

    let { _id, product_name, code, brand, model, purchase_price, qty, limit_qty } = data;
    //let delete_product = document.getElementsByName('delete_item');

    // console.log("Received Debit:", balance_debit)
    // console.log("Received Date:", balance_date)
    const { db } = await connectToDatabase();
    let doc = await db
      .collection('need_item')
      .updateOne(
        {
          _id: _id
          // product_name: product_name,
          // code: code,
          // brand: brand,
          // model: model,
          // avi_model: avi_model,
          // purchase_price: purchase_price,
          // qty: qty,
          // limit_qty: limit_qty,
          // barcode_id: barcode_id,
          // date: date
        },
        { $set: data },
        { upsert: true }
      ) // if update non-existing record, insert instead.
        console.log(doc)
    res.json({ message: 'OK' });
  } else if (req.method === 'PUT') {
    let data = req.body
    let {_id, product_name, code, brand, model, avi_model, purchase_price, qty, limit_qty, barcode_id, date} = data;
    console.log({data})
    // not sure, _id is in data, let {_id, xxxx} = data
    // or data.id() or data._id
    const { db } = await connectToDatabase();
    let doc = await db
    .collection('item')
    .updateOne({_id: ObjectID(id)}, { $set: data },
      // Option 1: use updateOne {_id: ObjectID(id)}
      // Option 2: use findByIdAndUpdate, findByIdAndUpdate(ObjectID(id), {....})
        {
          new: true,
          runValidators: true
        },
      )
    res.json({message: 'Update data', data: data });
  } else if (req.method === 'DELETE') {
    let data = req.body
    let { product_name } = data;
    const { db } = await connectToDatabase();
    let doc = await db
      .collection('item')
      .deleteOne({ product_name: product_name})
    res.json({ delete: true, message: 'Delete data', data: {} })
  }
}