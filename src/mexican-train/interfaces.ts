export interface MexicanTrainGameConfig {
  id?: string;
  readableId?: string;
  created?: Date;
  players?: string[];
  currentRound?: number;
  scores?: ScoresByPlayer;
}

export interface ScoresByPlayer {
  [key: string]: RoundScore[];
}

export interface RoundScore {
  round: number;
  total: number;
}
