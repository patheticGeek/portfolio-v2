import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: undefined | PrismaClient
}

const prisma: PrismaClient = global.prisma || new PrismaClient()

if (import.meta.env.DEV) global.prisma = prisma

export default prisma
