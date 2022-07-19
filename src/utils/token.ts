import jwt from 'jsonwebtoken'

export const generateAccessToken = async (id: string, isAdmin: boolean, expiresAt: number) => {
  const secretKey: any = process.env.SECRET_KEY
  return jwt.sign({id, isAdmin, exp: expiresAt}, secretKey)
}

export const decodeAccessToken = async (accessToken: string) => {
  const secretKey: any = process.env.SECRET_KEY
  return jwt.verify(accessToken, secretKey)
}