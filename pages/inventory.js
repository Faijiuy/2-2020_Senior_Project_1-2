import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import ButtonBar from '../components/buttonBar';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import BrandList from '../components/brandList';
import ModelList from '../components/modelList'
import AvailableList from '../components/availableList';
import SearchBar from '../components/search_name'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { connectToDatabase } from "../util/mongodb";
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import { colourOptions, groupedOptions, groupStyles, groupBadgeStyles, animatedComponents, options } from '../pages/data';
import Link from 'next/link'

import React, { useState, useEffect } from 'react';
import ItemList from '../components/itemList'
import { ObjectId } from 'bson';
// import DropdownButton from 'react-bootstrap/DropdownButton';
// import Dropdown from 'react-bootstrap/Dropdown';

export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const item = await db
    .collection("item")
    .find()
    .sort({})
    .limit(20)
    .toArray();

  const model = await db
    .collection("model")
    .find()
    .sort({})
    .limit(20)
    .toArray();

  const brand = await db
    .collection("brand")
    .find()
    .sort({})
    .limit(20)
    .toArray();


  return {
    props: {
      item: JSON.parse(JSON.stringify(item)),
      model: JSON.parse(JSON.stringify(model)),
      brand: JSON.parse(JSON.stringify(brand)),

    },


  };

}



