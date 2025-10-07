import { Firebot, RunRequest } from '@crowbartools/firebot-custom-scripts-types';
import { Logger } from '@crowbartools/firebot-custom-scripts-types/types/modules/logger';
import { definition, integration } from "./integration";

const scriptVersion = '0.0.1';

export let firebot: RunRequest<any>;
export let logger: LogWrapper;

const script: Firebot.CustomScript = {
    getScriptManifest: () => {
        return {
            name: 'Risk Leaderboard Updater',
            description: 'Get your position and points on the Risk leaderboard.',
            author: 'The Static Mage',
            version: scriptVersion,
            firebotVersion: '5',
            startupOnly: true
        };
    },
    getDefaultParameters: () => {
        return {};
    },
    run: async (runRequest) => {
        firebot = runRequest;
        logger = new LogWrapper(runRequest.modules.logger);
        logger.info(`Risk Leaderboard Integration v${scriptVersion} initializing...`);
        firebot.modules.integrationManager.registerIntegration({definition, integration});
        integration.connect();
        logger.info(`Risk Leaderboard Integration v${scriptVersion} initialized.`);
    },
    stop: () => {
        integration.disconnect();
    }
};

export default script;

class LogWrapper {
    private _logger: Logger;

    constructor(inLogger: Logger) {
        this._logger = inLogger;
    }

    info(message: string) {
        this._logger.info(`[firebot-risk-leaderboard-integration] ${message}`);
    }

    error(message: string) {
        this._logger.error(`[firebot-risk-leaderboard-integration] ${message}`);
    }

    debug(message: string) {
        this._logger.debug(`[firebot-risk-leaderboard-integration] ${message}`);
    }

    warn(message: string) {
        this._logger.warn(`[firebot-risk-leaderboard-integration] ${message}`);
    }
}
