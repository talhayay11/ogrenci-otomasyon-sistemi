// Parola güvenlik kuralları ve validasyon fonksiyonları

export const passwordRequirements = {
  minLength: 8,
  requireDigit: true,
  requireLowercase: true,
  requireUppercase: true,
  requireNonAlphanumeric: true,
  requiredUniqueChars: 1
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Parola gereklidir');
    return { isValid: false, errors };
  }
  
  if (password.length < passwordRequirements.minLength) {
    errors.push(`En az ${passwordRequirements.minLength} karakter olmalıdır`);
  }
  
  if (passwordRequirements.requireDigit && !/\d/.test(password)) {
    errors.push('En az bir rakam içermelidir');
  }
  
  if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('En az bir küçük harf içermelidir');
  }
  
  if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('En az bir büyük harf içermelidir');
  }
  
  if (passwordRequirements.requireNonAlphanumeric && !/[^a-zA-Z0-9]/.test(password)) {
    errors.push('En az bir özel karakter içermelidir (!@#$%^&* vb.)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getPasswordRequirementsText = () => {
  return [
    `En az ${passwordRequirements.minLength} karakter`,
    'En az bir rakam (0-9)',
    'En az bir küçük harf (a-z)',
    'En az bir büyük harf (A-Z)',
    'En az bir özel karakter (!@#$%^&* vb.)'
  ];
};

export const generateSecurePassword = () => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const special = '!@#$%^&*';
  
  let password = '';
  
  // En az bir karakter her kategoriden
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Kalan karakterleri rastgele ekle
  const allChars = lowercase + uppercase + digits + special;
  for (let i = 4; i < passwordRequirements.minLength; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Karakterleri karıştır
  return password.split('').sort(() => Math.random() - 0.5).join('');
};
