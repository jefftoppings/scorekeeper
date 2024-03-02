export interface MexicanTrainGameConfig {
  id?: string;
  readableId?: string;
  created?: Date;
  players?: string[];
  currentRound?: number;
  scores?: { [key: string]: { round: number; total: number }[] };
}
