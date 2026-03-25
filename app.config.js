module.exports = {
  expo: {
    name: "Parts Plus",
    slug: "parts-plus",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.png",
    scheme: "partsplus",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {},
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.partsplus.app",
    },
    android: {
      package: "com.partsplus.app",
      versionCode: 1,
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
      enableProguardInReleaseBuilds: true,
      enableShrinkResourcesInReleaseBuilds: true,
      adaptiveIcon: {
        backgroundColor: "#FFD700",
        foregroundImage: "./assets/images/logo.png",
        backgroundImage: "./assets/images/logo.png",
        monochromeImage: "./assets/images/logo.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      favicon: "./assets/images/logo.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            image: "./assets/images/logo.png",
            imageWidth: 200,
            backgroundColor: "#0a0a0a",
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
