import {ReplaceVariable} from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { firebot, logger } from "./main";

export interface LeaderboardStats {
    initialized: boolean;
    name: string;
    place: number;
    points: number;
    wins: number;
    games: number;
    lastUpdated: number;
}

export const leaderboard: LeaderboardStats = {
    initialized: false,
    name: "",
    place: -1,
    points: -1,
    wins: 0,
    games: 0,
    lastUpdated: 0
};

export function update(data: LeaderboardStats) {
    const pointsChanged = leaderboard.points !== data.points && leaderboard.points !== -1;
    const placeChanged = leaderboard.place !== data.place && leaderboard.place !== -1;
    const initialized = leaderboard.points === -1 && leaderboard.place === -1 && data.points !== -1 && data.place !== -1;

    // Update leaderboard data
    leaderboard.initialized = initialized;
    leaderboard.name = data.name;
    leaderboard.place = data.place;
    leaderboard.points = data.points;
    leaderboard.wins = data.wins;
    leaderboard.games = data.games;
    leaderboard.lastUpdated = data.lastUpdated;
    logger.debug(`Updated leaderboard data: ${JSON.stringify(leaderboard)}`);

    // Send events
    const { eventManager } = firebot.modules;

    if (pointsChanged || placeChanged) {
        eventManager.triggerEvent("riskLeaderboard", "riskLeaderboard_change_place_points", getLeaderboardAsRecord());
        logger.debug(`Triggered change event: riskLeaderboard_change_place_points`);

        if (pointsChanged) {
            eventManager.triggerEvent("riskLeaderboard", "riskLeaderboard_change_points", getLeaderboardAsRecord());
            logger.debug(`Triggered change event: riskLeaderboard_change_points`);
        }
        if (placeChanged) {
            eventManager.triggerEvent("riskLeaderboard", "riskLeaderboard_change_place", getLeaderboardAsRecord());
            logger.debug(`Triggered change event: riskLeaderboard_change_place`);
        }
    }
    if (initialized) {
        eventManager.triggerEvent("riskLeaderboard", "riskLeaderboard_initialized", getLeaderboardAsRecord());
        logger.debug(`Triggered initialized event: riskLeaderboard_initialized`);
    }
}

export function loadVariables() {
    const { replaceVariableManager } = firebot.modules;
    replaceVariableManager.registerReplaceVariable(riskLeaderboardVariable);
}

export function getLeaderboardAsRecord(): Record<string, unknown> {
    return {
        name: leaderboard.name,
        place: leaderboard.place,
        points: leaderboard.points,
        wins: leaderboard.wins,
        games: leaderboard.games,
        lastUpdated: leaderboard.lastUpdated
    };
}

export const riskLeaderboardVariable: ReplaceVariable = {
    definition: {
        description: "Risk leaderboard object.",
        handle: "riskLeaderboard",
        possibleDataOutput: ["object"],
        examples: [
            {
                description: "Player name",
                usage: "riskLeaderboard[name]"
            },
            {
                description: "Player place",
                usage: "riskLeaderboard[place]"
            },
            {
                description: "Player points",
                usage: "riskLeaderboard[points]"
            },
            {
                description: "Player wins",
                usage: "riskLeaderboard[wins]"
            },
            {
                description: "Player games",
                usage: "riskLeaderboard[games]"
            },
            {
                description: "Player last updated",
                usage: "riskLeaderboard[lastUpdated]"
            },
            {
                description: "Player losses (calculated)",
                usage: "riskLeaderboard[losses]"
            },
            {
                description: "Player win percent (calculated, returns integer 0-100)",
                usage: "riskLeaderboard[winPercent]"
            },
            {
                description: "Player win percent (calculated, returns float 0-1 with no rounding)",
                usage: "riskLeaderboard[winPercentRaw]"
            },
            {
                description: "Last updated time (in milliseconds since Epoch)",
                usage: "riskLeaderboard[lastUpdated]"
            },
            {
                description: "Rank (Novice, ..., Grandmaster)",
                usage: "riskLeaderboard[rank]"
            },
            {
                description: "Raw leaderboard object",
                usage: "riskLeaderboard"
            }
        ]
    },
    evaluator(_, ...args: string[]): string | number | object {
        if (args.length !== 1) {
            return leaderboard;
        }

        if (!leaderboard.initialized && args[0] !== "lastUpdated" && args[0] !== "name") {
            return "";
        }

        const key = args[0];
        switch (key) {
            case "name":
                return leaderboard.name;
            case "place":
                return leaderboard.place;
            case "points":
                return leaderboard.points;
            case "wins":
                return leaderboard.wins;
            case "games":
                return leaderboard.games;
            case "losses":
                return leaderboard.games - leaderboard.wins;
            case "winPercent":
                if (leaderboard.games === 0) {
                    return 0;
                }
                return Math.round((leaderboard.wins / leaderboard.games) * 100);
            case "winPercentRaw":
                if (leaderboard.games === 0) {
                    return 0;
                }
                return leaderboard.wins / leaderboard.games;
            case "lastUpdated":
                return leaderboard.lastUpdated;
            case "rank":
                if (leaderboard.points < 0) {
                    return "";
                } else if (leaderboard.points < 1000) {
                    return "Novice";
                } else if (leaderboard.points < 6000) {
                    return "Beginner";
                } else if (leaderboard.points < 11000) {
                    return "Intermediate";
                } else if (leaderboard.points < 16000) {
                    return "Expert";
                } else if (leaderboard.points < 26000) {
                    return "Master";
                }
                return "Grandmaster";

            default:
                return "";
        }
    }
};
