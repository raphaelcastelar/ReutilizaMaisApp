// components/DicasMais.js
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DATA = [
  { id: '1', titulo: 'Obras sustentáveis viram tendência na construção civil', img: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=1200&auto=format&fit=crop' },
  { id: '2', titulo: 'Como doar com segurança e impacto', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop' },
  { id: '3', titulo: 'Dicas para aumentar a vida útil dos materiais doados', img: 'https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?q=80&w=1200&auto=format&fit=crop' }
];

export default function DicasMais() {
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);
  const CARD_W = Math.min(320, Dimensions.get('window').width - 56);
  const STEP = CARD_W + 12;
  const maxIndex = DATA.length - 1;

  const go = (dir) => {
    const next = Math.max(0, Math.min(maxIndex, index + dir));
    if (next === index) return;
    setIndex(next);
    listRef.current?.scrollToIndex({ index: next, animated: true, viewPosition: 0 });
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Dicas e mais</Text>

      <View style={styles.carouselArea}>
        <FlatList
          ref={listRef}
          horizontal
          data={DATA}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <ImageBackground source={{ uri: item.img }} style={[styles.card, { width: CARD_W }]} imageStyle={styles.cardImage}>
              <View style={styles.overlay}>
                <Text style={styles.cardTitle}>{item.titulo}</Text>
                <TouchableOpacity>
                  <Text style={styles.link}>Saiba mais</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          )}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{ paddingRight: 12 }}
          getItemLayout={(_, i) => ({ length: STEP, offset: STEP * i, index: i })}
        />

        {index > 0 && (
          <TouchableOpacity style={[styles.navBtn, styles.leftBtn]} onPress={() => go(-1)}>
            <Ionicons name="chevron-back" size={18} color="#333" />
          </TouchableOpacity>
        )}

        {index < maxIndex && (
          <TouchableOpacity style={[styles.navBtn, styles.rightBtn]} onPress={() => go(1)}>
            <Ionicons name="chevron-forward" size={18} color="#333" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.dots}>
        {DATA.map((_, i) => (
          <View key={i} style={[styles.dot, index === i ? styles.dotActive : styles.dotInactive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 30 },
  sectionTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#2B2B2B', marginBottom: 12 },
  carouselArea: { position: 'relative', flexDirection: 'row', alignItems: 'center' },
  card: { height: 140, borderRadius: 14, overflow: 'hidden', marginRight: 12, justifyContent: 'flex-end' },
  cardImage: { borderRadius: 14 },
  overlay: { backgroundColor: 'rgba(0,0,0,0.28)', padding: 12 },
  cardTitle: { color: '#fff', fontFamily: 'Poppins-Medium', fontSize: 14, lineHeight: 19, marginBottom: 6 },
  link: { color: '#C9F0FF', fontFamily: 'Poppins-Bold', fontSize: 12 },
  navBtn: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(200,200,200,0.4)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftBtn: { left: -6, top: 55 },
  rightBtn: { right: -6, top: 55 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  dotActive: { backgroundColor: '#333' },
  dotInactive: { backgroundColor: '#bbb' }
});
