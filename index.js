const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
require('dotenv').config()



const port = process.env.PORT || 5055;



app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k1cqz.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection err', err)
  const productCollection = client.db("product").collection("tshirts");


  app.get('/product',(req, res) => {
    productCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })
  })

  app.post('/admin', (req, res) => {
    const newProduct = req.body;
    console.log('adding new product', newProduct);
    productCollection.insertOne(newProduct)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })
  // client.close();
});

app.post('/addOrder', (req, res) => {
  const newOrder =req.body;
  console.log(newOrder);
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})