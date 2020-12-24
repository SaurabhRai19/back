const express = require("express");
const app = express()
const router = express.Router();
const { v4: uuidV4 } = require('uuid')
const {
  getUserById,
  getUser,
  updateUser,
  getAllUsers,
  userPurchaseList,
  giveroomId
} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.get("/share", giveroomId);



router.get("/sharescreen/:userId/currentUser", getUser);

router.get("/users", getAllUsers);
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

router.get(
  "/orders/user/:userId",
  isSignedIn,
  isAuthenticated,
  userPurchaseList
);

module.exports = router;
