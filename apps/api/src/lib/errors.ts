export type ErrorCode =
  | 'VALIDATION_ERROR' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND'
  | 'CONFLICT' | 'RATE_LIMITED' | 'INTERNAL' | 'AUTH_INVALID_OTP'
  | 'AUTH_OTP_EXPIRED' | 'AUTH_TOO_MANY_ATTEMPTS' | 'ACCOUNT_NOT_ACTIVE'
  | 'PROFILE_INCOMPLETE' | 'UNDERAGE' | 'REFERRAL_INVALID'
  | 'REFERRAL_LIMIT_REACHED' | 'JOB_NOT_OPEN' | 'JOB_DEADLINE_PASSED'
  | 'ALREADY_APPLIED' | 'TIME_CLASH' | 'AREA_NOT_ELIGIBLE' | 'NO_SLOTS'
  | 'OFFER_EXPIRED' | 'NOT_ASSIGNED' | 'CHECKIN_TOO_EARLY'
  | 'CHECKIN_TOO_LATE' | 'OUT_OF_RANGE' | 'MOCK_LOCATION'
  | 'GPS_ACCURACY_LOW' | 'ALREADY_CHECKED_IN' | 'NOT_CHECKED_IN'
  | 'NOT_TL' | 'ATTENDANCE_INCOMPLETE' | 'FINALIZE_ITEMS_MISMATCH'
  | 'EVENT_NOT_STARTED' | 'INVALID_STATE' | 'AMOUNT_EXCEEDS_BALANCE'
  | 'UPLOAD_KEY_INVALID';

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly httpStatus: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
