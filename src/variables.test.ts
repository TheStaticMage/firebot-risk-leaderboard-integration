import { riskLeaderboardVariable, leaderboard } from "./variables";
import type { Trigger, TriggerType } from "@crowbartools/firebot-custom-scripts-types/types/triggers";


// Helper to set leaderboard state for tests
function setLeaderboardState(state: any) {
    Object.assign(leaderboard, state);
}

describe("riskLeaderboardVariable.evaluator", () => {
    const triggerStub: Trigger = { type: "replace-variable" as TriggerType, metadata: { username: "tester" } };
    const now = Date.now();

    describe("when not initialized", () => {
        beforeEach(() => {
            setLeaderboardState({
                initialized: false,
                name: "TestPlayer",
                place: -1,
                points: -1,
                wins: -1,
                games: -1,
                lastUpdated: now
            });
        });

        it("returns proper name", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "name")).toBe("TestPlayer");
        });

        it("returns empty string for place", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "place")).toBe("");
        });

        it("returns empty string for points", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "points")).toBe("");
        });

        it("returns empty string for wins", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "wins")).toBe("");
        });

        it("returns empty string for games", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "games")).toBe("");
        });

        it("returns empty string for losses", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "losses")).toBe("");
        });

        it("returns empty string for winPercent", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "winPercent")).toBe("");
        });

        it("returns empty string for winPercentRaw", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "winPercentRaw")).toBe("");
        });

        it("returns proper date for lastUpdated", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "lastUpdated")).toBe(now);
        });

        it("returns empty string for rank", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "rank")).toBe("");
        });
    });

    describe("when initialized", () => {
        beforeEach(() => {
            setLeaderboardState({
                initialized: true,
                name: "TestPlayer",
                place: 2,
                points: 1500,
                wins: 10,
                games: 20,
                lastUpdated: 1234567890
            });
        });

        it("returns name", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "name")).toBe("TestPlayer");
        });

        it("returns place", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "place")).toBe(2);
        });

        it("returns points", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "points")).toBe(1500);
        });

        it("returns wins", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "wins")).toBe(10);
        });

        it("returns games", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "games")).toBe(20);
        });

        it("returns losses", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "losses")).toBe(10);
        });

        it("returns winPercent", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "winPercent")).toBe(50);
        });

        it("returns winPercentRaw", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "winPercentRaw")).toBeCloseTo(0.5);
        });

        it("returns lastUpdated", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "lastUpdated")).toBe(1234567890);
        });

        it("returns rank", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "rank")).toBe("Beginner");
        });

        it("returns leaderboard object for no args", () => {
            setLeaderboardState({
                name: "TestPlayer",
                place: 2,
                points: 1500,
                wins: 10,
                games: 20,
                lastUpdated: 1234567890
            });
            const result = riskLeaderboardVariable.evaluator(triggerStub);
            expect(result).toHaveProperty("name", "TestPlayer");
            expect(result).toHaveProperty("place", 2);
            expect(result).toHaveProperty("points", 1500);
            expect(result).toHaveProperty("wins", 10);
            expect(result).toHaveProperty("games", 20);
            expect(result).toHaveProperty("lastUpdated", 1234567890);
        });
    });

    describe("with no games played", () => {
        beforeEach(() => {
            setLeaderboardState({
                initialized: true,
                name: "TestPlayer",
                place: -1,
                points: -1,
                wins: 0,
                games: 0,
                lastUpdated: 1234567890
            });
        });

        it("returns 0 for winPercent", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "winPercent")).toBe(0);
        });

        it("returns 0 for winPercentRaw", () => {
            expect(riskLeaderboardVariable.evaluator(triggerStub, "winPercentRaw")).toBe(0);
        });
    });

    describe("ranks", () => {
        const rankTests = [
            { points: -1, expected: "" },
            { points: 0, expected: "Novice" },
            { points: 999, expected: "Novice" },
            { points: 1000, expected: "Beginner" },
            { points: 5999, expected: "Beginner" },
            { points: 6000, expected: "Intermediate" },
            { points: 10999, expected: "Intermediate" },
            { points: 11000, expected: "Expert" },
            { points: 15999, expected: "Expert" },
            { points: 16000, expected: "Master" },
            { points: 25999, expected: "Master" },
            { points: 26000, expected: "Grandmaster" },
            { points: 50000, expected: "Grandmaster" }
        ];

        rankTests.forEach(({ points, expected }) => {
            it(`returns rank "${expected}" for ${points} points`, () => {
                setLeaderboardState({
                    initialized: true,
                    name: "TestPlayer",
                    place: 1,
                    points: points,
                    wins: 10,
                    games: 20,
                    lastUpdated: 1234567890
                });
                expect(riskLeaderboardVariable.evaluator(triggerStub, "rank")).toBe(expected);
            });
        });
    });
});
