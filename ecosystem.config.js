module.exports = {
  apps : [{
    name   : "whatsapp-bot",
    script : "dist/bundle.js",
    env_production: {
       NODE_ENV: "production"
    }
  }]
}