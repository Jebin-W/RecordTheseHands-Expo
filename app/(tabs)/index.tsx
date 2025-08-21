import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  FeBlend,
  FeFlood,
  FeGaussianBlur,
  Filter,
  G,
  Rect,
} from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

export default function StatisticsPageScreen() {
  return (
    <LinearGradient
      className="h-screen w-screen flex-col"
      colors={['#020617', '#334155']}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}>
      <SafeAreaView className="relative flex flex-col items-center">
        <ScrollView
          className="flex flex-col"
          contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text className="mt-2 text-center text-4xl font-bold text-slate-400">Home</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex flex-row"
            contentContainerStyle={{ alignItems: 'flex-start', justifyContent: 'center' }}>
            <StatisticCard width={25} height={25} title="Test" data="asdasd" footer="Total" />
          </ScrollView>
        </ScrollView>
        <ScrollView
          className="flex flex-col"
          contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text className="mb-4 mt-2 text-center text-3xl font-bold text-slate-400">
            Statistics
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

type StatisticCardProps = {
  width: number;
  height: number;
  title: string;
  data: string;
  footer: string;
};

function StatisticCard({ width, height, title, data, footer }: StatisticCardProps) {
  const style = StyleSheet.create({
    box: {
      height: height * 4,
      width: width * 4,
    },
  });

  return (
    <View
      className="m-2 flex flex-col items-start justify-start overflow-hidden rounded-md bg-slate-900"
      style={style.box}>
      <Text className="mb-2 p-2 text-start font-semibold text-gray-400">{title}</Text>
      <Text className="flex-1 text-nowrap p-2 text-start text-xl font-bold text-gray-400">
        {data}
      </Text>
      <Text className="p-2 text-start font-bold text-gray-400">{footer}</Text>
    </View>
  );
}
/* <Svg
        className="absolute inset-0 -z-20"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -20,
        }}
        viewBox="0 0 540 960"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice">
        <Defs>
          <Filter id="blur1" x="-10%" y="-10%" width="120%" height="120%">
            <FeFlood floodOpacity="0" result="BackgroundImageFix"></FeFlood>
            <FeBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"></FeBlend>
            <FeGaussianBlur stdDeviation="163" result="effect1_foregroundBlur"></FeGaussianBlur>
          </Filter>
        </Defs>
        <Rect width="540" height="960" fill="#d79c00"></Rect>
        <G filter="url(#blur1)">
          <Circle cx="485" cy="106" fill="#ffda4f" r="363"></Circle>
          <Circle cx="508" cy="610" fill="#d79c00" r="363"></Circle>
          <Circle cx="20" cy="22" fill="#ffda4f" r="363"></Circle>
          <Circle cx="296" cy="366" fill="#ffda4f" r="363"></Circle>
          <Circle cx="350" cy="854" fill="#d79c00" r="363"></Circle>
          <Circle cx="279" cy="171" fill="#ffda4f" r="363"></Circle>
        </G>
      </Svg>

      {/* Overlay SVG - Full screen with -z-10 */

//   <Svg
//     className="absolute inset-0 -z-10"
//     style={{
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       zIndex: -10,
//     }}
//     viewBox="0 0 540 960"
//     width="100%"
//     height="100%"
//     preserveAspectRatio="xMidYMid slice">
//     <G fill="#dda100">
//       <Circle r="190" cx="391" cy="341"></Circle>
//       <Circle r="48" cx="24" cy="64"></Circle>
//       <Circle r="107" cx="13" cy="522"></Circle>
//       <Circle r="63" cx="275" cy="810"></Circle>
//     </G>
//   </Svg> */}

// <LinearGradient
//             className="m-2 flex h-25 w-25 flex-col items-start justify-center rounded-md border border-slate-500 p-1"
//             style={{ borderColor: 'rgba(255,255,255,0.3)' }}
//             colors={['rgba(255, 255, 255, 0.2)', 'rgba(255,255,255,0)']}
//             start={{ x: -1, y: -1 }}
//             end={{ x: 1, y: 1 }}>
//             <Text className="border border-red-500 p-1">Hi</Text>
//           </LinearGradient>
