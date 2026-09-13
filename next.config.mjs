/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep the dev toolbar from covering page controls during CI browser checks.
  // Build/runtime error reporting remains enabled; local development is unchanged.
  ...(process.env.CI === 'true' ? { devIndicators: false } : {}),
}

export default nextConfig
