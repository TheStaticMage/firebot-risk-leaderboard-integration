# Firebot Risk Leaderboard Updater

## Introduction

This is a [Firebot](https://firebot.app) plugin for competitive [RISK: Global Domination](https://www.hasbrorisk.com/en/download) players. It looks up your points, place, and record on the [Risk leaderboard](https://www.hasbrorisk.com/en/leaderboard/2/1/rankPoints). You can then set these variables in an OBS text source or the Firebot overlay to display your current leaderboard position, rank (Novice - Grandmaster), points, and more on your stream.

## Documentation

- [Installation](/doc/installation.md)
- [Upgrading](/doc/upgrading.md)

## Usage

When properly [configured with your Risk friend ID](/doc/installation.md#configuration-risk-friend-id), the plugin refreshes leaderboard data every 60 seconds with no interaction required.

To display your current place, points, and rank within existing OBS text sources:

1. Create separate OBS text sources for place, rank (Novice - Grandmaster), and points.
2. In Firebot, add an Event for "Risk Leaderboard Initialized" with these effects:
   - Set OBS Text Source => the "place" text source => `$riskLeaderboard[place]`
   - Set OBS Text Source => the "rank" text source => `$riskLeaderboard[rank]`
   - Set OBS Text Source => the "points" text source => `$riskLeaderboard[points]`
3. Create another Event for "Risk Leaderboard Change (Place or Points)" with the same effects.

:bulb: If you are using the Firebot overlay, you can use the variables to populate overlay widgets instead of updating OBS sources.

:warning: It can take a few minutes after a game ends for your points to update on the Risk website. OBS text sources won't update until the website updates and the plugin refreshes.

:warning: When the season resets, the player does not appear on the leaderboard until completing one game. Variables will resolve to empty string until data populates.

:bulb: The record data (`$riskLeaderboard[wins]`, `$riskLeaderboard[losses]`) includes all game modes (ranked, casual, play with friends, bots). Most streamers prefer tracking ranked record only. Consider using Firebot counters instead.

## Replacement Variable Reference

The plugin provides the following replacement variables for the current season:

| Variable | Description |
| --- | --- |
| `$riskLeaderboard[name]` | Player name |
| `$riskLeaderboard[place]` | Player place/rank on the leaderboard |
| `$riskLeaderboard[points]` | Player total points |
| `$riskLeaderboard[wins]` | Number of games won |
| `$riskLeaderboard[games]` | Total number of games played |
| `$riskLeaderboard[losses]` | Total games minus wins |
| `$riskLeaderboard[winPercent]` | Win percentage as integer (0-100) |
| `$riskLeaderboard[winPercentRaw]` | Win percentage as decimal (0-1) |
| `$riskLeaderboard[rank]` | Player rank based on points (Novice - Grandmaster) |
| `$riskLeaderboard[lastUpdated]` | Timestamp (milliseconds since epoch) of last update |

:bulb: When no games have been played, both `$riskLeaderboard[winPercent]` and `$riskLeaderboard[winPercentRaw]` return `0`.

## Support

The best way to get help is in my Discord server. Join the [The Static Discord](https://discord.gg/8jHSUpQwuK) and then visit the `#firebot-risk-leaderboard-integration` channel there.

- Please do not DM me on Discord.
- Please do not ask for help in my chat when I am streaming.

Bug reports and feature requests are welcome via [GitHub Issues](https://github.com/TheStaticMage/firebot-risk-leaderboard-integration/issues).

## Contributing

Contributions are welcome via [Pull Requests](https://github.com/TheStaticMage/firebot-risk-leaderboard-integration/pulls). I _strongly suggest_ that you contact me before making significant changes, because I'd feel really bad if you spent a lot of time working on something that is not consistent with my vision for the project. Please refer to the [Contribution Guidelines](/.github/contributing.md) for specifics.

## License

This script is released under the [GNU General Public License version 3](/LICENSE). That makes it free to use whether your stream is monetized or not.

If you use this on your stream, I would appreciate a shout-out. (Appreciated, but not required.)

- <https://www.twitch.tv/thestaticmage>
- <https://kick.com/thestaticmage>
- <https://youtube.com/@thestaticmagerisk>

## Disclaimer

This plugin is not associated with Hasbro, Inc., the owner of the RISK® trademark, or SMG Studio, the developer of RISK: Global Domination.
