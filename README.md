# goit-react-native-app

1. Установить Expo
   npm install expo-cli --global
2. Проверить установленую версию Expo можно командой
   expo --version
3. Инициализировать свой проект при помощи Expo - Выберите папку, где у Вас будет хранится проект и запустите в терминале команду
   expo init myNewProject
4. Выбрать шаблон проекта blank (используйте стрелочки вверх/вниз и потом Enter)
   Choose a template: (Use arrow keys)
   ----- Managed workflow -----
   ❯ blank a minimal app as clean as an empty canvas
   blank (TypeScript) same as blank but with TypeScript configuration
   tabs several example screens and tabs using react-navigation
   ----- Bare workflow -----
   minimal bare and minimal, just the essentials to get you started
   minimal (TypeScript) same as minimal but with TypeScript configuration
5. Перейти в папку с проектом
   cd myNewProject
6. Запустить проект
   npm start

---

# работа с шрифтами

1. Для удобной работы со шрифтами добавим в проект npm пакет expo-font. expo-font allows loading fonts from the web and using them in React Native components.
   expo install expo-font
2. expo-app-loading tells expo-splash-screen to keep the splash screen visible while the AppLoading component is mounted. This is useful to download and cache fonts, logos, icon images and other assets that you want to be sure the user has on their device for an optimal experience.
   expo install expo-app-loading

---

# нативные компоненты

1. expo-camera - предоставляет методы работы с камерой
   expo install expo-camera
2. expo-image-picker provides access to the system's UI for selecting images and videos from the phone's library or taking a photo with the camera.
   expo install expo-image-picker
3. expo-media-library - предоставляет методы для сохранения фото в память телефона
   expo install expo-media-library
4. пакет под названием expo-location для определения местоположения пользователя
   expo install expo-location
5. показывать карту с маркерами можно добавив в проект пакет под названием react-native-maps
   expo install react-native-maps

---

# навигация в приложении

1. React Navigation - Routing and navigation for Expo and React Native apps. Если проводить паралели с web разработкой, там мы дополнительно устанавливали react-router-dom. По аналогии, для React Native установим свою библиотеку под названием react-navigation, а также несколько вспомагательных пакетов.
   npm install @react-navigation/native
   expo install react-native-screens react-native-safe-area-context
2. The libraries we've installed so far are the building blocks and shared foundations for navigators, and each navigator in React Navigation lives in its own library. To use the native stack navigator, we need to install @react-navigation/native-stack
   npm install @react-navigation/native-stack

3. Bottom Tabs Navigator Еще одним способом создать навигацию в мобильном приложении - это сделать ее в формате нижних или верхних табов. Для этого нужно установить дополнительный пакет.
   npm install @react-navigation/bottom-tabs

---

# Redux и Firebase

1. Далее нужно установить Firebase в проект к react-native
   npm i firebase@9.1.0 (expo install firebase)

2. Добавить в "FireStore DataBase" -> "Rules" строку
   "allow read, write: if request.auth != null;". Теперь файл должен выглядеть так:

   rules_version = '2';
   service cloud.firestore {
   match /databases/{database}/documents {
   match /{document=\*\*} {
   allow read, write: if
   request.time < timestamp.date(2022, 4, 16);
   allow read, write: if request.auth != null;
   }
   }
   }

3. Add the Redux Toolkit and React-Redux packages to your project.
   npm install @reduxjs/toolkit react-redux
