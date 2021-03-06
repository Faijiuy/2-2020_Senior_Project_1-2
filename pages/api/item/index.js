// import { ObjectID } from "mongodb";
import { ObjectId } from 'bson';
// import { ObjectId} from "bson";
import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  console.log("item API method ++++++ " + req.method)

  if (req.method === 'GET') {
    const { db } = await connectToDatabase();
    const item = await db
      .collection("item")
      .find({})
      .sort({})
      .limit(20)
      .toArray();
    res.json(item);
  } else
    if (req.method === 'POST') {
      console.log("ADDING ", req.body)
      let data = req.body;
      // data = JSON.parse(data);
      // let title = data.title;
      // let metacritic = data.metacritic;

      // let { _id, product_name, code, brand, model, avi_model, purchase_price, qty, minStock, barcode_id, date } = data;


      // จะได้ objectID ถ้าใช้โค้ดล่าง อันบนเหมือนจะสร้าง _id เองได้
      let { product_name, code, brand, model, avi_model, purchase_price, qty, minStock, barcode_id, date } = data;

      const { db } = await connectToDatabase();
      await db
        .collection('item')
        .insertOne(
          {
            // _id: ObjectId(_id)
            // _id: _id
            product_name: product_name,
            code: code,
            brand: brand,
            model: model,
            avi_model: avi_model,
            purchase_price: Number(purchase_price),
            qty: Number(qty),
            minStock: Number(minStock),
            barcode_id: barcode_id,
            date: date
          },
          // callback
          (err, result) => {
            if (err) {
              console.log(err)
              res.json(err)
            } else {
              console.log('Newly inserted ID', result.insertedId)
              res.json({
                message: 'Item added',
                _id: result.insertedId
              });
            }
          }
        ) // if update non-existing record, insert instead.
    } else if (req.method === 'PUT') {
      /* Update */
      let data = req.body
      // let data1 = req.body

      let { product_name, code, brand, model, avi_model, purchase_price, qty, minStock, barcode_id, date } = data;
      // console.log("req body ใน PUT ========", { data })
      // console.log("object id ==== ", ObjectId(data._id))
      let _id = ObjectId(data._id)
      delete data._id
      // not sure, _id is in data, let {_id, xxxx} = data
      // or data.id() or data._id
      const { db } = await connectToDatabase();
      let doc = await db
        .collection('item')
        .update(
          { _id: _id },
          {
            $set:
            {
              product_name: product_name,
              code: code,
              brand: brand,
              model: model,
              avi_model: avi_model,
              purchase_price: Number(purchase_price),
              qty: Number(qty),
              minStock: Number(minStock),
              barcode_id: barcode_id,
              date: date
            }
          },
          (err, result) => {
            if (err) {
              console.log("Update Error", err)
              res.json(err)
            } else {
              console.log('Newly Updated (expect 1):', result)
              res.json({
                message: 'Data has been updated.',
                data: data
              });
            }
          }
        )
      // res.json({ message: 'Update data', data: data , _id: data._id});
    } else if (req.method === 'DELETE') {
      let data = req.body
      let { _id } = data;
      const { db } = await connectToDatabase();
      let doc = await db
        .collection('item')
        .deleteOne({ _id: ObjectId(data._id) })
      res.json({ delete: true, message: 'Delete data', data: {} })
    } else if (req.method === 'UPDATE_QTY') {
      let data = req.body
      let { _id } = ObjectId(data._id)
      delete data._id
      // let { _id } = data;
      const { db } = await connectToDatabase();
      let doc = await db
        .collection('item')
        .updateOne(
          { _id: _id },
          { $inc: qty - data.qty },
          // Option 1: use updateOne {_id: ObjectID(id)}
          // Option 2: use findByIdAndUpdate, findByIdAndUpdate(ObjectID(id), {....})
          {
            new: true,
            runValidators: true
            // upsert: true
          },
          (err, result) => {
            if (err) {
              console.log(err)
              res.json(err)
            } else {
              // console.log('Newly inserted ID', result.insertedId)
              res.json({
                message: 'Update qty'
              });
            }
          }
        )
      // res.json({ delete: true, message: 'Delete data', data: {} })
    }
}