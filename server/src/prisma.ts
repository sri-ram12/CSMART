import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const TURSO_DEFAULT_URL = 'libsql://csmart-sri-ram12.aws-ap-south-1.turso.io';
const TURSO_DEFAULT_TOKEN =
  'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTU3NjE2MjUsImlkIjoiMDFhMjFiYmItMmIwMS03YmIzLTk2MzEtNGQ2MTg5MDQ0ZTk4Iiwia2lkIjoiZGNkNG1GVVpSdVlJUDRXMXB5eHFGaXlZWWlaTlI0akhhMXRyYnpCbmdGYyIsInJpZCI6IjAzOTU5NjdhLWE1MmQtNGY0NS1hMzE3LTAyY2UwMzI5ZWMyMSJ9.nUcDyHXH6MsbDoYRGyV5JNSoUzLCPAtg_pZhHuRRxttzp4VoOdf8Zn-JVeHyJogDKOGP3zCNcwKWV9WT9ErwAQ';

function createPrismaClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || TURSO_DEFAULT_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN || TURSO_DEFAULT_TOKEN;

  if (tursoUrl.startsWith('libsql:') || tursoUrl.startsWith('https:')) {
    const libsql = createClient({
      url: tursoUrl,
      authToken: authToken,
    });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

let _prismaInstance: PrismaClient | null = null;
let _initError: Error | null = null;

export function getPrismaClient(): PrismaClient {
  if (_prismaInstance) return _prismaInstance;
  if (_initError) throw _initError;

  try {
    _prismaInstance = globalForPrisma.prisma || createPrismaClient();
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = _prismaInstance;
    return _prismaInstance;
  } catch (err: any) {
    _initError = err;
    console.error('Failed to initialize Prisma client:', err);
    throw err;
  }
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

export default prisma;
