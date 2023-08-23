# Sus - good old fashioned session cookies are back?

Auth in node/express is not as nice out-of-the-box as it could be.

Cookies are more secure than they've ever been, with modern browsers supporting
all these options

- secure only send this cookie over https
- sameSite=lax don't send this cookie for image etc.
- httpOnly don't allow JavaScript access to the cookie

With these options in place, keeping an auth token or session id in a cookie is
[safer than localStorage](https://tkacz.pro/how-to-securely-store-jwt-tokens)
and will Just Work with react-router's loaders etc.

## Passportjs

Passportjs is the most popular way to handle authentication in express apps, and
yet it is not very actively developed (the main developer works for Auth0 now), and
still uses a major version < 1.

The docs for passport are very example based, like this one that I've based my
setup off [Todos express password (example
app)](https://github.com/passport/todos-express-password)

J Walton has written up his notes as [Passport: The hidden
manual](https://github.com/jwalton/passport-api-docs#passportauthorizestrategyname-options-callback)

## Cookie Session

I'm using `cookie-session` instead of `express-session`, because I don't really
want a "rich" session with messages and stuff (more useful for a SSR app), I
just want enough to identify the user.

Unfortunately `cookie-session` is incompatible with `passport@latest` so I'm
pinned to `passport@^0.5`. The alternative is to patch a couple of methods onto
the session object in a middleware.

- [The issue on passport](https://github.com/jaredhanson/passport/issues/904#issuecomment-1135119308)

## Passport local

The strategy for authenticating via. username and password. Works great but the `@types/passport-local`
package seems broken, so you don't really get good types

## Important Environment Variables

- COOKIE_SECRET a secret to sign keys with
- ADMIN_PW when an admin user is created in the seeds, use this PW
- NODE_ENV in production, we should use 'secure' cookies, i.e. we should only
  send the session cookie over https
