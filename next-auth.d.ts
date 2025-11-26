// /next-auth.d.ts

import 'next-auth';
import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

// 1. Estendemos o tipo User padrão
declare module 'next-auth' {
  interface User {
    id: string; //  Agora o TS sabe que o User tem ID
    role: string;
    nome: string; 
  }

  interface Session {
    user: {
      id: string; //  Agora a Sessão tem ID acessível
      role: string;
      nome: string; 
    } & DefaultSession['user']; 
  }
}

// 2. Estendemos o tipo JWT (JSON Web Token)
declare module 'next-auth/jwt' {
  interface JWT {
    id: string; 
    role: string;
    nome: string; 
  }
}