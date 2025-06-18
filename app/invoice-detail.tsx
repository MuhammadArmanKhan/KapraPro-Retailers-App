import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Download, Share, FileText, Calendar, Building, Package, CreditCard, Printer } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceDetails {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Overdue' | 'Pending';
  orderNumber: string;
  manufacturerName: string;
  manufacturerAddress: string;
  manufacturerTax: string;
  buyerName: string;
  buyerAddress: string;
  buyerTax?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  paymentTerms: string;
  notes?: string;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function InvoiceDetailScreen() {
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(null);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const itemsOpacity = useSharedValue(0);

  // Mock data
  const mockInvoiceDetails: InvoiceDetails = {
    invoiceNumber: params.invoiceNumber as string || 'INV-2025-1042',
    invoiceDate: '12 June 2025',
    dueDate: '27 June 2025',
    status: 'Pending',
    orderNumber: 'ORD-1042',
    manufacturerName: 'Usman Cotton Mills',
    manufacturerAddress: 'Industrial Area, Faisalabad, Punjab, Pakistan',
    manufacturerTax: 'NTN: 1234567-8',
    buyerName: 'Khan Cloth House',
    buyerAddress: 'Shop #45, Anarkali Bazaar, Lahore, Punjab',
    buyerTax: 'NTN: 8765432-1',
    items: [
      {
        id: 'item-1',
        description: 'Premium Cotton Fabric - 180 GSM, 58" Width',
        quantity: 150,
        rate: 230,
        amount: 34500,
      },
      {
        id: 'item-2',
        description: 'Cotton Blend Fabric - 160 GSM, 58" Width',
        quantity: 50,
        rate: 200,
        amount: 10000,
      },
    ],
    subtotal: 44500,
    taxRate: 17,
    taxAmount: 7565,
    total: 52065,
    amountPaid: 0,
    balanceDue: 52065,
    paymentTerms: 'Net 30 Days',
    notes: 'Payment due within 30 days of invoice date. Late payments may incur additional charges.',
  };

  useEffect(() => {
    setTimeout(() => {
      setInvoiceDetails(mockInvoiceDetails);
      
      // Start animations
      headerOpacity.value = withTiming(1, { duration: 600 });
      contentOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
      itemsOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    }, 100);
  }, []);

  const getStatusColor = (status: string) => {
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

  const handleDownloadInvoice = () => {
    Alert.alert('Download Invoice', 'Invoice PDF will be downloaded to your device');
  };

  const handleShareInvoice = () => {
    Alert.alert('Share Invoice', 'Share options would appear here');
  };

  const handlePrintInvoice = () => {
    Alert.alert('Print Invoice', 'Print options would appear here');
  };

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      {
        translateY: interpolate(headerOpacity.value, [0, 1], [20, 0]),
      },
    ],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const itemsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: itemsOpacity.value,
  }));

  const renderInvoiceItem = (item: InvoiceItem, index: number) => (
    <Animated.View
      key={item.id}
      style={[
        styles.itemRow,
        {
          opacity: itemsOpacity.value,
          transform: [
            {
              translateY: interpolate(
                itemsOpacity.value,
                [0, 1],
                [20 + index * 5, 0]
              ),
            },
          ],
        },
      ]}
    >
      <View style={styles.itemDescription}>
        <Text style={styles.itemDescriptionText}>{item.description}</Text>
      </View>
      <View style={styles.itemQuantity}>
        <Text style={styles.itemQuantityText}>{item.quantity}</Text>
      </View>
      <View style={styles.itemRate}>
        <Text style={styles.itemRateText}>{formatCurrency(item.rate)}</Text>
      </View>
      <View style={styles.itemAmount}>
        <Text style={styles.itemAmountText}>{formatCurrency(item.amount)}</Text>
      </View>
    </Animated.View>
  );

  if (!invoiceDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading invoice details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusStyle = getStatusColor(invoiceDetails.status);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invoice Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={handlePrintInvoice}
            activeOpacity={0.8}
          >
            <Printer size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={handleShareInvoice}
            activeOpacity={0.8}
          >
            <Share size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Invoice Header */}
        <Animated.View style={[styles.invoiceHeader, contentAnimatedStyle]}>
          <View style={styles.invoiceHeaderCard}>
            <View style={styles.invoiceTitle}>
              <FileText size={32} color="#000" />
              <Text style={styles.invoiceTitleText}>INVOICE</Text>
            </View>
            
            <View style={styles.invoiceInfo}>
              <View style={styles.invoiceInfoRow}>
                <Text style={styles.invoiceLabel}>Invoice #:</Text>
                <Text style={styles.invoiceValue}>{invoiceDetails.invoiceNumber}</Text>
              </View>
              <View style={styles.invoiceInfoRow}>
                <Text style={styles.invoiceLabel}>Order #:</Text>
                <Text style={styles.invoiceValue}>{invoiceDetails.orderNumber}</Text>
              </View>
              <View style={styles.invoiceInfoRow}>
                <Text style={styles.invoiceLabel}>Date:</Text>
                <Text style={styles.invoiceValue}>{invoiceDetails.invoiceDate}</Text>
              </View>
              <View style={styles.invoiceInfoRow}>
                <Text style={styles.invoiceLabel}>Due Date:</Text>
                <Text style={styles.invoiceValue}>{invoiceDetails.dueDate}</Text>
              </View>
            </View>
            
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
              <Text style={[styles.statusText, { color: statusStyle.color }]}>
                {invoiceDetails.status}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Parties Information */}
        <Animated.View style={[styles.partiesSection, contentAnimatedStyle]}>
          <View style={styles.partiesCard}>
            <View style={styles.partyInfo}>
              <Text style={styles.partyTitle}>From:</Text>
              <Text style={styles.partyName}>{invoiceDetails.manufacturerName}</Text>
              <Text style={styles.partyAddress}>{invoiceDetails.manufacturerAddress}</Text>
              <Text style={styles.partyTax}>{invoiceDetails.manufacturerTax}</Text>
            </View>
            
            <View style={styles.partyInfo}>
              <Text style={styles.partyTitle}>To:</Text>
              <Text style={styles.partyName}>{invoiceDetails.buyerName}</Text>
              <Text style={styles.partyAddress}>{invoiceDetails.buyerAddress}</Text>
              {invoiceDetails.buyerTax && (
                <Text style={styles.partyTax}>{invoiceDetails.buyerTax}</Text>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Invoice Items */}
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.itemsCard}>
            {/* Table Header */}
            <View style={styles.itemsHeader}>
              <View style={styles.itemDescription}>
                <Text style={styles.headerText}>Description</Text>
              </View>
              <View style={styles.itemQuantity}>
                <Text style={styles.headerText}>Qty</Text>
              </View>
              <View style={styles.itemRate}>
                <Text style={styles.headerText}>Rate</Text>
              </View>
              <View style={styles.itemAmount}>
                <Text style={styles.headerText}>Amount</Text>
              </View>
            </View>
            
            {/* Items */}
            {invoiceDetails.items.map((item, index) => renderInvoiceItem(item, index))}
          </View>
        </View>

        {/* Invoice Summary */}
        <Animated.View style={[styles.summarySection, contentAnimatedStyle]}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(invoiceDetails.subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax ({invoiceDetails.taxRate}%):</Text>
              <Text style={styles.summaryValue}>{formatCurrency(invoiceDetails.taxAmount)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{formatCurrency(invoiceDetails.total)}</Text>
            </View>
            
            {invoiceDetails.amountPaid > 0 && (
              <>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Amount Paid:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(invoiceDetails.amountPaid)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.balanceRow]}>
                  <Text style={styles.balanceLabel}>Balance Due:</Text>
                  <Text style={styles.balanceValue}>{formatCurrency(invoiceDetails.balanceDue)}</Text>
                </View>
              </>
            )}
          </View>
        </Animated.View>

        {/* Payment Terms & Notes */}
        <Animated.View style={[styles.termsSection, contentAnimatedStyle]}>
          <View style={styles.termsCard}>
            <View style={styles.termsRow}>
              <CreditCard size={16} color="#666" />
              <Text style={styles.termsText}>Payment Terms: {invoiceDetails.paymentTerms}</Text>
            </View>
            
            {invoiceDetails.notes && (
              <View style={styles.notesSection}>
                <Text style={styles.notesTitle}>Notes:</Text>
                <Text style={styles.notesText}>{invoiceDetails.notes}</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[styles.actionsSection, contentAnimatedStyle]}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleDownloadInvoice}
            activeOpacity={0.8}
          >
            <Download size={20} color="#FFF" />
            <Text style={styles.primaryButtonText}>Download PDF</Text>
          </TouchableOpacity>
          
          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push({
                pathname: '/order-details',
                params: { orderId: invoiceDetails.orderNumber },
              })}
              activeOpacity={0.8}
            >
              <Package size={18} color="#000" />
              <Text style={styles.secondaryButtonText}>View Order</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => Alert.alert('Payment', 'Payment options would appear here')}
              activeOpacity={0.8}
            >
              <CreditCard size={18} color="#000" />
              <Text style={styles.secondaryButtonText}>Make Payment</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000',
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  invoiceHeader: {
    padding: 20,
  },
  invoiceHeaderCard: {
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
  invoiceTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  invoiceTitleText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginLeft: 12,
  },
  invoiceInfo: {
    marginBottom: 16,
  },
  invoiceInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  invoiceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  invoiceValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  partiesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  partiesCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  partyInfo: {
    marginBottom: 20,
  },
  partyTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  partyName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 4,
  },
  partyAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  partyTax: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  itemsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 16,
  },
  itemsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  itemsHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  itemDescription: {
    flex: 2,
    paddingRight: 12,
  },
  itemQuantity: {
    flex: 0.5,
    alignItems: 'center',
  },
  itemRate: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 12,
  },
  itemAmount: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
    textTransform: 'uppercase',
  },
  itemDescriptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000',
    lineHeight: 20,
  },
  itemQuantityText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  itemRateText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  itemAmountText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  summarySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  balanceRow: {
    backgroundColor: '#FEF2F2',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: -20,
    marginTop: 12,
  },
  balanceLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#DC2626',
  },
  balanceValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#DC2626',
  },
  termsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  termsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  termsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginLeft: 8,
  },
  notesSection: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  notesTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 20,
  },
  actionsSection: {
    paddingHorizontal: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    gap: 6,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
});