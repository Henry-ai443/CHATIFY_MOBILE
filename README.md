# Chatify Mobile App (React Native)

A cross-platform mobile chat application built with React Native, Expo, and TypeScript. Features real-time messaging, typing indicators, and seamless user experience on iOS and Android.

## ✨ Features

- **100% TypeScript** - Strict type safety throughout
- **Cross-Platform** - iOS & Android via Expo
- **Real-time Messaging** - Socket.IO integration
- **Typing Indicators** - See when contacts type
- **User Presence** - Online/offline status
- **Image Support** - Send photos in chats
- **Profile Management** - Update avatar and info
- **Dark Theme** - Modern UI with cyan accents
- **Bottom Tab Navigation** - Chat & Profile tabs
- **Smooth Animations** - React Native Reanimated

## 📋 Prerequisites

- Node.js (v16+)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or physical device with Expo Go)
- Chatify Backend running on `http://localhost:3000`

## 🚀 Quick Start

### 1. Installation

```bash
cd mobile/Nova-Pulse
npm install
```

### 2. Environment Setup

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
```

### 3. Start Expo Dev Server

```bash
npm start
```

### 4. Run on Device

```bash
# iOS (requires Mac)
npm run ios

# Android
npm run android

# Web preview
npm run web
```

Or scan QR code with:
- **iOS**: Camera app
- **Android**: Expo Go app

## 📁 Project Structure

```
src/
├── app/                          # Expo Router navigation
│   ├── _layout.tsx              # Root layout
│   ├── (auth)/
│   │   ├── _layout.tsx          # Auth stack
│   │   ├── login.tsx            # Login screen
│   │   └── signup.tsx           # Signup screen
│   └── (chat)/
│       ├── _layout.tsx          # Chat stack with tabs
│       ├── index.tsx            # Chat home
│       ├── [chatId].tsx         # Conversation
│       └── profile.tsx          # Profile screen
├── store/                        # Zustand state
│   ├── useAuthStore.ts          # Auth management
│   └── useChatStore.ts          # Chat management
├── services/                     # API & WebSocket
│   ├── api.ts                   # Axios config
│   └── socket.ts                # Socket.IO wrapper
├── components/                   # Reusable components
│   ├── MessageBubble.tsx        # Message display
│   ├── TypingIndicator.tsx      # Typing animation
│   └── ChatItem.tsx             # List item
├── types/                        # TypeScript types
│   └── index.ts                 # Type definitions
└── lib/                          # Utilities
    └── notifications.ts         # Toast hook
```

## 🎨 Design System

### Color Palette (Dark Theme)

```
Background:     #0f172a (slate-900)
Surface:        #1e293b (slate-800)
Text Primary:   #e2e8f0 (slate-100)
Text Secondary: #94a3b8 (slate-400)
Accent:         #06b6d4 (cyan-500)
Success:        #10b981 (emerald-500)
Error:          #dc2626 (red-600)
Online:         #22c55e (green-500)
```

### Components

All components use React Native primitives:
- `View` - Container
- `Text` - Text rendering
- `FlatList` - List rendering
- `TextInput` - User input
- `Image` - Image display
- `TouchableOpacity` - Buttons

## 🔄 Navigation Structure

### Stack Navigation

```
Root (_layout.tsx)
├── (auth) [When not authenticated]
│   ├── login
│   └── signup
└── (chat) [When authenticated]
    ├── Bottom Tabs
    │   ├── Chat (index + [chatId])
    │   └── Profile (profile)
    └── Dynamic Routes
        └── [chatId] (conversation)
```

### Bottom Tabs

| Tab | Screen | Icon |
|-----|--------|------|
| Chat | index | comments |
| Profile | profile | user |

## 📊 State Management

### useAuthStore

```typescript
// State
authUser: User | null
isCheckingAuth: boolean
isSigningUp: boolean
isLoggingIn: boolean
isUpdatingProfile: boolean

// Methods
checkAuth()
signup({fullName, email, password})
login({email, password})
logout()
updateProfile(imageUri)
```

### useChatStore

```typescript
// State
allContacts: User[]
chats: User[]
messages: Message[]
selectedUser: User | null
onlineUsers: Set<string>
typingUsers: Set<string>

// Methods
getAllContacts()
getMyChatPartners()
getMessages(userId)
sendMessage(receiverId, text, image?)
setSelectedUser(user)
initializeSocket(userId)
cleanupSocket()
```

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/signup        Register user
POST   /api/auth/login         Login user
GET    /api/auth/check         Verify session
PUT    /api/auth/update-profile Update profile
```

### Messaging

```
GET    /api/messages/contacts/  Get all contacts
GET    /api/messages/chats      Get chat partners
GET    /api/messages/:id        Get conversation
POST   /api/messages/send/:id   Send message
```

