export type AppTheme = "light" | "dark" | "system";
export type AccountStatus =
  | "all_good"
  | "limited"
  | "very_limited"
  | "at_risk"
  | "banned"
  | "perma_banned";
export type OnlineStatus = "active" | "away" | "dnd";
export interface SettingsResponse {
  id: string;
  userId: string;
  devMode: boolean;
  debugMode: boolean;
  showReprocessing: boolean;

  visibleStreak: boolean;
  allSetsPrivate: boolean;
  shareGroupProgress: boolean;
  allowGroupInvites: boolean;
  autoGroupParticipation: boolean;
  experimentalGroupFeatures: boolean;
  theme: AppTheme;

  emailNotifications: boolean;
  inAppNotifications: boolean;
  progressNotifications: boolean;
  streakReminders: boolean;
  groupNotifications: boolean;

  accountStatus: AccountStatus;
  onlineStatus: OnlineStatus;
}

export interface UpdateSettings {
  devMode?: boolean;
  debugMode?: boolean;
  showReprocessing?: boolean;

  visibleStreak?: boolean;
  allSetsPrivate?: boolean;
  shareGroupProgress?: boolean;
  allowGroupInvites?: boolean;
  autoGroupParticipation?: boolean;
  experimentalGroupFeatures?: boolean;
  theme?: AppTheme;

  emailNotifications?: boolean;
  inAppNotifications?: boolean;
  progressNotifications?: boolean;
  streakReminders?: boolean;
  groupNotifications?: boolean;

  accountStatus?: AccountStatus;
  onlineStatus?: OnlineStatus;
}
