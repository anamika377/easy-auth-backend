/* eslint-disable @typescript-eslint/no-unused-vars */
export function removeSensitiveFields(user: any) {
  // Destructure and exclude password (intentionally not used)
  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
}
/* eslint-enable @typescript-eslint/no-unused-vars */
