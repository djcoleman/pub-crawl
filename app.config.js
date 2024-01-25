import 'dotenv/config'

module.exports = ({config}) => {
    config.android.config = {
        googleMaps: {
            apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY
        }
    };
    config.android.package = process.env.EXPO_PACKAGE_ID;
    config.extra = {
        eas: {
            projectId: process.env.EAS_PROJECT_ID
        }
    };
    return config;
}