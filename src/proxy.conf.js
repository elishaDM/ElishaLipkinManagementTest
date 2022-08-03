const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/users/authenticate",
      "/users"
    ],
    target: "https://localhost:7005",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
