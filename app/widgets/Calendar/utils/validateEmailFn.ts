export const validateEmail = (email: string): true | string => {
  // Initial check for empty string or length exceeding 254 characters
  if (!email || email.length > 254) return "It's no email or it's length more then 254 characters"

  // Regex for basic email structure
  const basicEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/
  if (!basicEmailRegex.test(email)) {
    return "Email must follow basic email regex e.g email@example.com"
  }

  const emailParts = email.split("@")
  const emailPart = emailParts[0]
  const domainPart = emailParts[1]

  if (!domainPart || domainPart.trim() === "") return "Domain part must exist e.g email@domain.com"
  if (!emailPart || emailPart.trim() === "") return "Email part must exist e.g email@domain.com"

  if (emailPart.includes("..")) return "Email part of email should not contain .."
  if (domainPart.includes("..")) return "Domain part of email should not contain .."

  if (domainPart.startsWith(".") || domainPart.endsWith(".")) return "Domain part must not start or end with ."
  if (emailPart.startsWith(".") || emailPart.endsWith(".")) return "Email part must not start or end with ."

  if (emailParts.length !== 2) return "Email must have only 1 @"

  return true // If all checks are passed, it's a valid email
}