## 🔄 WebSocket Events

### Listen

- `user_status_changed` - User online/offline
- `receive_message` - Message received
- `new_message` - New message
- `user_typing` - Contact typing
- `user_stopped_typing` - Contact stopped

### Emit

- `user_online` - User online
- `send_message` - Send message
- `user_typing` - User typing
- `user_stopped_typing` - User stopped

## 🎯 Key Screens

### Login Screen

- Email input
- Password input
- Form validation
- Error handling
- Loading state

### Signup Screen

- Full name input
- Email input
- Password input
- Confirm password
- Password matching validation
- Loading state

### Chat Home Screen

- Two tabs: "My Chats" & "Contacts"
- User list with FlatList
- Online status indicators
- Click to start conversation
- Loading/empty states

### Conversation Screen

- Messages FlatList
- Message bubbles (sent/received)
- Typing indicator
- Text input area
- Image picker
- Image preview before send
- Auto-scroll to latest
- Send button

### Profile Screen

- User info display
- Profile picture
- Tap to change photo
- Account ID
- Logout button
- Loading states

## 🧩 Key Components

### MessageBubble

Displays individual messages:
- Message text
- Timestamp (formatted)
- Images (if sent)
- Sender name (for received)
- Sender avatar
- Different colors for sent/received

### TypingIndicator

Animated typing indicator:
- Three bouncing dots
- Staggered animation
- Shows typing user name
- Appears when contact typing

### ChatItem

Contact/chat list item:
- Profile picture
- User name
- Online status indicator
- Selection highlight
- Touch handler

## 📦 Dependencies

### Core
- `expo` - Expo framework
- `react-native` - Mobile framework
- `react` - UI library

### Navigation
- `expo-router` - File-based routing
- `@react-navigation/bottom-tabs` - Tab navigation
- `@react-navigation/native` - Navigation base

### State & Networking
- `zustand` - State management
- `axios` - HTTP client
- `socket.io-client` - Real-time messaging

### UI & UX
- `react-native-safe-area-context` - Safe area
- `react-native-gesture-handler` - Gestures
- `react-native-reanimated` - Animations
- `react-native-toast-notifications` - Toasts

### Media
- `expo-image-picker` - Image selection
- `date-fns` - Date formatting

## ⚙️ Configuration

### app.json

```json
{
  "expo": {
    "name": "Chatify",
    "slug": "chatify-mobile",
    "version": "1.0.0",
    "scheme": "chatify",
    "plugins": ["expo-router"],
    "platforms": ["ios", "android"],
    "ios": {
      "supportsTabletMode": true,
      "requireFullScreen": false
    },
    "android": {
      "supportedAbis": ["armeabi-v7a", "arm64-v8a", "x86", "x86_64"]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

## 🧪 Testing

### Run Development Server

```bash
npm start
```

### Test on Android

```bash
# Requires Android Studio & emulator
npm run android
```

### Test on iOS

```bash
# Requires Xcode & simulator (Mac only)
npm run ios
```

### Test on Web

```bash
npm run web
```

### Test with Physical Device

1. Install Expo Go from app store
2. Run `npm start`
3. Scan QR code with phone camera (iOS) or Expo Go (Android)

## 📱 Screen Dimensions

Fully responsive to:
- Small phones (375px width)
- Large phones (428px width)
- Tablets (800px+ width)
- Landscape orientation

## 🔐 Security

- JWT token in Zustand store
- Secure HTTPS ready
- Input validation
- Error handling
- No sensitive data in logs

## ⚡ Performance

- Message FlatList optimization
- Image compression (70% quality)
- Socket.IO singleton
- Typing event throttling (3s)
- Component memoization
- Lazy route loading

## 🚀 Build & Release

### Build APK (Android)

```bash
eas build --platform android --profile preview
```

### Build IPA (iOS)

```bash
eas build --platform ios --profile preview
```

### Publish to Stores

```bash
eas submit --platform android
eas submit --platform ios
```

## 🐛 Troubleshooting

### Issue: "Module not found"

```bash
# Clean install
rm -rf node_modules
npm install
```

### Issue: "Socket not connecting"

- Check backend is running
- Verify API_URL in .env
- Check network connection

### Issue: "Permission denied for camera"

- Grant permissions in phone settings
- For simulator: grant in simulator settings

### Issue: "Images not loading"

- Check Expo ImagePicker permissions
- Verify image quality settings
- Check base64 conversion

## 📚 Documentation

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Expo Router Guide](https://expo.github.io/router)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Socket.IO Client](https://socket.io/docs/v4/client-api)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run tests
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

- GitHub Issues
- Discord Community
- Email Support

---

**Last Updated**: February 2024  
**Version**: 1.0.0  
**Language**: TypeScript (100%)  
**Status**: Ready for Testing
