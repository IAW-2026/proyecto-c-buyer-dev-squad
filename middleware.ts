import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: ["/api/:path*", "/((?!.*\\..*|_next).*)"],
};
//fue creado x este error
/*

Clerk: auth() was called but Clerk can't detect usage of clerkMiddleware(). Please ensure the following:
- Your middleware or proxy file exists at ./middleware.(ts|js) or proxy.(ts|js)
- clerkMiddleware() is used in your Next.js middleware or proxy file.
- Your middleware or proxy matcher is configured to match this route or page.
- If you are using the src directory, make sure the middleware or proxy file is inside of it.
El middleware hace que Clerk pueda saber:

quién está usando la app*/