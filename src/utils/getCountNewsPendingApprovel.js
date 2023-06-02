const { getNewsPendingApprovel } = require("./news");

async function getCountNewsPendingApprovel() {
    const countNewsPendingApprovel = await getNewsPendingApprovel().countDocuments({});
    return countNewsPendingApprovel;
};

module.exports = { getCountNewsPendingApprovel };