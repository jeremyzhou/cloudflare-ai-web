// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    devtools: {enabled: false},
    modules: ['@nuxt/ui', '@nuxtjs/i18n'],
    css: ['~/assets/css/style.css'],
    devServer: {
        port: 3001,
    },
    routeRules: {
        '/': {
            prerender: true,
        }
    },
    app: {
        head: {
            title: '慧医小助手',
            meta: [
                {
                    name: 'keywords',
                    content: 'A wisdom doctor AI assistant, AI, GeminiPro, A wisdom doctor AI assistant by ZhouZiHao'
                },
                {
                    name: 'description',
                    content: 'Integrated web platform supporting GeminiPro/A wisdom doctor AI assistant by ZhouZiHao'
                }
            ],
            link: [
                {
                    rel: 'manifest',
                    href: '/manifest.json'
                }
            ]
        }
    },
    i18n: {
        vueI18n: './i18n.config.ts',
        strategy: 'no_prefix',
        defaultLocale: 'zh',
    }
    // nitro: {
    //     vercel: {
    //         regions: ["sin1", "syd1", "sfo1", "iad1", "pdx1", "cle1"]
    //     }
    // }
})
