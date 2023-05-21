const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const User = require('../models/User');
const Redeem = require('../models/Redeem');

router.get('/dashboard', async (req, res) => {
  try {
    const userCountResponse = await fetch('http://localhost:8080/newMembers');
    const userCountString = await userCountResponse.text();
    const userCount = userCountString;

    // Get total points and expired points
    const activePointsResponse = await User.aggregate([{ $group: { _id: null, total: { $sum: "$points" }, expired: { $sum: { $cond: [{ $lt: ["$pointsExpiration", new Date()] }, "$points", 0] } } } }]);
    const totalPoints = activePointsResponse && activePointsResponse[0] && activePointsResponse[0].total || 0;
    const expiredPoints = activePointsResponse && activePointsResponse[0] && activePointsResponse[0].expired || 0;
    const usedPointsResponse = await Redeem.aggregate([{ $group: { _id: null, total: { $sum: "$points" }, expired: { $sum: { $cond: [{ $lt: ["$pointsExpiration", new Date()] }, "$points", 0] } } } }]);
    const totalUsedPoints = usedPointsResponse && usedPointsResponse[0] && usedPointsResponse[0].total || 0;

    const store = res.locals.store;
    res.render('dashboard', { userCount, totalPoints, expiredPoints, totalUsedPoints,store });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
