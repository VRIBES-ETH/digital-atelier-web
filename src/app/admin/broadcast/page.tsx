import { getBroadcasts } from "../actions";
import BroadcastClient from "./BroadcastClient";

export default async function AdminBroadcast() {
    const { data: history } = await getBroadcasts();

    return (
        <BroadcastClient history={history || []} />
    );
}
