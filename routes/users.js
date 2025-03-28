const router = require("express").Router();
const {
  getUsers,
  createUser,
  getCurrentUser,
  loginUser,
  updateUserProfile,
} = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", updateUserProfile);

module.exports = router;
