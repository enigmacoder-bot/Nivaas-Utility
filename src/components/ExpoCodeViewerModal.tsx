import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Terminal, Sparkles } from 'lucide-react';

interface ExpoCodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpoCodeViewerModal: React.FC<ExpoCodeViewerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeFile, setActiveFile] = useState<string>('App.tsx');
  const [copied, setCopied] = useState(false);

  const fileContents: Record<string, string> = {
    'App.tsx': `import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { OverviewScreen } from './screens/OverviewScreen';
import { LedgerScreen } from './screens/LedgerScreen';
import { UtilitiesScreen } from './screens/UtilitiesScreen';
import { MaintenanceScreen } from './screens/MaintenanceScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          headerStyle: { backgroundColor: '#FFFFFF', elevation: 1 },
          headerTitleStyle: { fontFamily: 'Inter', fontSize: 18, color: '#111827' },
          tabBarActiveTintColor: '#0F766E',
          tabBarInactiveTintColor: '#4B5563',
          tabBarStyle: { height: 60, paddingBottom: 8, backgroundColor: '#FFFFFF' },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any = 'home';
            if (route.name === 'Overview') iconName = focused ? 'speedometer' : 'speedometer-outline';
            else if (route.name === 'Ledger') iconName = focused ? 'receipt' : 'receipt-outline';
            else if (route.name === 'Utilities') iconName = focused ? 'water' : 'water-outline';
            else if (route.name === 'Service') iconName = focused ? 'construct' : 'construct-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Overview" component={OverviewScreen} options={{ title: 'Nivaas Residency' }} />
        <Tab.Screen name="Ledger" component={LedgerScreen} options={{ title: 'Rent & Ledger' }} />
        <Tab.Screen name="Utilities" component={UtilitiesScreen} options={{ title: 'Water & Utilities' }} />
        <Tab.Screen name="Service" component={MaintenanceScreen} options={{ title: 'Maintenance' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}`,
    'WaterCard.tsx': `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WaterCardProps {
  name: string;
  location: string;
  currentLiters: number;
  capacityLiters: number;
  status: 'Critical' | 'Low' | 'Adequate' | 'Full';
}

export const WaterCard: React.FC<WaterCardProps> = ({
  name,
  location,
  currentLiters,
  capacityLiters,
  status,
}) => {
  const percentage = Math.round((currentLiters / capacityLiters) * 100);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Ionicons name="water" size={20} color="#1D4ED8" />
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>{location}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{status}</Text>
        </View>
      </View>

      <View style={styles.metricRow}>
        <Text style={styles.percentText}>{percentage}%</Text>
        <Text style={styles.litersText}>
          {currentLiters.toLocaleString('en-IN')}L / {capacityLiters.toLocaleString('en-IN')}L
        </Text>
      </View>

      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: \`\${percentage}%\` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  header: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleWrap: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: '#111827' },
  subtitle: { fontSize: 14, color: '#4B5563' },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#DBEAFE',
  },
  badgeText: { fontSize: 14, color: '#1D4ED8', fontWeight: '500' },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 14,
  },
  percentText: { fontSize: 24, fontWeight: '600', color: '#111827' },
  litersText: { fontSize: 14, fontWeight: '500', color: '#4B5563' },
  barTrack: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 9999,
    marginTop: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#1D4ED8',
    borderRadius: 9999,
  },
});`,
    'LedgerScreen.tsx': `import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export const LedgerScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.summaryBox}>
        <Text style={styles.summaryLabel}>Total Collected</Text>
        <Text style={styles.summaryValue}>₹1,98,500</Text>
        <Text style={styles.summarySub}>Expected: ₹2,64,000 (75% Realized)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7F9', padding: 16 },
  summaryBox: {
    backgroundColor: '#0F766E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  summaryLabel: { color: '#E6FFFA', fontSize: 14, fontWeight: '500' },
  summaryValue: { color: '#FFFFFF', fontSize: 28, fontWeight: '700', marginVertical: 4 },
  summarySub: { color: '#A3FAEF', fontSize: 14 },
});`,
    'UtilitiesScreen.tsx': `import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { WaterCard } from '../components/WaterCard';

export const UtilitiesScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>STORAGE TANKS</Text>
      <WaterCard
        name="Overhead Tank A"
        location="Rooftop Block A"
        currentLiters={7800}
        capacityLiters={10000}
        status="Adequate"
      />
      <WaterCard
        name="Overhead Tank B (Flush)"
        location="Rooftop Block B"
        currentLiters={5800}
        capacityLiters={8000}
        status="Adequate"
      />
      <WaterCard
        name="Underground Sump"
        location="Basement Level 0"
        currentLiters={14400}
        capacityLiters={20000}
        status="Adequate"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7F9', padding: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#4B5563', marginBottom: 12, letterSpacing: 0.5 },
});`,
    'MaintenanceScreen.tsx': `import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const MaintenanceScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Active Tickets (3)</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text style={styles.addButtonText}>New Ticket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7F9', padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 16, fontWeight: '600', color: '#111827' },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F766E', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  addButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', marginLeft: 4 },
});`,
    'app.json': `{
  "expo": {
    "name": "Nivaas Utility System",
    "slug": "nivaas-utility-system",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#F6F7F9"
    },
    "ios": {
      "supportsTablet": false
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0F766E"
      }
    }
  }
}`,
    'README.md': `# Nivaas Utility System (Expo React Native)

A calm, functional utility and residential ledger app built with Expo SDK 51.

## Quick Start with Expo Go:

\`\`\`bash
# 1. Create a fresh Expo project
npx create-expo-app nivaas-mobile --template blank-typescript
cd nivaas-mobile

# 2. Install navigation and icons
npx expo install @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @expo/vector-icons

# 3. Start development server
npx expo start
\`\`\`

Scan the QR code in your camera app (iOS) or the Expo Go app (Android) to test on your phone immediately!
`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContents[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(17,24,39,0.50)] backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="expo-modal-title"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#E5E7EB] shadow-[0_8px_32px_rgba(17,24,39,0.15)] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] bg-[#F6F7F9]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0F766E] text-white flex items-center justify-center">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h2 id="expo-modal-title" className="text-base font-semibold text-[#111827]">
                React Native & Expo Code
              </h2>
              <p className="text-xs text-[#4B5563]">Exportable Expo components & files</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#4B5563] hover:text-[#111827] hover:bg-white transition-colors"
            aria-label="Close code modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick CLI helper banner */}
        <div className="px-5 py-3 bg-[#E9EDFF] border-b border-[#DCE2F7] flex items-center justify-between text-xs text-[#1D4ED8]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 shrink-0" />
            <span className="font-mono font-medium">npx create-expo-app nivaas-mobile</span>
          </div>
          <span className="font-medium text-[#111827]">React Native 0.74+ / Expo SDK 51</span>
        </div>

        {/* Tabs for files */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-[#E5E7EB] overflow-x-auto bg-[#FFFFFF]">
          {([
            'App.tsx',
            'WaterCard.tsx',
            'LedgerScreen.tsx',
            'UtilitiesScreen.tsx',
            'MaintenanceScreen.tsx',
            'app.json',
            'README.md',
          ] as const).map((file) => (
            <button
              key={file}
              onClick={() => setActiveFile(file)}
              className={`px-3 py-2 text-xs font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                activeFile === file
                  ? 'border-[#0F766E] text-[#0F766E] bg-[#F6F7F9]'
                  : 'border-transparent text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              {file}
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="p-4 bg-[#141B2B] overflow-auto flex-1 font-mono text-xs text-[#EDF0FF] relative max-h-[50vh]">
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-sans font-medium flex items-center gap-1.5 transition-colors border border-white/10"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
          <pre className="whitespace-pre">{fileContents[activeFile]}</pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#F6F7F9] flex items-center justify-between text-xs text-[#4B5563]">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#0F766E]" />
            <span>Fully compatible with iOS & Android Expo Go</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0F766E] text-white text-sm font-semibold hover:bg-[#115E59]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
