const bcrypt = require('bcrypt')


export const generatePassword = async (rawPassword: string) => {
  return await bcrypt.hash(rawPassword, 5)
}

export const comparePassword = async(rawPassword: string, password: string) => {
  return await bcrypt.compare(rawPassword, password)
}
