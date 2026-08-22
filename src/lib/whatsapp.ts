// Builds a WhatsApp "Click to Chat" deep link — no WhatsApp Business API
// or paid infrastructure required.
export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  const digitsOnly = phoneNumber.replace(/[^\d]/g, '')
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`
}

export function buildBookingMessage(params: {
  farmName: string
  visitorName: string
  requestedDate: string
  numPeople: number
  purpose: 'training' | 'tour' | 'both'
  note?: string
}): string {
  const { farmName, visitorName, requestedDate, numPeople, purpose, note } = params
  const lines = [
    `Hi! I'd like to book a visit to ${farmName}.`,
    `Name: ${visitorName}`,
    `Date: ${requestedDate}`,
    `People: ${numPeople}`,
    `Purpose: ${purpose}`,
  ]
  if (note) lines.push(`Note: ${note}`)
  return lines.join('\n')
}

export function buildOrderMessage(params: {
  farmName: string
  visitorName: string
  items: Array<{ name: string; qty: number; unit: string }>
}): string {
  const { farmName, visitorName, items } = params
  const lines = [
    `Hi! I'd like to order from ${farmName}'s farm shop.`,
    `Name: ${visitorName}`,
    'Items:',
    ...items.map((item) => `- ${item.name} x${item.qty} ${item.unit}`),
  ]
  return lines.join('\n')
}
