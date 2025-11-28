// /next-auth.d.ts

import 'next-auth';
import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

// Estendemos o tipo User padrão
declare module 'next-auth' {
  interface User {
    id: string; 
    role: string;
    nome: string; 
  }

  interface Session {
    user: {
      id: string; 
      role: string;
      nome: string; 
    } & DefaultSession['user']; 
  }
}

// Tipo JWT (JSON Web Token)
declare module 'next-auth/jwt' {
  interface JWT {
    id: string; 
    role: string;
    nome: string; 
  }
}