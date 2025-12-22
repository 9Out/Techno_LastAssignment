// types/hapi.d.ts
import "@hapi/hapi";

declare module "@hapi/hapi" {
  interface AuthCredentials {
    id: string;
    username: string;
    email: string;
  }
}