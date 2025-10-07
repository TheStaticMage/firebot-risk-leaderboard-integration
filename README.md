# TheStaticMage's Risk Leaderboard Updater

## Introduction

This looks up your points, place, and record on the [Risk leaderboard](https://www.hasbrorisk.com/en/leaderboard/2/1/rankPoints). You can then set these variables in an OBS text source to display your current leaderboard position, rank (Novice - Grandmaster), points, etc. on your stream.

## Installation

The script needs to be installed like any other Firebot startup script.

1. From the latest [Release](https://github.com/TheStaticMage/firebot-risk-leaderboard-integration/releases), download `firebot-risk-leaderboard-integration-<version>.js` into your Firebot scripts directory (File &gt; Open Data Folder, then select the "scripts" directory).

2. Enable custom scripts in Firebot (Settings &gt; Scripts) if you have not already done so.

3. Add the `firebot-risk-leaderboard-integration-<version>.js` script that you just added as a startup script (Settings &gt; Scripts &gt; Manage Startup Scripts &gt; Add New Script).

4. Restart Firebot.

## Configuration

1. Get your Risk friend ID (in the Risk program, click on the green smile-face in the upper right of the main screen and copy your friend ID from below the friends list).

2. In Firebot, go to Integrations &gt; RiskLeaderboard &gt; Configure. Copy in your friend ID in the "Friend ID" field. Save.

## Usage

Generally speaking, when properly configured, the leaderboard data is refreshed every 60 seconds. This requires no interaction from the streamer. To reflect the current place, points, and rank on your stream, I recommend the following:

- Create separate OBS text sources for place, rank (Novice - Grandmaster), and points.
- In Firebot, add an Event for "Risk Leaderboard Initialized" with these effects:
  - Set OBS Text Source => the "place" text source => `$riskLeaderboard[place]`
  - Set OBS Text Source => the "rank" text source => `$riskLeaderboard[rank]`
  - Set OBS Text Source => the "points" text source => `$riskLeaderboard[points]`
- In Firebot, add an Event for "Risk Leaderboard Change (Place or Points)"
- Copy all the effects from the "Risk Leaderboard Initialized" event and paste them in the "Risk Leaderboard Change (Place or Points)" event

:warning: It can take a few minutes after a game ends for your points to be updated on the Risk website. Your score might update in the Risk program and, if applicable, on the leaderboard in the Risk program, but the OBS text sources won't be updated until the website updates, and then the integration refreshes the leaderboard.

:warning: When the season resets, the player does not appear on the leaderboard until they have completed one game. The variables will resolve to the empty string (`""`) for all fields until this data populates on the leaderboard.

:bulb: I generally do not recommend using the record that's available from this integration (`$riskLeaderboard[wins]`, `$riskLeaderboard[losses]`, etc.) because the Risk website reports your entire record in all game modes: ranked, casual, play with friends, single player versus bots, etc. Most people only want their "ranked" record to show on their stream. I recommend using Firebot counters to keep track of wins and losses whether for the season, for the stream, or both.

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
