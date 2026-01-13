import {QueryClient} from "react-query";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Data is "fresh" voor 5 minuten - geen refetch in die tijd
                staleTime: 5 * 60 * 1000,

                // Cache blijft 30 minuten bewaard
                gcTime: 30 * 60 * 1000,

                // Retry 2x bij failure
                retry: 2,

                // Geen refetch bij window focus (optioneel, kan je aanpassen)
                refetchOnWindowFocus: false,

                // Geen refetch bij reconnect
                refetchOnReconnect: 'always',
            },
            mutations: {
                // Retry mutations niet automatisch
                retry: 0,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
    // Server: altijd nieuwe client
    if (typeof window === 'undefined') {
        return makeQueryClient();
    }

    // Browser: hergebruik client
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }

    return browserQueryClient;
}