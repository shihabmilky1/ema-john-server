const express = require('express');
const port = 5000;
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4czm1.mongodb.net/emaJohnStore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors())
app.use(bodyParser.json())


client.connect(err => {
  const productCollection = client.db("emaJohnStore").collection("product");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
    app.post('/addProduct', (req,res)=>{
        const products = req.body;
        productCollection.insertOne(products)
        .then(result=>{
            res.send(result.insertedCount > 0)
        })
    })
    
    app.get('/products', (req,res)=> {
      productCollection.find({name:{$regex : req.query.search}})
      .toArray((err,documents)=>{
        res.send(documents)
      })
    })

    app.get('/product/:key', (req,res)=> {
      productCollection.find({key: req.params.key})
      .toArray((err,documents)=>{
        res.send(documents[0])
      })
    })

    app.post('/productByKeys',(req,res)=> {
      productCollection.find({key:{$in: req.body}})
      .toArray((err,documents)=>{
        res.send(documents)
      })
    })

    app.post('/placeOrder', (req,res)=>{
      const order = req.body;
      ordersCollection.insertOne(order)
      .then(result=>{
          res.send(result.insertedCount > 0)
      })
  })

  })
    
//amar pran doriya, maro tan

app.get('/', (req, res) => {
    res.send('Welcome')
})

app.listen(process.env.PORT || port)