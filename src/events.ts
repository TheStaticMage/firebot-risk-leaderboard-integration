import { firebot } from "./main";
import { getLeaderboardAsRecord } from "./variables";

const EVENT_SOURCE = {
    id: "riskLeaderboard",
    name: "Risk Leaderboard",
    description: "Events pertaining to the Risk leaderboard.",
    events: [
        {
            id: "riskLeaderboard_refresh",
            name: "Risk Leaderboard Refresh",
            description: "Triggered when the leaderboard data refreshes successfully.",
            manualMetadata: {},
            isIntegration: true
        },
        {
            id: "riskLeaderboard_change_place_points",
            name: "Risk Leaderboard Change",
            description: "Triggered when place and/or points changes from before.",
            manualMetadata: {},
            isIntegration: true
        },
        {
            id: "riskLeaderboard_change_place",
            name: "Risk Leaderboard Change (Place)",
            description: "Triggered when place changes from before.",
            manualMetadata: {},
            isIntegration: true
        },
        {
            id: "riskLeaderboard_change_points",
            name: "Risk Leaderboard Change (Points)",
            description: "Triggered when points change from before.",
            manualMetadata: {},
            isIntegration: true
        },
        {
            id: "riskLeaderboard_error",
            name: "Risk Leaderboard Error",
            description: "Triggered when an error occurs while refreshing the leaderboard data.",
            manualMetadata: {},
            isIntegration: true
        },
        {
            id: "riskLeaderboard_initialized",
            name: "Risk Leaderboard Initialized",
            description: "Triggered when the Risk leaderboard data is refreshed for the first time.",
            manualMetadata: {},
            isIntegration: true
        }
    ]
};

export function registerEvents() {
    const { eventManager } = firebot.modules;
    eventManager.registerEventSource(EVENT_SOURCE);
}

export async function triggerRefreshEvent() {
    const { eventManager } = firebot.modules;
    eventManager.triggerEvent("riskLeaderboard", "riskLeaderboard_refresh", getLeaderboardAsRecord());
}

export async function triggerChangePlaceEvent() {
    const { eventManager } = firebot.modules;
    eventManager.triggerEvent("riskLeaderboard", "riskLeaderboard_change_place", getLeaderboardAsRecord());
}

export async function triggerChangePointsEvent() {
    const { eventManager } = firebot.modules;
    eventManager.triggerEvent("riskLeaderboard", "riskLeaderboard_change_points", getLeaderboardAsRecord());
}

export async function triggerChangePlacePointsEvent() {
    const { eventManager } = firebot.modules;
    eventManager.triggerEvent("riskLeaderboard", "riskLeaderboard_change_place_points", getLeaderboardAsRecord());
}

export async function triggerErrorEvent() {
    const { eventManager } = firebot.modules;
    eventManager.triggerEvent("riskLeaderboard", "riskLeaderboard_error", getLeaderboardAsRecord());
}

export async function triggerInitializedEvent() {
    const { eventManager } = firebot.modules;
    eventManager.triggerEvent("riskLeaderboard", "riskLeaderboard_initialized", getLeaderboardAsRecord());
}
