declare module 'passport-local' {
  import { Strategy } from 'passport'
  interface Callback {
    (err: Error): void
    (err: null, user: false, reason: { message: string }): void
    (err: null, user: Object): void
  }

  interface Constructor {
    new (
      validate: (username: string, password: string, cb: Callback) => void,
    ): Strategy
  }

  const LocalStrategy: Constructor

  export default LocalStrategy
}
