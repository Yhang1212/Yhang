export const sendVerificationEmail = async (email: string, token: string) => {
  console.log(`[mail] Verification email for ${email}: /verify-email?token=${token}`);
  return true;
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  console.log(`[mail] Password reset for ${email}: /reset-password?token=${token}`);
  return true;
};
