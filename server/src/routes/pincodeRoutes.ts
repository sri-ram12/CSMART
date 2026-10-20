import { Router, Request, Response } from 'express';

const router = Router();

// PIN-code delivery check
router.get('/:pincode', (req: Request, res: Response) => {
  const pincode = req.params.pincode.trim();

  // Validate 6 digits format
  if (!/^\d{6}$/.test(pincode)) {
    res.status(400).json({
      success: false,
      message: 'Please enter a valid 6-digit Indian PIN code.',
    });
    return;
  }

  const prefix = pincode.substring(0, 2);
  let city = 'Metro/Tier 1';
  let transitDays = 3;
  let isCOD = true;
  let courier = 'Delhivery Express';

  if (prefix === '56' || prefix === '57') {
    city = 'Karnataka / Bengaluru Region';
    transitDays = 1;
    courier = 'CSM Same-Day / Blue Dart';
  } else if (prefix === '40' || prefix === '41') {
    city = 'Maharashtra / Mumbai Region';
    transitDays = 2;
    courier = 'Delhivery Express';
  } else if (prefix === '11' || prefix === '12') {
    city = 'Delhi NCR';
    transitDays = 2;
    courier = 'Blue Dart Express';
  } else if (prefix === '60' || prefix === '61') {
    city = 'Tamil Nadu / Chennai Region';
    transitDays = 2;
    courier = 'Shadowfax';
  } else if (prefix === '50' || prefix === '51') {
    city = 'Telangana / Hyderabad Region';
    transitDays = 2;
    courier = 'Ecom Express';
  } else {
    transitDays = 4;
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + transitDays);
  const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  res.json({
    success: true,
    data: {
      pincode,
      serviceable: true,
      city,
      transitDays,
      estimatedDelivery: formattedDate,
      codAvailable: isCOD,
      courier,
      freeDeliveryThreshold: 999,
      message: `Delivery available by ${formattedDate}. Cash on Delivery supported.`,
    },
  });
});

export default router;
