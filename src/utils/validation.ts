type FieldName = 
                | 'first_name'
                | 'second_name'
                | 'login' 
                | 'email'
                | 'password' 
                | 'phone'
                | 'message'
                | 'display_name'
                | 'old_password'
                | 'new_password'
                | 'repeat_password';

const nameRule = {
  regex: /^[A-ZА-ЯЁ][a-zA-Zа-яА-ЯёЁ-]*$/,
  error: 'Поле должно начинаться с заглавной буквы, без пробелов и цифр, допускается дефис.',
};

const passwordRule = {
  regex: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
  error: 'Пароль должен содержать 8–40 символов, минимум одну заглавную букву и одну цифру.',
};

const validationRules: Record<FieldName, { regex: RegExp; error: string;}> = {
  first_name: nameRule,
  second_name: nameRule,
  login: {
    regex: /^(?!\d+$)[a-zA-Z0-9_-]{3,20}$/,
    error: 'Логин должен содержать 3–20 символов, латиницей, не только цифры, без пробелов, допустимы дефис и подчёркивание.',
  },
  email: {
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]+$/,
    error: 'Email должен содержать @ и точку после него, допустима только латиница.',
  },
  password: passwordRule,
  phone: {
    regex: /^\+?\d{10,15}$/,
    error: 'Телефон должен содержать 10–15 цифр и может начинаться с плюса.',
  },
  message: {
    regex: /^(?!\s*$).+/,
    error: 'Поле не должно быть пустым.',
  },
  display_name: nameRule,
  old_password: passwordRule,
  new_password: passwordRule,
  repeat_password: passwordRule,
};

export function validateField(name: string, value: string): string | null {
  if (value.trim() === '') {
    return 'Поле обязательно для заполнения.';
  }

  if (!(name in validationRules)) {
    return null;
  }

  const rule = validationRules[name as FieldName];
  return rule.regex.test(value) ? null : rule.error;
}

export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string,
): string | null {
  if (password !== confirmPassword) {
    return 'Пароли не совпадают.';
  }

  return null;
}
