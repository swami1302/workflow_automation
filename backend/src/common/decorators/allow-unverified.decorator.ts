import { SetMetadata } from '@nestjs/common';

export const ALLOW_UNVERIFIED_KEY = 'allowUnverified';

// Marks a route as reachable by an authenticated-but-unverified user.
// JwtAuthGuard checks this to let e.g. resend-verification through.
export const AllowUnverified = () => SetMetadata(ALLOW_UNVERIFIED_KEY, true);
