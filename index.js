import * as dotenv from "dotenv"
import { spawn } from "child_process"
import { SocketModeClient } from "@slack/socket-mode"
import subscribedChannels from "./config.js"

dotenv.config()

const appToken = process.env.APP_TOKEN

const socketModeClient = new SocketModeClient({ appToken })

async function readStream(readableStream) {
  let data = ""
  for await (const chunk of readableStream) {
    data += chunk
  }

  return data
}

async function runCmd(cmd, options) {
  console.log(cmd, options)
  const process = spawn(cmd, options)

  const errors = await readStream(process.stderr)

  const data = await readStream(process.stdout)

  const exitCode = await new Promise((resolve, reject) => {
    process.on("close", resolve)
  })

  if (exitCode) {
    throw new Error(`subprocess error exit ${exitCode}, ${errors}`)
  }

  return data
}

socketModeClient.on("message", async ({ event, ack }) => {
  for (const channel of subscribedChannels) {
    if (event.channel === channel.channelId) {
      console.log(event)
      if (channel.soundFilePath) {
        await runCmd("play", [channel.soundFilePath])
      }
      if (channel.speak) {
        await runCmd("espeak", [event.text])
      }
      if (channel.notify) {
        await runCmd("notify-send", [event.text])
      }
    }
    await ack()
  }
})

await socketModeClient.start()

if (socketModeClient.authenticated) {
  console.log("done")
} else {
  console.log("not authenticated")
}
