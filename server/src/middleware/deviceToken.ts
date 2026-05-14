import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'

declare global {
  namespace Express {
    interface Request {
      deviceToken?: string
    }
  }
}

export function deviceTokenMiddleware(req: Request, res: Response, next: NextFunction) {
  let token = req.headers['x-device-token'] as string | undefined

  if (!token || typeof token !== 'string' || token.length < 8) {
    token = uuidv4()
  }

  res.setHeader('X-Device-Token', token)
  res.setHeader('Access-Control-Expose-Headers', 'X-Device-Token')
  req.deviceToken = token
  next()
}
