import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Digital Atelier Solutions',
        short_name: 'DAS®',
        description: 'Agencia boutique de comunicación estratégica y ghostwriting para líderes Web3 y finanzas descentralizadas.',
        start_url: '/',
        display: 'standalone',
        background_color: '#FAFAFA', // bg-das-light
        theme_color: '#1a1a1a', // bg-das-dark
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/apple-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
    }
}
