import { api } from '../services/api';

export const OWNER_PHONE = '9553536884';
export const OWNER_PHONE_INTL = '919553536884';
export const STORE_NAME = 'Chandhana Shoe Mart';
export const STORE_LANDMARK = 'Opp: Tata Theatre, Main Road, Tagarapuvalasa - 531162';

export const logWhatsAppEnquiry = async (data: {
  customerName?: string;
  phone?: string;
  productId?: string;
  productTitle?: string;
  sku?: string;
  brand?: string;
  price?: number;
  imageUrl?: string;
  size?: string;
  color?: string;
  message?: string;
  source?: string;
}) => {
  try {
    await api.enquiries.log({
      customerName: data.customerName || 'Store Visitor',
      phone: data.phone,
      productId: data.productId,
      productTitle: data.productTitle,
      sku: data.sku,
      brand: data.brand,
      price: data.price,
      imageUrl: data.imageUrl,
      size: data.size,
      color: data.color,
      message: data.message || 'WhatsApp product inquiry',
      source: data.source || 'PRODUCT_DETAIL',
    });
  } catch (e) {
    console.warn('Failed to log WhatsApp inquiry:', e);
  }
};

export const openWhatsAppWithLog = (
  url: string,
  logData?: {
    customerName?: string;
    phone?: string;
    productId?: string;
    productTitle?: string;
    sku?: string;
    brand?: string;
    price?: number;
    imageUrl?: string;
    size?: string;
    color?: string;
    message?: string;
    source?: string;
  }
) => {
  if (logData) {
    logWhatsAppEnquiry(logData);
  }
  window.open(url, '_blank');
};

export const getWhatsAppGeneralInquiryUrl = (): string => {
  const text = `Hello Chandhana Shoe Mart, I would like to inquire about your footwear collection and current prices.`;
  return `https://wa.me/${OWNER_PHONE_INTL}?text=${encodeURIComponent(text)}`;
};

export const getWhatsAppProductUrl = (
  productName: string,
  price: string | number,
  size?: string,
  color?: string
): string => {
  const formattedPrice = typeof price === 'number' ? `₹${price}` : price;
  const sizeText = size ? ` | Size: ${size}` : '';
  const colorText = color ? ` | Color: ${color}` : '';
  const text = `Hello Chandhana Shoe Mart,\nI am interested in:\n👞 *${productName}*\n💰 Price: *${formattedPrice}*${sizeText}${colorText}\n\nPlease let me know the best price, discount, and availability. Thank you!`;
  return `https://wa.me/${OWNER_PHONE_INTL}?text=${encodeURIComponent(text)}`;
};

export interface CartWhatsAppItem {
  title: string;
  size?: string;
  colorName?: string;
  quantity: number;
  unitPrice: number;
}

export const getWhatsAppCartOrderUrl = (
  items: CartWhatsAppItem[],
  total: number
): string => {
  if (!items || items.length === 0) {
    return getWhatsAppGeneralInquiryUrl();
  }

  const itemsList = items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.title}*${item.size ? ` (Size: ${item.size})` : ''} x ${item.quantity} = ₹${item.unitPrice * item.quantity}`
    )
    .join('\n');

  const text = `Hello Chandhana Shoe Mart,\nI would like to order the following items directly with you:\n\n${itemsList}\n\n*Total Amount: ₹${total}*\n\nPlease confirm availability and payment/delivery details. Thank you!`;
  return `https://wa.me/${OWNER_PHONE_INTL}?text=${encodeURIComponent(text)}`;
};
