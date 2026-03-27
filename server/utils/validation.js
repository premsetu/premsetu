const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10,15}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const ALLOWED_GENDERS = new Set(["male", "female", "other"]);
const ALLOWED_MARITAL_STATUSES = new Set(["never married", "divorced", "widowed", ""]);

const toTrimmedString = (value, maxLength = 120) => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim().slice(0, maxLength);
};

const normalizeEmail = (value) => toTrimmedString(value, 120).toLowerCase();

const normalizePhone = (value) => String(value || "").replace(/\D/g, "").slice(0, 15);

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const calculateAge = (dateOfBirth) => {
  const dob = parseDate(dateOfBirth);

  if (!dob) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age;
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const validateRegistrationInput = (payload) => {
  const fullName = toTrimmedString(payload.fullName, 80);
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || "");
  const phone = normalizePhone(payload.phone);
  const gender = toTrimmedString(payload.gender, 20).toLowerCase();
  const dateOfBirth = parseDate(payload.dateOfBirth);
  const errors = [];

  if (!fullName || fullName.length < 3) {
    errors.push("Full name must be at least 3 characters long.");
  }

  if (!EMAIL_REGEX.test(email)) {
    errors.push("Please enter a valid email address.");
  }

  if (!PASSWORD_REGEX.test(password)) {
    errors.push("Password must be 8+ characters and include upper, lower, number, and special character.");
  }

  if (!PHONE_REGEX.test(phone)) {
    errors.push("Phone number must contain 10 to 15 digits.");
  }

  if (!ALLOWED_GENDERS.has(gender)) {
    errors.push("Please select a valid gender.");
  }

  if (!dateOfBirth) {
    errors.push("Please enter a valid date of birth.");
  } else if ((calculateAge(dateOfBirth) || 0) < 18) {
    errors.push("Users must be at least 18 years old.");
  }

  return {
    errors,
    data: {
      fullName,
      email,
      password,
      phone,
      gender,
      dateOfBirth
    }
  };
};

const validateLoginInput = (payload) => {
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || "");
  const errors = [];

  if (!EMAIL_REGEX.test(email)) {
    errors.push("Please enter a valid email address.");
  }

  if (!password) {
    errors.push("Password is required.");
  }

  return {
    errors,
    data: {
      email,
      password
    }
  };
};

const validateProfileUpdate = (payload) => {
  const errors = [];
  const data = {};

  if (payload.fullName !== undefined) {
    const fullName = toTrimmedString(payload.fullName, 80);
    if (!fullName || fullName.length < 3) {
      errors.push("Full name must be at least 3 characters long.");
    } else {
      data.fullName = fullName;
    }
  }

  if (payload.phone !== undefined) {
    const phone = normalizePhone(payload.phone);
    if (!PHONE_REGEX.test(phone)) {
      errors.push("Phone number must contain 10 to 15 digits.");
    } else {
      data.phone = phone;
    }
  }

  if (payload.gender !== undefined) {
    const gender = toTrimmedString(payload.gender, 20).toLowerCase();
    if (!ALLOWED_GENDERS.has(gender)) {
      errors.push("Please select a valid gender.");
    } else {
      data.gender = gender;
    }
  }

  if (payload.dateOfBirth !== undefined) {
    const dateOfBirth = parseDate(payload.dateOfBirth);
    if (!dateOfBirth) {
      errors.push("Please enter a valid date of birth.");
    } else if ((calculateAge(dateOfBirth) || 0) < 18) {
      errors.push("Users must be at least 18 years old.");
    } else {
      data.dateOfBirth = dateOfBirth;
    }
  }

  const textFields = [
    ["religion", 60],
    ["caste", 80],
    ["gotra", 80],
    ["motherTongue", 60],
    ["city", 60],
    ["state", 60],
    ["education", 80],
    ["profession", 80],
    ["annualIncome", 40],
    ["height", 30]
  ];

  textFields.forEach(([field, maxLength]) => {
    if (payload[field] !== undefined) {
      data[field] = toTrimmedString(payload[field], maxLength);
    }
  });

  if (payload.maritalStatus !== undefined) {
    const maritalStatus = toTrimmedString(payload.maritalStatus, 30).toLowerCase();
    if (!ALLOWED_MARITAL_STATUSES.has(maritalStatus)) {
      errors.push("Please select a valid marital status.");
    } else {
      data.maritalStatus = maritalStatus;
    }
  }

  if (payload.bio !== undefined) {
    const bio = toTrimmedString(payload.bio, 1000);
    if (bio.length > 1000) {
      errors.push("Bio must be 1000 characters or less.");
    } else {
      data.bio = bio;
    }
  }

  return { errors, data };
};

const sanitizeSuggestionFilters = (payload) => {
  const page = Math.max(1, Number(payload.page) || 1);
  const limit = Math.min(20, Math.max(1, Number(payload.limit) || 10));
  const minAge = Math.max(18, Number(payload.minAge) || 18);
  const maxAge = Math.min(80, Number(payload.maxAge) || 80);

  return {
    page,
    limit,
    minAge,
    maxAge,
    religion: toTrimmedString(payload.religion, 60),
    state: toTrimmedString(payload.state, 60),
    city: toTrimmedString(payload.city, 60),
    education: toTrimmedString(payload.education, 80),
    profession: toTrimmedString(payload.profession, 80)
  };
};

module.exports = {
  calculateAge,
  escapeRegex,
  normalizeEmail,
  sanitizeSuggestionFilters,
  validateLoginInput,
  validateProfileUpdate,
  validateRegistrationInput
};
