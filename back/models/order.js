const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ProductCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "Product"
  },
  name: String,
  count: Number,
  price: Number
});

const ProductCart = mongoose.model("ProductCart", ProductCartSchema);

const OrderSchema = new mongoose.Schema(
  {
    products: [ProductCartSchema],
    transaction_id: {},
    amount: { type: Number },
    address: String,
    status: {
      type: String,
      default: "Recieved",
      enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"]
    },
    updated: Date,
    user: {
      type: ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order, ProductCart };
/*
Suppose u r travelling from plane there are 3 seats available window,eile and middle if some user said I want corner seat then this 
simple chaos in the naming convention can become a nightmare for the staff so as a programmer u want to restrict the use case of what
words user is using while doing a booking or recieving any order,in such places we use enums.Enums lookslike array but they have limited 
choice only u can choose from those values.We want to restrict the state/phase of order. So in our OrderSchema we are having a status. 
*/