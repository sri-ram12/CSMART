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
  color?: string,
  productSlug?: string,
  imageUrl?: string,
  sku?: string
): string => {
  const domain = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://www.chandhanashoemart.com';
  const formattedPrice = typeof price === 'number' ? `₹${price}` : price;
  const sizeText = size ? ` | Size: ${size}` : '';
  const colorText = color ? ` | Color: ${color}` : '';
  const skuText = sku ? ` (SKU: ${sku})` : '';

  let fullImageUrl = '';
  if (imageUrl) {
    fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${domain}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }
  const productUrl = productSlug ? `${domain}/product/${productSlug}` : '';

  const text = `Hello Chandhana Shoe Mart! 👋\nI am interested in this footwear:\n\n👞 *${productName}*${skuText}\n💰 *Price:* ${formattedPrice}${sizeText}${colorText}\n\n${productUrl ? `🔗 *Product Link:* ${productUrl}\n` : ''}${fullImageUrl ? `📸 *Photo:* ${fullImageUrl}\n` : ''}\nPlease let me know if my size is in stock and available for delivery. Thank you!`;
  return `https://wa.me/${OWNER_PHONE_INTL}?text=${encodeURIComponent(text)}`;
};

/**
 * Enhanced WhatsApp Inquiry:
 * On Mobile Phones (Android/iOS): Uses native Web Share API with the real image File attached.
 * On Desktop / Fallback: Opens WhatsApp with pre-filled message, direct photo link, and rich preview card.
 */
export const shareProductToWhatsAppWithImage = async (data: {
  productTitle: string;
  price: number | string;
  sku: string;
  size?: string;
  color?: string;
  imageUrl?: string;
  slug?: string;
  productId?: string;
  brand?: string;
}) => {
  const domain = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://www.chandhanashoemart.com';
  const productUrl = data.slug ? `${domain}/product/${data.slug}` : window.location.href;
  let fullImg = '';
  if (data.imageUrl) {
    fullImg = data.imageUrl.startsWith('http') ? data.imageUrl : `${domain}${data.imageUrl.startsWith('/') ? '' : '/'}${data.imageUrl}`;
  }

  logWhatsAppEnquiry({
    customerName: 'Store Customer',
    productId: data.productId,
    productTitle: data.productTitle,
    sku: data.sku,
    brand: data.brand,
    price: typeof data.price === 'number' ? data.price : parseFloat(String(data.price)) || 0,
    imageUrl: fullImg,
    size: data.size,
    color: data.color,
    message: `Inquiry for ${data.productTitle} (SKU: ${data.sku})`,
    source: 'PRODUCT_DETAIL',
  });

  const formattedPrice = typeof data.price === 'number' ? `₹${data.price}` : data.price;
  const sizeText = data.size ? ` | Size: ${data.size}` : '';
  const shareText = `Hello Chandhana Shoe Mart! 👋\nI want to inquire about:\n👞 *${data.productTitle}* (SKU: ${data.sku})\n💰 *Price:* ${formattedPrice}${sizeText}\n🔗 ${productUrl}`;

  // 1. Check if native Web Share with attached Image File is supported (Mobile phones: Chrome, Safari, Edge)
  if (navigator.share && fullImg) {
    try {
      const res = await fetch(fullImg);
      if (res.ok) {
        const blob = await res.blob();
        const ext = blob.type.includes('png') ? 'png' : 'jpg';
        const file = new File([blob], `${data.sku || 'footwear'}.${ext}`, {
          type: blob.type || 'image/jpeg',
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: data.productTitle,
            text: shareText,
          });
          return;
        }
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.warn('Native share with photo skipped, falling back:', err);
      } else {
        return; // user cancelled sheet
      }
    }
  }

  // 2. Fallback to direct wa.me link with clickable photo link & rich preview link
  const fallbackUrl = getWhatsAppProductUrl(
    data.productTitle,
    data.price,
    data.size,
    data.color,
    data.slug,
    fullImg,
    data.sku
  );
  window.open(fallbackUrl, '_blank');
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
