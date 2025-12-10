import { getAppSettings } from "../actions";
import SettingsClient from "./SettingsClient";

export default async function AdminSettings() {
    const { data: settings } = await getAppSettings();

    return (
        <div className="flex flex-col h-full">
            <SettingsClient initialSettings={settings || {
                usdc_erc20_wallet: '',
                usdc_polygon_wallet: '',
                usdc_solana_wallet: '',
                stripe_product_copilot: '',
                stripe_product_seed: '',
                stripe_product_growth: '',
                stripe_product_authority: ''
            }} />
        </div>
    );
}
