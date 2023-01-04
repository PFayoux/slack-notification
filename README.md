# Slack Notification Client

This client will listen to messages sent to the channel you will subscribe to, then it will trigger a specific notification according to your needs.

## Requirements

You will need to install the following package : 

```bash
apt install espeak sox
```

Then install the node modules : 

```bash
npm install
```

## Configure the ENV

You will need to create a new application on Slack and get its key, see [create an app](https://api.slack.com/apps?new_app=1).

Then you can set this key in the .env file, you can take example on the `.env.example`.

You will also need to allow your application to subscribe to the event `message.channels` and it will also need to have the scope `channels:history`.

## Configure the subscription to the Slack channel

You can configure several subscriptions to Slack channels and set a particular way to be notified.

You just need to create a `config.js` file with the following code : 

```js
export default [
  {
    channelId: "CHANNEL_ID", // the id of the channel to subscribe
    soundFilePath: "/usr/share/sounds/freedesktop/stereo/complete.oga", // will play the sound file
    speak: true, // will use the espeak text to speech
    notify: true, // will send a notification through notify-send
  },
]
```

You can take for example from the `config.example.js`.


## Start the app

Once your configuration is done you can run the project with :

```bash
npm start
```
