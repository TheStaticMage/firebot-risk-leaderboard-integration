import { Effects } from '@crowbartools/firebot-custom-scripts-types/types/effects';
import { integration } from './integration';
import { firebot } from './main';

export const refreshEffect: Effects.EffectType<Record<string, never>> = {
    definition: {
        id: 'riskLeaderboard_refresh',
        name: 'Risk Leaderboard Refresh',
        description: 'Refresh the Risk leaderboard data.',
        categories: ['common'],
        icon: "fad fa-th-list"
    },
    onTriggerEvent: async () => {
        integration.refresh();
    },
    optionsTemplate: ""
};

export function registerEffects() {
    const { effectManager } = firebot.modules;
    effectManager.registerEffect(refreshEffect);
}
