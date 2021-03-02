export interface ParsedReport {
    tryID: string;
    fightName: string;
    fightIcon: string;
    permaLink?: string;
}

export interface PercentileReport {
    tryID: string;
    account: string;
    archetype: string;
    percentrankdps: number;
    percentrankmight: number;
    percentrankquickness: number;
    percentrankalacrity: number;
    percentrankfury: number;

}

export interface FinalReport {
    data: PercentileReport[];
    metadata: ParsedReport;
    
}

// # 725 Fury, 740 Might, 1187 Quickness, 30328 Alacrity

export const BOONS = [725, 740, 1187, 30328];
export const BOON_NAMES = ["fury", "might", "quickness", "alacrity"];

export const API_LINK = 'https://mapleia.pythonanywhere.com'
//         'https://mapleia.pythonanywhere.com/' 
