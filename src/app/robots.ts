import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.digitalateliersolutions.agency'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/vribesadmin/', '/api/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
