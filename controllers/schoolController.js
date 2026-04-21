const schoolService = require('../services/schoolService');

async function addSchool(req, res, next) {
  try {
    const { name, address, latitude, longitude } = req.body;

    const result = await schoolService.addSchool({
      name,
      address,
      latitude,
      longitude,
    });

    res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function listSchools(req, res, next) {
  try {
    const { latitude, longitude, limit } = req.query;

    const latitudeNum =
      latitude !== undefined && latitude !== '' ? Number(latitude) : undefined;
    const longitudeNum =
      longitude !== undefined && longitude !== ''
        ? Number(longitude)
        : undefined;
    const limitNum = limit === undefined ? undefined : Number(limit);

    const result = await schoolService.listSchools({
      latitude: latitudeNum,
      longitude: longitudeNum,
      limit: limitNum,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addSchool,
  listSchools,
};
