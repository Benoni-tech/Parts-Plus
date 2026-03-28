module.exports = {
  expo: {
    name: "Parts Plus",
    slug: "parts-plus",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/ios icon.png", // Default icon
    scheme: "partsplus",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {},
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.partsplus.app",
      icon: "./assets/images/ios icon.png", // iOS uses same logo
    },
    android: {
      package: "com.partsplus.app",
      versionCode: 1,
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
      enableProguardInReleaseBuilds: true,
      enableShrinkResourcesInReleaseBuilds: true,
      adaptiveIcon: {
        backgroundColor: "#FFFFFF",
        foregroundImage: "./assets/images/ios icon.png", // Android uses same logo with white background
        monochromeImage: "./assets/images/ios icon.png",
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      favicon: "./assets/images/ios icon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/main logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#FFFFFF",
          dark: {
            image: "./assets/images/main logo.png",
            imageWidth: 200,
            backgroundColor: "#ffffff",
          },
        },
      ],
      "expo-font",
      "expo-web-browser",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: false,
    },
    extra: {
      eas: {
        projectId: "05dacea4-39ee-4602-ac92-d80d56202ab1",
      },
      router: {},
    },
  },
};
