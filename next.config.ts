/**
 * 1. JSDoc comment to provide TypeScript type hints for this JavaScript file
 * This helps IDEs provide autocomplete even though this is a JS file
 */
/** @type {import('next').NextConfig} */


// 2. Define the Next.js configuration object
const nextConfig = {
    // 3. Enable React strict mode for development error checking
    
    reactStrictMode: process.env.ENV === 'development',

    devIndicators: {
        appIsrStatus: process.env.ENV === 'development',
    },

    // 4. If you’re on Next.js 13+ and want to output static HTML files automatically
    // without having to run `next export`, you can specify:
    output: 'export',

    // 5. SWC minification
    // swcMinify: true,
};

// 6. Export the configuration using CommonJS module.exports
// Note: Next.js config files use CommonJS exports, not ES modules
module.exports = nextConfig;