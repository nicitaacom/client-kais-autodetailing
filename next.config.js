const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["oaidalleapiprodscus.blob.core.windows.net"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
        pathname: "/**",
      },
    ],
  },
}

module.exports = nextConfig
