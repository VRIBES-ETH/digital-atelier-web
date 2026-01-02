import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://digitalateliersolutions.agency'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/vribesadmin/', '/api/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
