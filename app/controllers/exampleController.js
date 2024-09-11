const db = require("../models");
// const Model = db.Model;
// const { Op } = require("sequelize");

exports.refactoreMe1 = async (req, res) => {
  // function ini sebenarnya adalah hasil survey dri beberapa pertnayaan, yang mana nilai dri jawaban tsb akan di store pada array seperti yang ada di dataset
  try {
    const query = `
      SELECT
        COALESCE(AVG(values[1]), 0) AS totalIndex1,
        COALESCE(AVG(values[2]), 0) AS totalIndex2,
        COALESCE(AVG(values[3]), 0) AS totalIndex3,
        COALESCE(AVG(values[4]), 0) AS totalIndex4,
        COALESCE(AVG(values[5]), 0) AS totalIndex5,
        COALESCE(AVG(values[6]), 0) AS totalIndex6,
        COALESCE(AVG(values[7]), 0) AS totalIndex7,
        COALESCE(AVG(values[8]), 0) AS totalIndex8,
        COALESCE(AVG(values[9]), 0) AS totalIndex9,
        COALESCE(AVG(values[10]), 0) AS totalIndex10
      FROM "surveys";
    `;

    const data = await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT });

    const totalIndex = [
      +data[0].totalindex1,
      +data[0].totalindex2,
      +data[0].totalindex3,
      +data[0].totalindex4,
      +data[0].totalindex5,
      +data[0].totalindex6,
      +data[0].totalindex7,
      +data[0].totalindex8,
      +data[0].totalindex9,
      +data[0].totalindex10,
    ];

    const response = {
      statusCode: 200,
      success: true,
      data: totalIndex,
    }

    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      success: false,
      message: "Internal server error",
    });
  }
};

exports.refactoreMe2 = async (req, res) => {
  // function ini untuk menjalakan query sql insert dan mengupdate field "dosurvey" yang ada di table user menjadi true, jika melihat data yang di berikan, salah satu usernnya memiliki dosurvey dengan data false
  try {
    const { userId, values } = req.body
    const saveSurveyQuery = `
      INSERT INTO "surveys" ("userId", "values", "createdAt", "updatedAt")
      VALUES (:userId, :values, NOW(), NOW())
      RETURNING *;
    `;
    
    const updateUserQuery = `
      UPDATE "users"
      SET "dosurvey" = true, "updatedAt" = NOW()
      WHERE "id" = :userId;
    `;

    // Mulai transaksi untuk memastikan data konsisten
    await db.sequelize.transaction(async (t) => {

      // Insert ke tabel Survey
      const surveyResult = await db.sequelize.query(saveSurveyQuery, {
        replacements: { userId, values: `{${values.join(',')}}` },
        type: db.sequelize.QueryTypes.INSERT,
        transaction: t,
      });

      // Update tabel User untuk mengubah dosurvey menjadi true
      await db.sequelize.query(updateUserQuery, {
        replacements: { userId },
        type: db.sequelize.QueryTypes.UPDATE,
        transaction: t,
      });

      const data = surveyResult[0][0]

      const response = {
        statusCode: 201,
        message: "Survey sent successfully!",
        success: true,
        data,
      }

      res.status(201).send(response);
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Cannot post survey.",
      success: false,
    });
  }
};

exports.callmeWebSocket = (req, res) => {
  // do something
};

exports.getData = (req, res) => {
  // do something
};
