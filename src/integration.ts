import { IntegrationData, IntegrationDefinition } from "@crowbartools/firebot-custom-scripts-types";
import { EventEmitter } from "events";
import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";
import html from "node-html-parser";
import { registerEffects } from "./effects";
import { registerEvents, triggerErrorEvent, triggerRefreshEvent } from "./events";
import { logger } from "./main";
import { LeaderboardStats, loadVariables, update } from "./variables";

const integrationId = "risk-leaderboard";

type Settings = {
    leaderboard: {
        playerId: string;
    };
    advanced: {
        proxy: string;
        refreshInterval: number;
    };
};

export const definition: IntegrationDefinition = {
    id: "risk-leaderboard",
    name: "RiskLeaderboard",
    description: "Risk leaderboard position and stats.",
    connectionToggle: false,
    linkType: "none",
    configurable: true,
    settingCategories: {
        leaderboard: {
            title: "Leaderboard",
            settings: {
                playerId: {
                    type: "string",
                    description: "Friend ID of the player to look up (required).",
                    title: "Friend ID",
                    default: ""
                }
            }
        },
        advanced: {
            title: "Advanced",
            settings: {
                proxy: {
                    type: "string",
                    description: "Proxy server to use for requests (optional).",
                    title: "Proxy Server",
                    default: ""
                },
                refreshInterval: {
                    type: "number",
                    description: "How often to refresh the leaderboard in seconds.",
                    title: "Refresh Interval",
                    default: 60,
                    min: 60
                }
            }
        }
    }
};

export class RiskLeaderboardIntegration extends EventEmitter {
    _playerId: string;
    _proxy: string;
    _refreshInterval: number;
    _refreshTimer: NodeJS.Timeout | null;
    _settings: Settings;
    connected = true;

    constructor() {
        super();
        this._playerId = "";
        this._proxy = "";
        this._refreshInterval = 60;
        this._refreshTimer = null;
        this._settings = {leaderboard: { playerId: "" }, advanced: { proxy: "", refreshInterval: 60 }};
    }

    init(linked: boolean, integrationData: IntegrationData<Settings>) {
        if (integrationData.userSettings) {
            this._settings = JSON.parse(JSON.stringify(integrationData.userSettings));
        }

        registerEffects();
        registerEvents();
        loadVariables();
        this._playerId = this._settings.leaderboard.playerId;
        this._proxy = this._settings.advanced.proxy;
        this._refreshInterval = this._settings.advanced.refreshInterval;
    }

    onUserSettingsUpdate?(
        integrationData: IntegrationData<Settings>
    ): void | PromiseLike<void> {
        if (integrationData.userSettings) {
            this._settings = JSON.parse(JSON.stringify(integrationData.userSettings));
        }

        this._playerId = this._settings.leaderboard.playerId;
        this._proxy = this._settings.advanced.proxy;
        this._refreshInterval = this._settings.advanced.refreshInterval;
        this.connect();
    }

    async connect() {
        this.emit("connecting", integrationId);

        if (!this._playerId) {
            logger.warn("No player ID provided.");
            this.disconnect();
            return;
        }

        if (this._refreshInterval <= 0) {
            logger.warn("Invalid refresh interval.");
            this.disconnect();
            return;
        }

        this._refreshTimer = setInterval(() => {
            this.refresh().then(() => {
                logger.debug("Refreshed leaderboard data.");
            }).catch((e) => {
                logger.error(`Failed to refresh leaderboard data: ${e}`);
            });
        }, this._refreshInterval * 1000);

        logger.debug(`Connecting to Risk leaderboard for player ID: ${this._playerId}`);
        await this.refresh().catch((e) => {
            logger.warn(`Failed to refresh leaderboard data: ${e}`);
            return;
        });

        logger.debug(`Refresh interval scheduled every ${this._refreshInterval} seconds.`);
        this.emit("connected", integrationId);
    }

    disconnect() {
        if (this._refreshTimer) {
            clearInterval(this._refreshTimer);
        }
        this.emit("disconnected", integrationId);
    }

    link() {
        // Nothing to do here
    }

    async unlink() {
        // Nothing to do here
    }

    async refresh(): Promise<boolean> {
        const stats = await this.getLeaderboardStats();
        if (stats) {
            update(stats);
            triggerRefreshEvent();
            return true;
        }
        triggerErrorEvent();

        return false;
    }

    static sanitizeName(name: string): string {
        const hashCodeRegex = /<#(\w+)>/g;
        return name.replace(hashCodeRegex, "").trim();
    }

    static parseLeaderboardPage(data: string): LeaderboardStats {
        const result: LeaderboardStats = {
            initialized: false,
            name: "",
            place: -1,
            points: -1,
            wins: 0,
            games: 0,
            lastUpdated: Date.now()
        };

        // Parse document
        const doc = html.parse(data);
        if (!doc) {
            throw new Error("Failed to parse leaderboard page.");
        }

        // Player's current name
        const playerElement = doc.querySelector("h2");
        if (playerElement) {
            const playerNameMatch = playerElement.innerText.match(/Player Name : (.+)/);
            if (playerNameMatch) {
                result.name = this.sanitizeName(playerNameMatch[1]);
            }
        }

        // Season stats
        const season2 = doc.querySelector("#season-2");
        if (season2) {
            const rows = season2.querySelectorAll("tbody tr");
            rows.forEach((row) => {
                const cells = row.querySelectorAll("td");
                if (cells.length >= 2) {
                    const statName = cells[0].innerText.trim();
                    const statValue = parseInt(cells[1].innerText.replace(/,/g, ""), 10);
                    const statPosition = parseInt(cells[2].innerText.replace(/,/g, ""), 10);

                    if (statName === "Skill Points") {
                        result.points = statValue;
                        result.place = statPosition;
                    }

                    if (statName === "Games Won") {
                        result.wins = statValue;
                    }

                    if (statName === "Games Completed") {
                        result.games = statValue;
                    }
                }
            });
        }

        // At the beginning of the season if the player has not played, they
        // will be shown with 0 points in 0th place.
        if (result.points === 0 && result.place === 0) {
            result.place = -1;
            result.points = -1;
        }

        return result;
    }

    async getLeaderboardStats(): Promise<LeaderboardStats> {
        const leaderboardRawData = await this.getLeaderboardPage();
        if (!leaderboardRawData) {
            throw new Error("Failed to get leaderboard page.");
        }

        return RiskLeaderboardIntegration.parseLeaderboardPage(leaderboardRawData);
    }

    async getLeaderboardPage(): Promise<string> {
        const url = `https://www.hasbrorisk.com/en/player/${this._playerId}`;

        const options: any = {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        };

        if (this._proxy) {
            const agent = new HttpsProxyAgent(this._proxy);
            options.agent = agent;
        }

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`Failed to get leaderboard page: ${response.status}`);
            }

            return await response.text();
        } catch (error: any) {
            throw new Error(`Failed to get leaderboard page: ${error.message}`);
        }
    }
}

export const integration = new RiskLeaderboardIntegration();
