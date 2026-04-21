const schoolModel = require('../models/schoolModel');
const { calculateDistance } = require('../utils/distance');

function createValidationError(message) {
  const error = new Error(message);
  error.isValidation = true;
  return error;
}

function validateAddSchoolInput({ name, address, latitude, longitude }) {
  const missingRequiredFields = [name, address, latitude, longitude].some(
    (value) => value === undefined || value === null || value === ''
  );

  if (missingRequiredFields) {
    throw createValidationError('All fields are required');
  }

  const normalizedName = typeof name === 'string' ? name.trim() : name;
  const normalizedAddress = typeof address === 'string' ? address.trim() : address;

  const errors = [];

  if (
    typeof normalizedName !== 'string' ||
    normalizedName.length === 0
  ) {
    errors.push('name must be a non-empty string');
  }

  if (
    typeof normalizedAddress !== 'string' ||
    normalizedAddress.length === 0
  ) {
    errors.push('address must be a non-empty string');
  }

  if (
    typeof latitude !== 'number' ||
    isNaN(latitude) ||
    latitude < -90 ||
    latitude > 90
  ) {
    errors.push('latitude must be a number between -90 and 90');
  }

  if (
    typeof longitude !== 'number' ||
    isNaN(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    errors.push('longitude must be a number between -180 and 180');
  }

  if (errors.length > 0) {
    throw createValidationError(errors.join('; '));
  }

  return {
    name: normalizedName,
    address: normalizedAddress,
    latitude,
    longitude,
  };
}

async function addSchool(input) {
  const validatedInput = validateAddSchoolInput(input);
  return schoolModel.addSchool(validatedInput);
}

function validateListSchoolsInput({ latitude, longitude, limit }) {
  const errors = [];

  if (latitude === undefined || latitude === null || latitude === '') {
    errors.push('latitude is required');
  } else if (
    typeof latitude !== 'number' ||
    isNaN(latitude) ||
    latitude < -90 ||
    latitude > 90
  ) {
    errors.push('latitude must be a number between -90 and 90');
  }

  if (longitude === undefined || longitude === null || longitude === '') {
    errors.push('longitude is required');
  } else if (
    typeof longitude !== 'number' ||
    isNaN(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    errors.push('longitude must be a number between -180 and 180');
  }

  if (limit !== undefined) {
    if (!Number.isInteger(limit) || limit <= 0) {
      errors.push('limit must be a positive integer');
    }
  }

  if (errors.length > 0) {
    throw createValidationError(errors.join('; '));
  }

  return {
    latitude,
    longitude,
    limit,
  };
}

async function listSchools({ latitude, longitude, limit }) {
  const validatedInput = validateListSchoolsInput({
    latitude,
    longitude,
    limit,
  });

  const schools = await schoolModel.getAllSchools();

  const schoolsWithDistance = schools.map((school) => ({
    ...school,
    distance: calculateDistance(
      validatedInput.latitude,
      validatedInput.longitude,
      school.latitude,
      school.longitude
    ),
  }));

  schoolsWithDistance.sort((a, b) => a.distance - b.distance);

  if (validatedInput.limit !== undefined) {
    return schoolsWithDistance.slice(0, validatedInput.limit);
  }

  return schoolsWithDistance;
}

module.exports = {
  addSchool,
  listSchools,
};
