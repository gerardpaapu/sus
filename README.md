# Sus

Just using a passport-local authentication strategy.

Cookies aren't as scary as they once were, nowadays we can set `secure; httpOnly; sameSite=Lax` and we're
protected from the usual cast of XSS and CSRF attacks without using any extra tokens

Keeping the auth in a cookie is:

1. [safer than localStorage](https://tkacz.pro/how-to-securely-store-jwt-tokens/#:~:text=Use%20cookies%20to%20store%20JWT,manually%20on%20frontend%20code%20anymore.)
2. Will work well with react-router's loaders
3. Is totally fine :shrug:

The docs for passport are a bit yikers, here's some links:

[Passport: The hidden manual](https://github.com/jwalton/passport-api-docs#passportauthorizestrategyname-options-callback)
[Todos express password (example app)](https://github.com/passport/todos-express-password)
