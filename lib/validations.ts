// Validaciones comunes
export const validateDNI = (dni: string): boolean => {
  // Validar DNI argentino (7-8 dígitos)
  const dniRegex = /^\d{7,8}$/
  return dniRegex.test(dni)
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  // Validar teléfono argentino
  const phoneRegex = /^(\+54|0)?[\s-]?(\d{2,4})[\s-]?\d{4}[\s-]?\d{4}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

export const validatePassword = (
  password: string,
): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []

  if (password.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres")
  }

  if (!/[A-Za-z]/.test(password)) {
    errors.push("La contraseña debe contener al menos una letra")
  }

  if (!/\d/.test(password)) {
    errors.push("La contraseña debe contener al menos un número")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return start <= end
}

export const validateAge = (birthDate: string, minAge = 0, maxAge = 120): boolean => {
  const today = new Date()
  const birth = new Date(birthDate)
  const age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= minAge && age - 1 <= maxAge
  }

  return age >= minAge && age <= maxAge
}

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "")
}

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return `${fieldName} es requerido`
  }
  return null
}
