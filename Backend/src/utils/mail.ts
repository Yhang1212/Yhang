// Email delivery is intentionally disabled until SMTP or a transactional mail provider is configured.
// Never log verification or password reset tokens to application output.
export const sendVerificationEmail = async (_email: string, _token: string) => false;
export const sendPasswordResetEmail = async (_email: string, _token: string) => false;
