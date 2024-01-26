# Pub Crawl

The imaginatively titled _Pub Crawl_ application is a demo project I wrote to learn how to develop a React-Native mobile application. It has a fairly limited scope and appeal, but it does boast the following features:

  * Uses the device's location to plot where you are currently standing on a Google Map.
  * Finds the top 10 bars in your vicinity and presents them in a handy list.
  * Clicking on one of the bars in the list moves the map to show its location.
  * Double clicking a bar in the list displays its details in a separate screen.
  * Long-pressing an empty space on the map sets that as your current location, and refreshes the list of bars focused around that point.

_So how can I get my hands on all these killer features?_ I imagine you're screaming at the screen. Read on, over-enthusiastic reader...


## Setting up the Project

You may be shocked to learn that this application is not available in any app stores. In order to run this application, you'll first need to build it yourself. The application was built using [Expo](https://expo.dev), so you'll need to ensure that you meet its [requirements](https://docs.expo.dev/get-started/installation/#requirements) to run (i.e. Node, git and Watchman have been installed).

First, clone this repository and download the dependencies:

```bash
git clone https://github.com/djcoleman/pub-crawl
cd pub-crawl
npm install
```

## Acquire a Google API Key

This application uses Google APIs to display a map and to query place details, and an API key is required to use these services. You'll need to create a new project in the Google Cloud platform, enable billing (don't worry, you shouldn't come anywhere close to exceeding the limits of the free tier for personal use), and enable the APIs that you wish the application to use. Let's go through each of those steps in a bit more detail:

  1. Follow the instructions in the [Set up your Google Cloud project](https://developers.google.com/maps/documentation/embed/cloud-setup) guide to create a new project (mine was named `Pub Crawl`) and associate a billing account to it.
  1. You'll need to enable the following APIs for your project:
      * Maps SDK for Android
      * Places API (New)
  1. Copy your API Key from the _Keys and Credentials_ page.

Copy the `.env.template` file to `.env` and paste in your API key as the value for the `EXPO_PUBLIC_GOOGLE_API_KEY` variable.

## Running the Application in Expo

Run `npx expo start` to start the Metro bundler. A crude QR code will be displayed on the console, and beneath it the URL of the server. 

You can run the application on a device by first installing [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) and then scanning the QR code or manually entering the URL from the console. The bundler will then build the application and download it to your device.

## Native Builds in EAS

While running in Expo Go is a great way to quickly test changes to the application during development, you'll need a native build in order to run the application outside of the Expo Go environment. You can use the Expo build servers to build native packages that you can then either run in a simulator, or download and install on your device.

You'll need to sign up for a free [Expo](https://expo.dev) developer account before you can build. You'll also need to install EAS CLI:

```bash
npm install --global eas-cli
```

And log in to your Expo account:

```bash
eas login
```

Next, you need to create a project in your expo account, which you can do by running `eas build:configure`. When asked whether you want to automatically create an EAS project, answer `Y`. When starting a project from scratch, this step will generate an `app.json` configuration file containing the unique project ID. However, to avoid committing my own project ID into the repository, this project is using dynamic configuration to set the project ID from an environment variable. So you can ignore the error from the `build:configure` command, but do copy the project ID and paste it into your `.env` as the value for the `EAS_PROJECT_ID`.

Finally, you need to specify a package ID for your application, and set that as the value for `EXPO_PACKAGE_ID`. The package name can be almost anything, but I used `com.<EAS username>.pubcrawl`, where EAS username is the result of running `eas whoami`.

Before you can build remotely, the environment variables in the `.env` file will need to be available on the remote build servers. As the `.env` file has been added to `.gitignore`, that file will not be uploaded so we need another way to make those values available at build time. There are two approaches: either add them as variables to an `env` section in the `eas.json` file, or add secrets for the values. I guess the package ID and project ID aren't that secret, but I wouldn't want the API key to be added into `eas.json` and committed into a git repository. However, to keep things simple, just create secrets for each of the environment variables:

```bash
eas secret:push --scope project --env-file .env
```

To start a remote build on the EAS build servers, run the following command:

```bash
dotenv -- eas build --platform android --profile preview
```

The above command uses [dotenv-cli](https://github.com/entropitor/dotenv-cli) to pass the contents of `.env` to the `eas build` command. If `dotenv` isn't used, the build will fail due to the package ID not being set. Alternatively, you can just export the `EXPO_PACKAGE_ID` variable in the shell and not use `dotenv`.

If you're asked to generate a new Android keystore, answer `yes` and then sit patiently in the low-priority queue for your build to start. 

After a successful build, a QR code will be displayed in the console. Maybe scanning it will work for you, but my camera app didn't recognise the code. Instead, open the URL displayed beneath the QR code in a browser to show the details of the build. Click on the `Install` button to display a smoother QR code image that should be scannable by the camera app, and follow the link. Click on the `Install` button once again inside the device's browser, and download the APK file. Follow the installation instructions and accept the risks (I'm an honest fellow, and if you don't trust me, you can read through the source code anyway). The application should then run.