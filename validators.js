export const validateRegisterForm = ({ name, email, password }) => {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email address';
  if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters';
  return errors;
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  return errors;
};

export const validateTaskForm = ({ title }) => {
  const errors = {};
  if (!title || !title.trim()) errors.title = 'Title is required';
  else if (title.trim().length > 120) errors.title = 'Title cannot exceed 120 characters';
  return errors;
};

// Extracts a readable message from an axios error response
export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  return error?.response?.data?.message || fallback;
};
