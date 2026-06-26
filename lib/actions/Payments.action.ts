'use server'
import { auth } from '@clerk/nextjs/server'
import { generatePaymentToken } from '@/lib/paymentToken'

export async function getPaymentsUrl(orderId: string, theme?: string): Promise<string> {
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error('No autenticado')

  const token = await generatePaymentToken({ clerkId, orderId })
  const themeParam = theme ? `&theme=${encodeURIComponent(theme)}` : ""
  return `${process.env.NEXT_PUBLIC_PAYMENTS_URL}/${orderId}?token=${token}${themeParam}`
}
