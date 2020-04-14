const axios = require('axios')

const webhookUrl = process.env.DISCORD_WEBHOOK_URL

exports.sendWebhook = async (email) => {
  const data = {
    content: `📨 **New landing page sign up**\nEmail: ${email}`
  }

  await axios.post(webhookUrl, data)
}
