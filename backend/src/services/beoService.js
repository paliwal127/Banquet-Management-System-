const BEO = require("../models/BEO");
const BEOVersion =
require("../models/BEOVersion");

const createBEOWithVersion =
async (
  functionId,
  content
) => {

  const beo =
    await BEO.createBEO(
      functionId
    );

  await BEOVersion.createVersion(
    beo.id,
    1,
    content
  );

  return beo;
};

module.exports = {
  createBEOWithVersion
};