export interface MatchConfig {
  competition: string;
  date: string; // YYYY-MM-DD
  venue: string;
  homeTeam: string;
  awayTeam: string;
  halfDuration: number; // minutes per half
}

export interface TagConfig {
  id: number; // 1-16
  name: string;
  color: string; // hex
  enabled: boolean;
}

// Field names are snake_case to match the PlayTrace export spec 1:1
// (see Export-Format-Reference.md) so events serialize without mapping.
export interface EventRecord {
  tag_id: number;
  tag_name: string;
  timestamp_absolute: string; // DD/MM/YY HH:MM:SS
  time_period: string; // "23:45 1T" | "45+2 1T"
  time_match: string; // "68:30 (2T)"
  time_continuous: string; // "71:30"
}

export type MatchPhase =
  | 'idle'
  | 'first_half'
  | 'half_time'
  | 'second_half'
  | 'ended';

export type Period = 1 | 2;

export type RootStackParamList = {
  Home: undefined;
  MatchSetup: undefined;
  TagConfig: undefined;
  Timer: undefined;
  Export: undefined;
};
