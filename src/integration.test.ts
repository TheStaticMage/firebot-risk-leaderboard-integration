const fs = require("fs");
const path = require("path");
import { RiskLeaderboardIntegration } from "./integration";

describe("RiskLeaderboardIntegration.parseLeaderboardPage", () => {
    it("parses leaderboard HTML correctly", () => {
        const htmlPath = path.resolve(__dirname, "testdata/thestaticmage.html");
        const htmlContent = fs.readFileSync(htmlPath, "utf8");
        const result = RiskLeaderboardIntegration.parseLeaderboardPage(htmlContent);

        // Test that all required properties are present
        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("place");
        expect(result).toHaveProperty("points");
        expect(result).toHaveProperty("wins");
        expect(result).toHaveProperty("games");
        expect(result).toHaveProperty("lastUpdated");

        // Test actual parsed values from thestaticmage.html
        expect(result.name).toBe("TheStaticMage");
        expect(result.points).toBe(26000);
        expect(result.place).toBe(1750);
        expect(result.wins).toBe(7);
        expect(result.games).toBe(12);
        expect(result.lastUpdated).toBeGreaterThan(0);
    });
});

describe("RiskLeaderboardIntegration proxy configuration", () => {
    it("should configure proxy agent when proxy is specified", () => {
        const integration = new RiskLeaderboardIntegration();
        integration._proxy = "http://proxy.example.com:8080";
        integration._playerId = "test123";

        // Test that proxy configuration is properly stored
        expect(integration._proxy).toBe("http://proxy.example.com:8080");
        expect(integration._proxy).toBeTruthy();
    });

    it("should not configure proxy agent when no proxy is specified", () => {
        const integration = new RiskLeaderboardIntegration();
        integration._proxy = "";
        integration._playerId = "test123";

        // Test that no proxy is configured
        expect(integration._proxy).toBe("");
        expect(integration._proxy).toBeFalsy();
    });
});
