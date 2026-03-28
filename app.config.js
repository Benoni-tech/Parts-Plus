module.exports = {
  expo: {
    name: "Parts Plus",
    slug: "parts-plus",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo-with-white-bg.png", // Create this - black logo on white background
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
        backgroundColor: "#FFFFFF", // White background so black logo is visible
        foregroundImage: "./assets/images/logo.png", // Your black logo
        // Removed backgroundImage - this was causing the problem
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
          backgroundColor: "transparent",
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