'use server'
import { auth } from '@clerk/nextjs/server'
import { generateShipmentToken } from '@/lib/shipmentToken'

export async function getPaymentsUrl(orderId: string): Promise<string> {
  const { userId } = await auth()
  if (!userId) throw new Error('No autenticado')

  const token = await generateShipmentToken({ userId, orderId })
  return `${process.env.NEXT_PUBLIC_PAYMENTS_URL}/${orderId}?token=${token}`
}
