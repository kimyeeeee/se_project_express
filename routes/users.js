const router = require("express").Router();
const {
  getCurrentUser,
  updateUserProfile,
  createUser,
} = require("../controllers/users");
const { auth } = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUserProfile);

module.exports = router;
