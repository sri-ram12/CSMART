"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.getPrismaClient = getPrismaClient;
const client_1 = require("@prisma/client");
const adapter_libsql_1 = require("@prisma/adapter-libsql");
const client_2 = require("@libsql/client");
const globalForPrisma = globalThis;
const TURSO_DEFAULT_URL = 'libsql://csmart-sri-ram12.aws-ap-south-1.turso.io';
const TURSO_DEFAULT_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTU3NjE2MjUsImlkIjoiMDFhMjFiYmItMmIwMS03YmIzLTk2MzEtNGQ2MTg5MDQ0ZTk4Iiwia2lkIjoiZGNkNG1GVVpSdVlJUDRXMXB5eHFGaXlZWWlaTlI0akhhMXRyYnpCbmdGYyIsInJpZCI6IjAzOTU5NjdhLWE1MmQtNGY0NS1hMzE3LTAyY2UwMzI5ZWMyMSJ9.nUcDyHXH6MsbDoYRGyV5JNSoUzLCPAtg_pZhHuRRxttzp4VoOdf8Zn-JVeHyJogDKOGP3zCNcwKWV9WT9ErwAQ';
function createPrismaClient() {
    const tursoUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || TURSO_DEFAULT_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN || TURSO_DEFAULT_TOKEN;
    if (tursoUrl.startsWith('libsql:') || tursoUrl.startsWith('https:')) {
        const libsql = (0, client_2.createClient)({
            url: tursoUrl,
            authToken: authToken,
        });
        const adapter = new adapter_libsql_1.PrismaLibSQL(libsql);
        return new client_1.PrismaClient({
            adapter,
            log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
        });
    }
    return new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
}
let _prismaInstance = null;
let _initError = null;
function getPrismaClient() {
    if (_prismaInstance)
        return _prismaInstance;
    if (_initError)
        throw _initError;
    try {
        _prismaInstance = globalForPrisma.prisma || createPrismaClient();
        if (process.env.NODE_ENV !== 'production')
            globalForPrisma.prisma = _prismaInstance;
        return _prismaInstance;
    }
    catch (err) {
        _initError = err;
        console.error('Failed to initialize Prisma client:', err);
        throw err;
    }
}
exports.prisma = new Proxy({}, {
    get(_target, prop) {
        const client = getPrismaClient();
        const value = client[prop];
        if (typeof value === 'function') {
            return value.bind(client);
        }
        return value;
    },
});
exports.default = exports.prisma;
