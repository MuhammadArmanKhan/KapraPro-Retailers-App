import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Heart, ShoppingCart, Star, Package, Truck, Eye } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  interpolate,
  useAnimatedScrollHandler,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = screenWidth - 40;

interface Product {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
  pricePerMeter: number;
  minOrder: number;
  rating: number;
  reviews: number;
  images: string[];
  colors: string[];
  inStock: boolean;
  fastDelivery: boolean;
  description: string;
  specifications: {
    weight: string;
    width: string;
    composition: string;
  };
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function CatalogScreen() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation values
  const headerOpacity = useSharedValue(1);
  const searchBarOpacity = useSharedValue(1);
  const categoriesOpacity = useSharedValue(1);
  const productsOpacity = useSharedValue(1);
  const scrollY = useSharedValue(0);

  const categories = ['All', 'Cotton', 'Silk', 'Lawn', 'Denim', 'Wash n Wear', 'Linen'];

  // Mock data
  const mockProducts: Product[] = [
    {
      id: 'prod-001',
      name: 'Premium Cotton Fabric',
      manufacturer: 'Usman Cotton Mills',
      category: 'Cotton',
      pricePerMeter: 230,
      minOrder: 50,
      rating: 4.8,
      reviews: 124,
      images: [
        'https://images.pexels.com/photos/6291629/pexels-photo-6291629.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
      colors: ['#FFFFFF', '#F5F5DC', '#E6E6FA'],
      inStock: true,
      fastDelivery: true,
      description: 'High-quality premium cotton fabric perfect for formal wear and casual clothing.',
      specifications: {
        weight: '180 GSM',
        width: '58 inches',
        composition: '100% Cotton',
      },
    },
    {
      id: 'prod-002',
      name: 'Silk Blend Luxury',
      manufacturer: 'Al-Karam Textiles',
      category: 'Silk',
      pricePerMeter: 450,
      minOrder: 25,
      rating: 4.9,
      reviews: 89,
      images: [
        'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/6291629/pexels-photo-6291629.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
      colors: ['#FFB6C1', '#DDA0DD', '#F0E68C'],
      inStock: true,
      fastDelivery: false,
      description: 'Luxurious silk blend fabric with excellent drape and sheen.',
      specifications: {
        weight: '120 GSM',
        width: '44 inches',
        composition: '70% Silk, 30% Cotton',
      },
    },
    {
      id: 'prod-003',
      name: 'Wash n Wear Classic',
      manufacturer: 'Nishat Mills',
      category: 'Wash n Wear',
      pricePerMeter: 180,
      minOrder: 100,
      rating: 4.6,
      reviews: 256,
      images: [
        'https://images.pexels.com/photos/6291629/pexels-photo-6291629.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
      colors: ['#87CEEB', '#98FB98', '#F0E68C'],
      inStock: true,
      fastDelivery: true,
      description: 'Easy-care wash and wear fabric ideal for everyday clothing.',
      specifications: {
        weight: '150 GSM',
        width: '58 inches',
        composition: '65% Polyester, 35% Cotton',
      },
    },
    {
      id: 'prod-004',
      name: 'Lawn Print Collection',
      manufacturer: 'Gul Ahmed',
      category: 'Lawn',
      pricePerMeter: 320,
      minOrder: 30,
      rating: 4.7,
      reviews: 178,
      images: [
        'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/6291629/pexels-photo-6291629.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
      colors: ['#FFE4E1', '#E0FFFF', '#F5FFFA'],
      inStock: false,
      fastDelivery: false,
      description: 'Beautiful printed lawn fabric perfect for summer wear.',
      specifications: {
        weight: '80 GSM',
        width: '58 inches',
        composition: '100% Cotton',
      },
    },
  ];

  // Load data immediately when component mounts
  useEffect(() => {
    if (!isLoaded) {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      
      // Initialize image indices
      const initialIndices: { [key: string]: number } = {};
      mockProducts.forEach(product => {
        initialIndices[product.id] = 0;
      });
      setCurrentImageIndex(initialIndices);
      setIsLoaded(true);
    }
  }, [isLoaded]);

  // Separate effect for animations that only runs once
  useEffect(() => {
    const startAnimations = () => {
      headerOpacity.value = withTiming(1, { duration: 300 });
      searchBarOpacity.value = withTiming(1, { duration: 300 });
      categoriesOpacity.value = withTiming(1, { duration: 300 });
      productsOpacity.value = withTiming(1, { duration: 300 });
    };

    startAnimations();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const filterProducts = () => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const handleImageSwipe = (productId: string, direction: 'left' | 'right') => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const currentIndex = currentImageIndex[productId] || 0;
    let newIndex = currentIndex;

    if (direction === 'right' && currentIndex < product.images.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'left' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }

    setCurrentImageIndex(prev => ({ ...prev, [productId]: newIndex }));
  };

  const handlePlaceOrder = (product: Product) => {
    router.push({
      pathname: '/place-order',
      params: { 
        productId: product.id,
        productName: product.name,
        manufacturer: product.manufacturer,
        pricePerMeter: product.pricePerMeter.toString(),
        minOrder: product.minOrder.toString(),
      },
    });
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      {
        translateY: interpolate(headerOpacity.value, [0, 1], [20, 0]),
      },
    ],
  }));

  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    opacity: searchBarOpacity.value,
    transform: [
      {
        translateY: interpolate(searchBarOpacity.value, [0, 1], [20, 0]),
      },
    ],
  }));

  const categoriesAnimatedStyle = useAnimatedStyle(() => ({
    opacity: categoriesOpacity.value,
  }));

  const productsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: productsOpacity.value,
  }));

  const renderProductCard = (product: Product, index: number) => {
    const isFavorite = favorites.has(product.id);
    const currentImage = currentImageIndex[product.id] || 0;

    return (
      <Animated.View
        key={product.id}
        style={[
          styles.productCard,
          {
            opacity: productsOpacity.value,
            transform: [
              {
                translateY: interpolate(
                  productsOpacity.value,
                  [0, 1],
                  [50 + index * 10, 0]
                ),
              },
            ],
          },
        ]}
      >
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
              setCurrentImageIndex(prev => ({ ...prev, [product.id]: newIndex }));
            }}
          >
            {product.images.map((image, imageIndex) => (
              <Image
                key={imageIndex}
                source={{ uri: image }}
                style={styles.productImage}
              />
            ))}
          </ScrollView>

          {/* Image Indicators */}
          {product.images.length > 1 && (
            <View style={styles.imageIndicators}>
              {product.images.map((_, imageIndex) => (
                <View
                  key={imageIndex}
                  style={[
                    styles.indicator,
                    currentImage === imageIndex && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Badges */}
          <View style={styles.badges}>
            {!product.inStock && (
              <View style={styles.outOfStockBadge}>
                <Text style={styles.badgeText}>Out of Stock</Text>
              </View>
            )}
            {product.fastDelivery && (
              <View style={styles.fastDeliveryBadge}>
                <Truck size={12} color="#FFF" />
                <Text style={styles.badgeText}>Fast</Text>
              </View>
            )}
          </View>

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(product.id)}
            activeOpacity={0.8}
          >
            <Heart
              size={20}
              color={isFavorite ? "#DC2626" : "#666"}
              fill={isFavorite ? "#DC2626" : "transparent"}
            />
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={styles.productContent}>
          <View style={styles.productHeader}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={14} color="#FFC107" fill="#FFC107" />
              <Text style={styles.rating}>{product.rating}</Text>
              <Text style={styles.reviews}>({product.reviews})</Text>
            </View>
          </View>

          <Text style={styles.manufacturer}>{product.manufacturer}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>

          {/* Colors */}
          <View style={styles.colorsContainer}>
            <Text style={styles.colorsLabel}>Colors:</Text>
            <View style={styles.colorSwatches}>
              {product.colors.slice(0, 4).map((color, colorIndex) => (
                <View
                  key={colorIndex}
                  style={[styles.colorSwatch, { backgroundColor: color }]}
                />
              ))}
              {product.colors.length > 4 && (
                <Text style={styles.moreColors}>+{product.colors.length - 4}</Text>
              )}
            </View>
          </View>

          {/* Specifications */}
          <View style={styles.specsContainer}>
            <Text style={styles.specText}>{product.specifications.weight}</Text>
            <Text style={styles.specDivider}>•</Text>
            <Text style={styles.specText}>{product.specifications.width}</Text>
            <Text style={styles.specDivider}>•</Text>
            <Text style={styles.specText}>Min: {product.minOrder}m</Text>
          </View>

          {/* Price and Actions */}
          <View style={styles.priceSection}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>PKR {product.pricePerMeter.toLocaleString()}</Text>
              <Text style={styles.priceUnit}>/meter</Text>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.viewButton} activeOpacity={0.8}>
                <Eye size={16} color="#666" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.orderButton,
                  !product.inStock && styles.disabledButton,
                ]}
                onPress={() => handlePlaceOrder(product)}
                disabled={!product.inStock}
                activeOpacity={0.8}
              >
                <ShoppingCart size={16} color="#FFF" />
                <Text style={styles.orderButtonText}>Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Text style={styles.headerTitle}>Fabric Catalogue</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={24} color="#000" />
        </TouchableOpacity>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View style={[styles.searchContainer, searchBarAnimatedStyle]}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search fabrics, manufacturers..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Animated.View>

      {/* Categories */}
      <Animated.View style={[styles.categoriesContainer, categoriesAnimatedStyle]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categories}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.activeCategoryButton,
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.activeCategoryText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Products List */}
      <Animated.ScrollView
        style={styles.productsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Animated.View style={productsAnimatedStyle}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => renderProductCard(product, index))
          ) : (
            <View style={styles.emptyState}>
              <Package size={48} color="#CCC" />
              <Text style={styles.emptyText}>No products found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your search or filter criteria
              </Text>
            </View>
          )}
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000',
  },
  categoriesContainer: {
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
  },
  activeCategoryButton: {
    backgroundColor: '#000',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  activeCategoryText: {
    color: '#FFF',
  },
  productsList: {
    flex: 1,
  },
  productsContent: {
    padding: 20,
    paddingBottom: 100,
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  productImage: {
    width: cardWidth,
    height: 200,
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: '#FFF',
  },
  badges: {
    position: 'absolute',
    top: 12,
    left: 12,
    gap: 6,
  },
  outOfStockBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fastDeliveryBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productContent: {
    padding: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000',
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  reviews: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  manufacturer: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  colorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorsLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginRight: 8,
  },
  colorSwatches: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  moreColors: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginLeft: 4,
  },
  specsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  specText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  specDivider: {
    fontSize: 12,
    color: '#CCC',
    marginHorizontal: 8,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  priceUnit: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  orderButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});