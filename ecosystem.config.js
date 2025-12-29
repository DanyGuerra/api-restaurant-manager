module.exports = {
  apps: [
    {
      name: "resthub-api",
      script: "dist/main.js",
      env_file: ".env",
      instances: 1,
      exec_mode: "fork",
    },
  ],
};
