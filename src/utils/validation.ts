type FieldName = 
                'login' 
                | 'password' 
                | 'first_name'
                | 'second_name'
                | 'email'
                | 'phone'
                | 'message';

const validationRules: Record<FieldName, { regex: RegExp; error: string;}> = {
  first_name: {
    regex: /^[A-ZА-ЯЁ][a-zA-Zа-яА-ЯёЁ-]*$/,
    error: 'Имя должно начинаться с заглавной буквы, без пробелов и цифр, допускается дефис.',
  },
  second_name: {
    regex: /^[A-ZА-ЯЁ][a-zA-Zа-яА-ЯёЁ-]*$/,
    error: 'Фамилия должна начинаться с заглавной буквы, без пробелов и цифр, допускается дефис.',
  },
  login: {
    regex: /^(?!\d+$)[a-zA-Z0-9_-]{3,20}$/,
    error: 'Логин должен содержать 3–20 символов, латиницей, не только цифры, без пробелов, допустимы дефис и подчёркивание.',
  },
  email: {
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]+$/,
    error: 'Email должен содержать @ и точку после него, допустима только латиница.',
  },
  password: {
    regex: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
    error: 'Пароль должен содержать 8–40 символов, минимум одну заглавную букву и одну цифру.',
  },
  phone: {
    regex: /^\+?\d{10,15}$/,
    error: 'Телефон должен содержать 10–15 цифр и может начинаться с плюса.',
  },
  message: {
    regex: /^(?!\s*$).+/,
    error: 'Поле не должно быть пустым.',
  },
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