export default function Inventory({ item: items, brand: brands, model: models }) {

  console.log("item: ", items)

  const { register, handleSubmit, control, watch, errors } = useForm();

  const [input, setInput] = useState('');
  const [inputBrand, setInputBrand] = useState();
  const [inputModel, setInputModel] = useState();

  const [itemListDefault, setItemListDefault] = useState();
  const [itemList, setItemList] = useState();

  const [brandListDefault, setBrandListDefault] = useState();
  const [brandList, setBrandList] = useState();

  // filter is a JSON object having brand and model
  let [filter, setFilter] = useState({
    brand: '',
    id: '',
    model: '',
    avi_model: []
  })

  const brandOptions = brands.map(brand => (
    {
      label: '' + brand.name,
      // value: ''+brand._id,
      value: '' + brand.name,

    }
  ), [{ label: 'empty', value: 'empty' }]

  )

  const modelOptions = models.map(model => (
    {
      label: '' + model.name,
      // value: ''+brand._id,
      value: '' + model.name,

    }
  ),
    [{ label: '', value: '' }]
  )

  const modelListOptions = models.filter(m => m.brand === filter.id).map(model => (
    { label: '' + model.name, value: '' + model.name }
    // label: ''+model.name, 
    //   // value: ''+brand._id,
    // value: ''+model.name,
  )
  )



  const handleOnChange = e => {
    console.log(e.value)
    brandChange(e.value)
  }


  const updateInput = async (input) => {
    console.log("input ==== ", input)
    if (input != items.brand) {
      // if(input == String && input.value != undefined ){


      const filtered = itemListDefault.filter(item => {
        return item.product_name.toLowerCase().includes(input.toLowerCase())
      })
      console.log("filter ==== ", filtered)
      setInput(input);
      setItemList(filtered);
      console.log("itemList ==== ", itemList)
    }
    // else{
    //   const filtered = brandListDefault.filter(item => {
    //     return item.brand.toLowerCase().includes(input.value.toLowerCase())
    //    })
    //    console.log("222222222222222222")
    //    setInput(input);
    //    setBrandList(filtered);
    // }

  }

  const updateBrand = async (input) => {

    const filtered = itemListDefault.filter(item => {
      return item.brand.toLowerCase().includes(input.value.toLowerCase())
    })
    console.log("222222222222222222")
    //  setInput(input);
    setBrandList(filtered);


  }



  useEffect(() => {
    // This will run after the first render, only once
    setItemList(items)
    setItemListDefault(items)
    { console.log("itemList ====", itemList) }
    { console.log("itemListDefalut ====", itemListDefault) }
  }, []);

  useEffect(() => {
    // This will run when filter is set.
    console.log("filter update ----", filter)
  }, [filter])


  const edit = (itemId) => {
    console.log({ itemId })
  }

  const handleBrandChange = (value) => {
    let temp_avi = filter.avi_model

    if (value != null) {
      brands.map(brand => {
        if (value.value == brand.name) {
          setFilter({ brand: value.value, id: brand._id, model: '', avi_model: temp_avi })
          setInputModel('')
          console.log("value ==== ", filter)
        }
      })
    } else {
      setFilter({ brand: '', id: '', model: '', avi_model: [] })
    }


  }

  const handleModelChange = (value) => {
    let temp_brand = filter.brand
    let temp_id = filter.id
    let temp_avi = filter.avi_model

    if (value != null) {
      // console.log("model ====", value.value)
      setFilter({ brand: temp_brand, id: temp_id, model: value.value, avi_model: temp_avi })
      console.log(filter)
    } else {
      setFilter({ brand: temp_brand, id: temp_id, model: '', avi_model: temp_avi })
    }

  }

  const handleAviModelChange = (obj) => {
    console.log(obj)
    // console.log(obj[0].value)
    let temp_brand = filter.brand
    let temp_id = filter.id
    let temp_model = filter.model

    if (obj != null) {
      // console.log("value avi ======= ",obj.label)
      // console.log("model ====", value.value)
      console.log('obj', obj)
      let newFilter = { brand: temp_brand, id: temp_id, model: temp_model, avi_model: obj }
      setFilter(newFilter)
      console.log('filter', filter)
      // console.log(filter.avi_model.value)
      newFilter.avi_model.map(avi_model => console.log('--->', avi_model.value))
    }
  }



  return (
    <div className={styles.container}>
      <Head>
        <title>Inventory</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ButtonBar />



      <main className={styles.main}>
        <h1 className={styles.title}>
          Stock Manangement
        </h1>

        <br></br><br></br>

        <div>
          {/* <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">ค้นหา</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="ชื่อสินค้า"
              aria-label="Item name"
              aria-describedby="basic-addon1"
              input={input} 
              onChange={updateInput}
            />
          </InputGroup> */}
          <SearchBar input={input}
            onChange={updateInput} />


          {/* <BrandList brandChange={handleBrandChange}/> */}

      ยี่ห้อสินค้า: <Select

            // options={brandOP}
            // defaultValue={inputBrand}
            options={brandOptions}
            isClearable={true}
            // isMulti
            // className="basic-multi-select"
            // classNamePrefix="select"
            // formatGroupLabel={formatGroupLabel}
            onChange={handleBrandChange}
          />




          {/* <ModelList /> */}

          รุ่นสินค้า: <Select
            options={modelListOptions}
            onChange={handleModelChange}
            isClearable={true}
          // value={inputModel}
          // options={modelOP}
          // formatGroupLabel={formatGroupLabel}
          />

          รุ่นที่ใช้ได้:

            <Select
            onChange={handleAviModelChange}
            // onBlur={onBlur}
            // value={value}  // this is what you need to do
            isMulti
            isSearchable={true}
            options={modelOptions}
          // ref={register}
          />



        </div>

        <div>
          <ItemList ItemList={itemList} filter={filter} />

          {/* <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>id</th>
                <th>ชื่อสินค้า</th>
                <th>รหัสสินค้า</th>
                <th>ยี่ห้อสินค้า</th>
                <th>รุ่นสินค้า</th>
                
                <th>Barcode ID</th>
                <th>จำนวน</th>
                <th>จำนวนจำกัด</th>
                <th>ราคา</th>
                <th>วันที่บันทึก</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr>
                  <td>
                  <Link href={`/additem/${p._id}`}>
            <a>
              Edit
                    {p._id}
            </a>
          </Link>
                    </td>
                  <td>{p.product_name}</td>
                  <td>{p.code}</td>
                  <td>{p.brand}</td>
                  <td>{p.model}</td>
                  
                  <td>{p.barcode_id}</td>
                  <td>{p.amount}</td>
                  <td>{p.limit_amount}</td>
                  <td>{p.purchase_price}</td>
                </tr>
              ))}
            </tbody>
          </Table> */}
        </div>
      </main>

      <div class="button">
        <Button variant="primary" href="/additem/new" size="lg">เพิ่มสินค้า</Button>{' '}
        <Button variant="secondary" size="lg">สแกนบาร์โค้ด</Button>{' '}
      </div>

    </div>
  )
}

// {item.map((items) => (
//   <tr>
//     <td>1</td>
//     <td>{items.product_name}</td>
//     <td>{items.code}</td>
//     <td>{items.brand}</td>
//     <td>{items.model}</td>

//     <td>{items.barcode_id}</td>
//     <td>{items.amount}</td>
//     <td>{items.limit_amount}</td>
//     <td>{items.purchase_price}</td>
//   </tr>
// ))}
// </tbody>
// </Table>
// </div>
// </main>

// <ButtonGroup>
// <Button variant="primary" href="/additem" size="sm">เพิ่มสินค้า</Button>{' '}
// <Button variant="secondary" size="sm">สแกนบาร์โค้ด</Button>{' '}
// </ButtonGroup>

// </div>
// )
// }



// export async function getServerSideProps() {
//   const { db } = await connectToDatabase();

//   const item = await db
//     .collection("item")
//     .find()
//     .sort({})
//     .limit(20)
//     .toArray();

//   return {
//     props: {
//       item: JSON.parse(JSON.stringify(item)),
//     },
//   };
// }