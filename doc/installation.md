# Installation

## Version Compatibility

| Plugin Version | Minimum Firebot Version |
| --- | --- |
| 0.0.1+ | 5.64 |

## Installation: Plugin

1. Enable custom scripts in Firebot (Settings > Scripts) if you have not already done so.
2. From the latest [Release](https://github.com/TheStaticMage/firebot-risk-leaderboard-integration/releases), download `firebot-risk-leaderboard-integration-<version>.js` into your Firebot scripts directory (File > Open Data Folder, then select the "scripts" directory).
3. Go to Settings > Scripts > Manage Startup Scripts > Add New Script and add the `firebot-risk-leaderboard-integration-<version>.js` script.
4. Restart Firebot. (The plugin will _not_ be loaded until you actually restart Firebot.)

## Configuration: Risk Friend ID

1. In the Risk program, click on the green smile-face in the upper right of the main screen.
2. Copy your friend ID from below the friends list.
3. In Firebot, go to Integrations > RiskLeaderboard > Configure.
4. Paste your friend ID in the "Friend ID" field and click Save.

## Testing

After configuration, the plugin will refresh leaderboard data every 60 seconds. You can verify it's working by using the `$riskLeaderboard` variable anywhere that variables are allowed.
