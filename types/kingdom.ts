export interface Race {
  name: string;
  minLifespan: number;
  maxLifespan: number;
  maturityAge: number;
}

export interface Attributes {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface SpecialFeature {
  name: string;
  description: string;
  powerBonus: number;
}

export interface Noble {
  name: string;
  title: string;
  sobriquet: string;
  nobleHouse: NobleHouse;
  alive: boolean;
  notable: boolean;
  female: boolean;
  parent: Noble | null;
  children: Noble[];
  age: number;
  ageAtAscension: number;
  prestige: number;
  hadChildThisYear: boolean;
  race: Race;
  attributes: Attributes;
  specialFeatures: SpecialFeature[];
  power: number;
}

export interface NobleHouse {
  name: string;
  maxSize: number;
  deadNobles: Noble[];
  livingNobles: Noble[];
  power: number;
  leader: Noble | null;
  regent: Noble | null;
}

export interface Monument {
  name: string;
  yearBuilt: number;
  duration: number;
  resolution: string;
}

export interface War {
  opponent: OtherKingdom;
  duration: number;
  casualties: number;
  victories: number;
  defeats: number;
}

export interface OtherKingdom {
  name: string;
}

export interface Kingdom {
  nobleHouses: NobleHouse[];
  rulerList: Noble[];
  monumentList: Monument[];
  destroyedMonumentList: Monument[];
  warList: War[];
  otherKingdoms: OtherKingdom[];
  otherKingdomsAtPeace: OtherKingdom[];
  year: number;
  rulingHouse: NobleHouse | null;
  ruler: Noble | null;
}

export interface KingdomGeneratorConfig {
  yearsToSimulate: number;
  nobleHouseNames: string[];
  otherKingdoms: string[];
  maleNames: string[];
  femaleNames: string[];
  allowUsurping: boolean;
  inlineMonuments: boolean;
  inlineWars: boolean;
  inlineDeaths: boolean;
  inlineAscensions: boolean;
  inlinePower: boolean;
  nobleReviewPeriod: number;
}

export interface GenerationEvent {
  year: number;
  type: 'death' | 'ascension' | 'war' | 'monument' | 'review' | 'combat' | 'evolution';
  message: string;
  details?: {
    noble?: {
      name: string;
      title: string;
      race: string;
      age: number;
      attributes: Attributes;
      specialFeatures: string[];
    };
    warStats?: {
      casualties: number;
      victories: number;
      defeats: number;
    };
  };
}
