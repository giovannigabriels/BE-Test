const db = require("../models")
const { QueryTypes } = require("sequelize");

const authorizationAdmin = async (req, res, next) => {
  try {
    const { user } = req

    const query = `
        SELECT "positionTitle" as role FROM "users" WHERE "id" = :idUser
    `

    const [dataUser] = await db.sequelize.query(query,
        { 
            replacements: { idUser: user?.id },
            type: QueryTypes.SELECT 
        }
    );

    if (!dataUser?.role || dataUser?.role !== "admin") {
        return res.status(403).json({
            statusCode: 403,
            success: false,
            message: 'Forbidden Access',
          });
    }
    next();
  } catch (error) {
    res.status(500).send({
        success: false,
        statusCode: 500,
        message: "Internal server error",
    });
  }
};

module.exports = authorizationAdmin ;