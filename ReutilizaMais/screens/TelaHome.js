import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Image, Dimensions, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DicasMais from '../components/DicasMais';

const PRIMARY = '#00AEEF';
const BG = '#F8F4E6';
const ORANGE = '#FF6200';
const TEXT = '#333';

export default function TelaHome() {
  const slideWidth = Dimensions.get('window').width / 2;
  const imgs = [
    require('../assets/campos-propaganda.png'),
    require('../assets/vilarejo-propaganda.png'),
    require('../assets/leroy-propaganda.png'),
  ];
  const loopImgs = [...imgs, ...imgs];
  const total = slideWidth * imgs.length;
  const tx = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const run = () => {
      tx.setValue(0);
      Animated.timing(tx, { toValue: -total, duration: imgs.length * 10000, easing: Easing.linear, useNativeDriver: true }).start(() => run());
    };
    run();
  }, [total]);

  return (
    <>
      <SafeAreaView edges={['top']} style={{ backgroundColor: PRIMARY }}>
        <StatusBar barStyle="light-content" />
      </SafeAreaView>

      <SafeAreaView style={styles.safe} edges={['left','right','bottom']}>
        <View style={styles.header}>
          <View style={styles.avatar} />
          <View style={styles.headerText}>
            <Text style={styles.hello}>Olá, Joaquim!</Text>
            <Text style={styles.role}>Doador</Text>
          </View>
          <View style={styles.headerIcons}>
            <Ionicons name="headset-outline" size={22} color="#ccc" />
            <Ionicons name="notifications-outline" size={22} color="#ccc" style={{ marginLeft: 12 }} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.block}>
            <Text style={styles.sectionTitle}>O que deseja fazer?</Text>

            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9}>
              <Text style={styles.primaryBtnText}>Nova doação</Text>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.outlinedBtn, { marginTop: 14 }]} activeOpacity={0.9}>
              <Text style={styles.outlinedBtnText}>Histórico de doações</Text>
              <Ionicons name="time-outline" size={20} color={ORANGE} />
            </TouchableOpacity>
          </View>

          <View style={styles.block}>
            <DicasMais />
          </View>

          <View style={[styles.block, { marginBottom: 36 }]}>
            <Text style={styles.sectionTitleCenter}>Principais parceiros</Text>
            <View style={styles.marqueeWrap}>
              <View style={styles.marqueeMask}>
                <Animated.View style={{ flexDirection: 'row', transform: [{ translateX: tx }] }}>
                  {loopImgs.map((src, i) => (
                    <View key={i} style={{ width: slideWidth, height: 110, justifyContent: 'center', alignItems: 'center' }}>
                      <Image source={src} style={styles.partnerImg} />
                    </View>
                  ))}
                </Animated.View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.8}>
            <Ionicons name="home" size={22} color="#fff" />
            <Text style={styles.tabLabel}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.8}>
            <Ionicons name="document-text-outline" size={22} color="#fff" />
            <Text style={styles.tabLabel}>Solicitações</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.8}>
            <Ionicons name="person-circle-outline" size={22} color="#fff" />
            <Text style={styles.tabLabel}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  header: { backgroundColor: PRIMARY, paddingHorizontal: 20, paddingTop: 22, paddingBottom: 36, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#d9f0f5' },
  headerText: { flex: 1, marginLeft: 14 },
  hello: { fontFamily: 'Poppins-Bold', color: '#fff', fontSize: 22, lineHeight: 26 },
  role: { fontFamily: 'Poppins-Regular', color: '#ccc', fontSize: 12, marginTop: 2 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  content: { paddingHorizontal: 18, paddingTop: 0, paddingBottom: 84 },
  block: { marginBottom: 28 },
  sectionTitle: { fontFamily: 'Poppins-Bold', fontSize: 20, color: TEXT, marginBottom: 16 },
  sectionTitleCenter: { fontFamily: 'Poppins-Bold', fontSize: 20, color: TEXT, marginBottom: 12, textAlign: 'center' },
  primaryBtn: { backgroundColor: ORANGE, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  primaryBtnText: { color: '#fff', fontFamily: 'Poppins-Bold', fontSize: 16 },
  outlinedBtn: { borderWidth: 2, borderColor: ORANGE, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'transparent' },
  outlinedBtnText: { color: ORANGE, fontFamily: 'Poppins-Bold', fontSize: 16 },
  marqueeWrap: { alignItems: 'center' },
  marqueeMask: { marginTop: 10, width: '100%', height: 110, overflow: 'hidden' },
  partnerImg: { width: '92%', height: '92%', resizeMode: 'contain' },
  tabBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: PRIMARY, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  tabItem: { alignItems: 'center', justifyContent: 'center' },
  tabLabel: { color: '#fff', fontFamily: 'Poppins-Medium', fontSize: 12, marginTop: 2 }
});
