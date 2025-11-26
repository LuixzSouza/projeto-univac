// src/lib/formatters.ts

// 1. Formata CPF: 000.000.000-00
export const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '') // Remove tudo o que não é dígito
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos de novo (para o segundo bloco de números)
    .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca um hífen entre o terceiro e o quarto dígitos
    .replace(/(-\d{2})\d+?$/, '$1') // Impede de digitar mais de 11 números
}

// 2. Remove formatação (para salvar no banco limpo: 12345678900)
export const normalizeToDigits = (value: string) => {
  return value.replace(/\D/g, '')
}

// 3. Formata Texto (Primeira Letra Maiúscula)
export const formatTitleCase = (value: string) => {
  return value.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// 4. Formatar Registros
export const formatRegistro = (value: string) => {
  return value
    .replace(/\D/g, '') // Remove tudo que NÃO é número
    .slice(0, 8)        // Limita a 8 dígitos (Ex: 99999999)
}