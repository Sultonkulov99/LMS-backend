export const uzMsg = {
  isNotEmpty: (field: string) => `${field} kiritilishi shart`,
  isString: (field: string) => `${field} matn ko'rinishida bo'lishi kerak`,
  isNumber: (field: string) => `${field} raqam bo'lishi kerak`,
  isNumberString: (field: string) => `${field} raqamlardan iborat bo'lishi kerak`,
  isInt: (field: string) => `${field} butun son bo'lishi kerak`,
  isBoolean: (field: string) => `${field} true yoki false qiymatida bo'lishi kerak`,
  isBooleanString: (field: string) => `${field} 'true' yoki 'false' qiymatida bo'lishi kerak`,
  isUUID: (field: string) => `${field} noto'g'ri formatda (UUID bo'lishi kerak)`,
  isUrl: (field: string) => `${field} to'g'ri havola (URL) ko'rinishida bo'lishi kerak`,
  isEnum: (field: string) => `${field} noto'g'ri qiymatga ega`,
  isArray: (field: string) => `${field} ro'yxat (array) ko'rinishida bo'lishi kerak`,
  isIn: (field: string, values: readonly unknown[]) =>
    `${field} quyidagi qiymatlardan biri bo'lishi kerak: ${values.join(', ')}`,
  isDateString: (field: string) =>
    `${field} sana formatida bo'lishi kerak (masalan: 2024-01-01)`,
  isJWT: (field: string) => `${field} noto'g'ri token formatida`,
  minLength: (field: string, len: number) =>
    `${field} kamida ${len} ta belgidan iborat bo'lishi kerak`,
  maxLength: (field: string, len: number) =>
    `${field} ko'pi bilan ${len} ta belgidan iborat bo'lishi kerak`,
  min: (field: string, val: number) => `${field} kamida ${val} bo'lishi kerak`,
  max: (field: string, val: number) => `${field} ko'pi bilan ${val} bo'lishi kerak`,
  arrayMinSize: (field: string, size: number) =>
    `${field} kamida ${size} ta elementdan iborat bo'lishi kerak`,
  arrayMaxSize: (field: string, size: number) =>
    `${field} ko'pi bilan ${size} ta elementdan iborat bo'lishi kerak`,
  matches: (field: string) => `${field} noto'g'ri formatda kiritildi`,
};
