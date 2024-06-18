const express = require("express");
const { addFriend, invdata, lists, accinv, refuseinv } = require("../controllers/invitation");

const router = express.Router();

router.post("/addFriend", addFriend);
router.post("/data", invdata);
router.post("/lists", lists);
router.post("/acc", accinv);
router.post("/refuse", refuseinv);

module.exports = router;