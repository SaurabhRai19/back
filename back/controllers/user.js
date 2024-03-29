const User = require("../models/user");
const Order = require("../models/order");
const { v4: uuidV4 } = require('uuid')


exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB"
      });
    }
    req.profile = user;
    next();
  });
};
exports.giveroomId=(req, res) => {
  roomId: req.params.room;
  return res.json(uuidV4());
}
exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  return res.json(req.profile);
};

exports.getAllUsers = (req, res) => {
  User.find().exec((err, users) => {
    if (err) {
      return res.status(400).json({
        error: "NO users found"
      });
    }
    res.json(users);
  });
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this user"
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};

//Since anytime you want to ref something in different collection that is the exact moment you 
//want to use a populate like here in Order model we have populate user as in our Ordermodel we
//ref the User as ref. user: { type: ObjectId, ref: "User"}
//populate first parameter is which model we want to update which is user here and what fields I want
//to bring in that is _id and name and this is the syntax without , .As soon as we populate it we exec it.
//And one we know how we are getting req.profile that is while request comes in using :userId our middleware
//router.param gets called which populates the req.profile field.
exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No Order in this account"
        });
      }
      return res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach(product => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id
    });
  });

  //store thi in DB
  //$push for pushing our purchase array and somewhere we have used $set that is directly setting object values
  //and have updated this purchase with our user models purchases. new: true means from the database send me back 
  //the object which is updated one.
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save purchase list"
        });
      }
      next();
    }
  );
};
