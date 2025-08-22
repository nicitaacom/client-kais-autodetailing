/**
 *
 * @param phone +447525996949
 * @returns +44 752 599 69 49
 */
export function formatPhoneNumber(phone: string): string {
  return phone.replace(/(\+\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5")
}
