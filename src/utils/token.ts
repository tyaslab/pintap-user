const jwt = require('jsonwebtoken')

export const generateAccessToken = async (id: string, isAdmin: boolean, expiresAt: number) => {
  return jwt.sign({id, isAdmin, exp: expiresAt}, process.env.SECRET_KEY)
}

export const decodeAccessToken = async (accessToken: string) => {
  return jwt.verify(accessToken, process.env.SECRET_KEY)
}