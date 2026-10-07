export const ROUTES = {
  home: '/',
  login: '/auth/login',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  verifyEmail: '/auth/verify-email',
  verifyEmailPending: '/auth/verify-email-pending',
  workflows: '/workflows',
  workflowsDemo: '/workflows/demo',
  workflowDetail: (id: string) => `/workflows/${id}`,
} as const;
