import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Download, ChevronDown, ChevronUp, CreditCard, Calendar, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, DollarSign, FileText, Bell, BellOff } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  interpolate,
  runOnJS,
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { useLanguage } from '@/contexts/LanguageContext';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amountBilled: number;
  amountPaid: number;
  status: 'Paid' | 'Partial' | 'Overdue' | 'Pending';
  dueDate: string;
}

interface ManufacturerLedger {
  id: string;
  name: string;
  logo?: string;
  currentBalance: number;
  oldestDue: string;
  daysOverdue?: number;
  invoices: Invoice[];
  paymentReminders: boolean;
}

interface CreditData {
  totalOutstanding: number;
  nextDueDate: string;
  nextDueAmount: number;
  manufacturers: ManufacturerLedger[];
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function CreditLedgerScreen() {
  const { t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Overdue' | 'Settled' | 'Partial'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLedger, setExpandedLedger] = useState<string | null>(null);
  const [creditData, setCreditData] = useState<CreditData | null>(null);
  const [filteredManufacturers, setFilteredManufacturers] = useState<ManufacturerLedger[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation values
  const headerOpacity = useSharedValue(1);
  const filtersOpacity = useSharedValue(1);
  const ledgerOpacity = useSharedValue(1);

  // Mock data
  const mockCreditData: CreditData = {
    totalOutstanding: 245000,
    nextDueDate: '18 June 2025',
    nextDueAmount: 45000,
    manufacturers: [
      {
        id: 'mfg-001',
        name: 'Usman Cotton Mills',
        currentBalance: 85000,
        oldestDue: 'Due in 2 days',
        daysOverdue: 0,
        paymentReminders: true,
        invoices: [
          {
            id: 'inv-001',
            invoiceNumber: 'INV-2193',
            date: '10 June 2025',
            amountBilled: 45000,
            amountPaid: 45000,
            status: 'Paid',
            dueDate: '25 June 2025',
          },
          {
            id: 'inv-002',
            invoiceNumber: 'INV-2194',
            date: '12 June 2025',
            amountBilled: 40000,
            amountPaid: 0,
            status: 'Pending',
            dueDate: '27 June 2025',
          },
        ],
      },
      {
        id: 'mfg-002',
        name: 'Al-Karam Textiles',
        currentBalance: 65000,
        oldestDue: 'Overdue by 3 days',
        daysOverdue: 3,
        paymentReminders: false,
        invoices: [
          {
            id: 'inv-003',
            invoiceNumber: 'INV-2195',
            date: '8 June 2025',
            amountBilled: 35000,
            amountPaid: 15000,
            status: 'Partial',
            dueDate: '15 June 2025',
          },
          {
            id: 'inv-004',
            invoiceNumber: 'INV-2196',
            date: '5 June 2025',
            amountBilled: 30000,
            amountPaid: 0,
            status: 'Overdue',
            dueDate: '12 June 2025',
          },
        ],
      },
      {
        id: 'mfg-003',
        name: 'Nishat Mills',
        currentBalance: 95000,
        oldestDue: 'Due in 7 days',
        daysOverdue: 0,
        paymentReminders: true,
        invoices: [
          {
            id: 'inv-005',
            invoiceNumber: 'INV-2197',
            date: '14 June 2025',
            amountBilled: 55000,
            amountPaid: 0,
            status: 'Pending',
            dueDate: '29 June 2025',
          },
          {
            id: 'inv-006',
            invoiceNumber: 'INV-2198',
            date: '11 June 2025',
            amountBilled: 40000,
            amountPaid: 40000,
            status: 'Paid',
            dueDate: '26 June 2025',
          },
        ],
      },
    ],
  };

  useEffect(() => {
    if (!isLoaded) {
      setCreditData(mockCreditData);
      filterManufacturers(mockCreditData.manufacturers, selectedFilter, searchQuery);
      setIsLoaded(true);
    }
  }, [isLoaded]);

  // Separate effect for animations that only runs once
  useEffect(() => {
    const startAnimations = () => {
      headerOpacity.value = withTiming(1, { duration: 300 });
      filtersOpacity.value = withTiming(1, { duration: 300 });
      ledgerOpacity.value = withTiming(1, { duration: 300 });
    };

    startAnimations();
  }, []);

  useEffect(() => {
    if (creditData) {
      filterManufacturers(creditData.manufacturers, selectedFilter, searchQuery);
    }
  }, [selectedFilter, searchQuery, creditData]);

  const filterManufacturers = (manufacturers: ManufacturerLedger[], filter: string, query: string) => {
    let filtered = manufacturers;

    // Filter by status
    if (filter !== 'All') {
      filtered = filtered.filter(manufacturer => {
        const hasMatchingInvoices = manufacturer.invoices.some(invoice => {
          switch (filter) {
            case 'Overdue':
              return invoice.status === 'Overdue';
            case 'Settled':
              return invoice.status === 'Paid';
            case 'Partial':
              return invoice.status === 'Partial';
            default:
              return true;
          }
        });
        return hasMatchingInvoices || (filter === 'Overdue' && manufacturer.daysOverdue && manufacturer.daysOverdue > 0);
      });
    }

    // Filter by search query
    if (query) {
      filtered = filtered.filter(manufacturer =>
        manufacturer.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredManufacturers(filtered);
  };

  const toggleLedgerExpansion = (ledgerId: string) => {
    setExpandedLedger(expandedLedger === ledgerId ? null : ledgerId);
  };

  const togglePaymentReminders = (manufacturerId: string) => {
    if (!creditData) return;
    
    const updatedManufacturers = creditData.manufacturers.map(manufacturer =>
      manufacturer.id === manufacturerId
        ? { ...manufacturer, paymentReminders: !manufacturer.paymentReminders }
        : manufacturer
    );
    
    setCreditData({ ...creditData, manufacturers: updatedManufacturers });
    Alert.alert(
      'Payment Reminders',
      `Payment reminders ${updatedManufacturers.find(m => m.id === manufacturerId)?.paymentReminders ? 'enabled' : 'disabled'}`
    );
  };

  const downloadLedgerPDF = () => {
    Alert.alert('Download Ledger', 'Ledger PDF will be downloaded to your device');
  };

  const getInvoiceStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle size={16} color="#059669" />;
      case 'Partial':
        return <Clock size={16} color="#D97706" />;
      case 'Overdue':
        return <AlertTriangle size={16} color="#DC2626" />;
      case 'Pending':
        return <Clock size={16} color="#3B82F6" />;
      default:
        return <Clock size={16} color="#6B7280" />;
    }
  };

  const getInvoiceStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid':
        return { backgroundColor: '#ECFDF5', color: '#059669' };
      case 'Partial':
        return { backgroundColor: '#FFFBEB', color: '#D97706' };
      case 'Overdue':
        return { backgroundColor: '#FEF2F2', color: '#DC2626' };
      case 'Pending':
        return { backgroundColor: '#EFF6FF', color: '#3B82F6' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  const getPaymentProgress = (invoice: Invoice) => {
    return invoice.amountBilled > 0 ? (invoice.amountPaid / invoice.amountBilled) * 100 : 0;
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      {
        translateY: interpolate(headerOpacity.value, [0, 1], [20, 0]),
      },
    ],
  }));

  const filtersAnimatedStyle = useAnimatedStyle(() => ({
    opacity: filtersOpacity.value,
  }));

  const ledgerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: ledgerOpacity.value,
  }));

  const renderInvoiceCard = (invoice: Invoice) => {
    const statusStyle = getInvoiceStatusColor(invoice.status);
    const progress = getPaymentProgress(invoice);
    const isOverdue = invoice.status === 'Overdue';

    return (
      <View
        key={invoice.id}
        style={[
          styles.invoiceCard,
          isOverdue && styles.overdueInvoice,
        ]}
      >
        <View style={styles.invoiceHeader}>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
            <Text style={styles.invoiceDate}>{invoice.date}</Text>
          </View>
          <View style={[styles.invoiceStatusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
            {getInvoiceStatusIcon(invoice.status)}
            <Text style={[styles.invoiceStatusText, { color: statusStyle.color }]}>
              {invoice.status}
            </Text>
          </View>
        </View>

        <View style={styles.invoiceAmounts}>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Billed:</Text>
            <Text style={styles.amountValue}>{formatCurrency(invoice.amountBilled)}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Paid:</Text>
            <Text style={styles.amountValue}>{formatCurrency(invoice.amountPaid)}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Due Date:</Text>
            <Text style={[styles.amountValue, isOverdue && styles.overdueText]}>
              {invoice.dueDate}
            </Text>
          </View>
        </View>

        {invoice.status === 'Partial' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}% paid</Text>
          </View>
        )}

        <TouchableOpacity style={styles.viewInvoiceButton} activeOpacity={0.8}>
          <FileText size={16} color="#000" />
          <Text style={styles.viewInvoiceText}>View Full Invoice</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderManufacturerCard = (manufacturer: ManufacturerLedger, index: number) => {
    const isExpanded = expandedLedger === manufacturer.id;
    const isOverdue = manufacturer.daysOverdue && manufacturer.daysOverdue > 0;

    return (
      <Animated.View
        key={manufacturer.id}
        style={[
          styles.manufacturerCard,
          isOverdue && styles.overdueCard,
          {
            opacity: ledgerOpacity.value,
            transform: [
              {
                translateY: interpolate(
                  ledgerOpacity.value,
                  [0, 1],
                  [50 + index * 10, 0]
                ),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.manufacturerHeader}
          onPress={() => toggleLedgerExpansion(manufacturer.id)}
          activeOpacity={0.8}
        >
          <View style={styles.manufacturerInfo}>
            <View style={styles.manufacturerTopRow}>
              <Text style={styles.manufacturerName}>{manufacturer.name}</Text>
              <TouchableOpacity
                style={styles.reminderButton}
                onPress={() => togglePaymentReminders(manufacturer.id)}
                activeOpacity={0.8}
              >
                {manufacturer.paymentReminders ? (
                  <Bell size={16} color="#059669" />
                ) : (
                  <BellOff size={16} color="#999" />
                )}
              </TouchableOpacity>
            </View>
            
            <Text style={styles.currentBalance}>
              {formatCurrency(manufacturer.currentBalance)}
            </Text>
            
            <Text style={[
              styles.oldestDue,
              isOverdue && styles.overdueText,
            ]}>
              {manufacturer.oldestDue}
            </Text>
          </View>
          
          <View style={styles.expandIcon}>
            {isExpanded ? (
              <ChevronUp size={24} color="#666" />
            ) : (
              <ChevronDown size={24} color="#666" />
            )}
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <Animated.View
            style={styles.expandedContent}
            entering={() => {
              'worklet';
              return {
                opacity: withTiming(1, { duration: 300 }),
                height: withSpring(manufacturer.invoices.length * 200, { damping: 15, stiffness: 150 }),
              };
            }}
            exiting={() => {
              'worklet';
              return {
                opacity: withTiming(0, { duration: 200 }),
                height: withTiming(0, { duration: 200 }),
              };
            }}
          >
            <View style={styles.invoicesSection}>
              <Text style={styles.sectionTitle}>Recent Invoices</Text>
              {manufacturer.invoices.slice(0, 3).map(invoice => renderInvoiceCard(invoice))}
            </View>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  if (!creditData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading credit ledger...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Credit Ledger</Text>
        <TouchableOpacity style={styles.downloadButton} onPress={downloadLedgerPDF}>
          <Download size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Summary Section */}
        <Animated.View style={[styles.summarySection, headerAnimatedStyle]}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <CreditCard size={32} color="#DC2626" />
              <Text style={styles.summaryTitle}>Total Outstanding</Text>
            </View>
            <Text style={styles.totalAmount}>
              {formatCurrency(creditData.totalOutstanding)}
            </Text>
            
            <View style={styles.nextDueContainer}>
              <Calendar size={16} color="#666" />
              <Text style={styles.nextDueText}>
                Next Due: {formatCurrency(creditData.nextDueAmount)} on {creditData.nextDueDate}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View style={[styles.searchContainer, filtersAnimatedStyle]}>
          <View style={styles.searchBar}>
            <Search size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search manufacturers..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </Animated.View>

        {/* Filters */}
        <Animated.View style={[styles.filtersContainer, filtersAnimatedStyle]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filters}>
              {(['All', 'Overdue', 'Settled', 'Partial'] as const).map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterButton,
                    selectedFilter === filter && styles.activeFilter,
                  ]}
                  onPress={() => setSelectedFilter(filter)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedFilter === filter && styles.activeFilterText,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Manufacturer Ledgers */}
        <View style={styles.ledgersList}>
          <Animated.View style={ledgerAnimatedStyle}>
            {filteredManufacturers.length > 0 ? (
              filteredManufacturers.map((manufacturer, index) => 
                renderManufacturerCard(manufacturer, index)
              )
            ) : (
              <View style={styles.emptyState}>
                <CreditCard size={48} color="#CCC" />
                <Text style={styles.emptyText}>No ledgers found</Text>
                <Text style={styles.emptySubtext}>
                  No manufacturers match your current filter criteria
                </Text>
              </View>
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666',
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
  downloadButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  summarySection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginLeft: 12,
  },
  totalAmount: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#DC2626',
    marginBottom: 16,
  },
  nextDueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextDueText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginLeft: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  filters: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeFilter: {
    backgroundColor: '#000',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  activeFilterText: {
    color: '#FFF',
  },
  ledgersList: {
    paddingHorizontal: 20,
  },
  manufacturerCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  overdueCard: {
    borderColor: '#FEE2E2',
    backgroundColor: '#FFFBFB',
  },
  manufacturerHeader: {
    flexDirection: 'row',
    padding: 20,
  },
  manufacturerInfo: {
    flex: 1,
  },
  manufacturerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  manufacturerName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000',
    flex: 1,
  },
  reminderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  currentBalance: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#DC2626',
    marginBottom: 8,
  },
  oldestDue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  overdueText: {
    color: '#DC2626',
  },
  expandIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
  },
  invoicesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 16,
  },
  invoiceCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  overdueInvoice: {
    borderColor: '#FEE2E2',
    backgroundColor: '#FFFBFB',
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 4,
  },
  invoiceDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  invoiceStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  invoiceStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  invoiceAmounts: {
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  amountLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  amountValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    textAlign: 'right',
  },
  viewInvoiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  viewInvoiceText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
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