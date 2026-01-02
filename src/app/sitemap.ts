import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://digitalateliersolutions.agency'

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: `${baseUrl}/aviso-legal`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacidad`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        // Add other public routes here as they are created
    ]
}
