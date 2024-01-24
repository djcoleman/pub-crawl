export default {
    android: {
        config: {
            googleMaps: {
                apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY
            }
        }
    },
    expo: {
        package: process.env.EXPO_PACKAGE_ID
    },
    extra: {
        eas: {
          projectId: process.env.EAS_PROJECT_ID
        }
      }
}