'use client'

import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, Ticket, ChefHat, User, ShoppingBag, Tag, Zap, ChevronRight, X, Plus, Minus, Check, ArrowLeft, Info } from 'lucide-react';

// --- DATA DEFINITIONS ---

const MENU_ITEMS = [
  { id: 'm1', name: 'Paneer Bhurji (100g)', protein: '18-20g Protein', tag: 'KETO FRIENDLY', price: 109, mrp: 149, isVeg: true, desc: 'Low oil, high protein paneer crumble.' },
  { id: 'm2', name: 'Soya Power Bowl', protein: '20-22g Protein', tag: 'LEAN CUT', price: 69, mrp: 99, isVeg: true, desc: 'Nutritious soya chunks with veggies.' },
  { id: 'm3', name: 'PB Banana Sandwich', protein: '10-12g Protein', tag: 'PRE-WORKOUT', price: 69, mrp: 99, isVeg: true, desc: 'High energy peanut butter power.' },
  { id: 'm4', name: 'Chana Sprouts Chaat', protein: '12-14g Protein', tag: 'LIGHT SNACK', price: 69, mrp: 99, isVeg: true, desc: 'Tangy, crunchy, healthy sprouts.' },
  { id: 'm5', name: 'Sattu Protein Drink', protein: '7-9g Protein', tag: 'NATURAL WHEY', price: 39, mrp: 59, isVeg: true, desc: 'Traditional high-protein refresher.' },
  { id: 'm6', name: 'Egg Bhurji (Low Oil)', protein: '12-14g Protein', tag: 'KETO CUT', price: 49, mrp: 79, isVeg: false, desc: 'Spiced scrambled eggs, low oil.' },
  { id: 'm7', name: 'Egg Sandwich', protein: '13-15g Protein', tag: 'BULKING', price: 59, mrp: 89, isVeg: false, desc: 'Protein packed boiled egg sandwich.' },
  { id: 'm8', name: 'Double Egg Omelette', protein: '12-14g Protein', tag: 'CLASSIC GAINS', price: 49, mrp: 79, isVeg: false, desc: 'Fluffy, low oil 2-egg classic.' },
  { id: 'm9', name: 'Boiled Eggs (2 pcs)', protein: '12g Protein', tag: 'PURE PROTEIN', price: 29, mrp: 49, isVeg: false, desc: '🔥 Loss Leader — cheapest in KGP!' },
];

const ADDONS = [
  { id: 'a1', name: 'Add 1 Boiled Egg', price: 15, isVeg: false },
  { id: 'a2', name: 'Add Paneer (50g)', price: 29, isVeg: true },
  { id: 'a3', name: 'Add Soya Chunks', price: 19, isVeg: true },
];

const COUPONS = [
  { code: 'LITE20', title: '💸 Flat ₹20 OFF', desc: 'On orders above ₹129', threshold: 129, discountAmt: 20 },
  { code: 'FLAT30', title: '💥 Flat ₹30 OFF', desc: 'On orders above ₹199', threshold: 199, discountAmt: 30 },
  { code: 'BEAST50', title: '🏋️ Flat ₹50 OFF', desc: 'On orders above ₹349', threshold: 349, discountAmt: 50 },
];

// --- TYPES ---
type CartItem = {
  cartId: string;
  itemId: string;
  name: string;
  basePrice: number;
  qty: number;
  addons: { id: string; name: string; price: number }[];
  isVeg: boolean;
};

export default function GymMenuApp() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);

  // Modals
  const [showAddonSheet, setShowAddonSheet] = useState<string | null>(null); // itemId
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);

  // --- CART MATH ENGINE ---
  const { itemTotal, addonTotal, subtotal, discount, deliveryFee, finalTotal, isHappyHour } = useMemo(() => {
    let iTotal = 0;
    let aTotal = 0;

    cart.forEach(item => {
      iTotal += item.basePrice * item.qty;
      item.addons.forEach(a => {
        aTotal += a.price * item.qty;
      });
    });

    let sub = iTotal + aTotal;

    // Evaluate Coupon
    let disc = 0;
    if (activeCoupon) {
      const coupon = COUPONS.find(c => c.code === activeCoupon);
      if (coupon && sub >= coupon.threshold) {
        disc = coupon.discountAmt;
      } else {
        // If they dropped below the threshold, but had the coupon active, we probably shouldn't apply it.
        // But for UI reactiveness, we calculate based on current state.
      }
    }

    // Happy Hour logic (10 PM to 12 AM) — NON-STACKABLE with coupons
    const happyHourActive = true; // mocked as always active for demo
    if (happyHourActive && sub > 0 && !activeCoupon) {
      disc += 10;
    }

    // Delivery Logic
    const cartPostDiscount = sub - disc;
    const delFee = (cartPostDiscount >= 199 || sub === 0) ? 0 : 15;

    const final = Math.max(0, cartPostDiscount) + delFee;

    return { itemTotal: iTotal, addonTotal: aTotal, subtotal: sub, discount: disc, deliveryFee: delFee, finalTotal: final, isHappyHour: happyHourActive };
  }, [cart, activeCoupon]);

  // Strip invalid coupons if subtotal drops
  useEffect(() => {
    if (activeCoupon) {
      const coupon = COUPONS.find(c => c.code === activeCoupon);
      if (coupon && subtotal < coupon.threshold) {
        setActiveCoupon(null); // Invalidated
      }
    }
  }, [subtotal, activeCoupon]);

  // --- ACTIONS ---
  const openAddonSheet = (itemId: string) => {
    setShowAddonSheet(itemId);
    setSelectedAddons([]);
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]);
  };

  const confirmAddToCart = () => {
    if (!showAddonSheet) return;
    const item = MENU_ITEMS.find(m => m.id === showAddonSheet)!;
    const addonsToApply = ADDONS.filter(a => selectedAddons.includes(a.id));

    // Check if exact same config exists
    const existingIndex = cart.findIndex(c =>
      c.itemId === item.id &&
      JSON.stringify(c.addons.map(a => a.id).sort()) === JSON.stringify(addonsToApply.map(a => a.id).sort())
    );

    if (existingIndex >= 0) {
      // guardrail: max 3 qty
      if (cart[existingIndex].qty < 3) {
        const newCart = [...cart];
        newCart[existingIndex].qty += 1;
        setCart(newCart);
      } else {
        alert("Maximum 3 quantity allowed per item to prevent gaming.");
      }
    } else {
      setCart([...cart, {
        cartId: Math.random().toString(),
        itemId: item.id,
        name: item.name,
        basePrice: item.price,
        qty: 1,
        addons: addonsToApply,
        isVeg: item.isVeg
      }]);
    }
    setShowAddonSheet(null);
  };

  const updateQty = (cartId: string, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.cartId === cartId) {
        const newQty = c.qty + delta;
        if (newQty > 3) { alert("Max 3 qty allowed."); return c; }
        return { ...c, qty: newQty };
      }
      return c;
    }).filter(c => c.qty > 0));
  };


  // ==========================================
  // RENDER CART VIEW
  // ==========================================
  if (showCart) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen text-white font-sans flex flex-col selection:bg-[#7C4DFF]/30 pb-20">
        <header className="sticky top-0 z-50 bg-[#0A0A0A] border-b border-gray-900 flex items-center p-4">
          <button onClick={() => setShowCart(false)} className="mr-3 p-1 rounded-full bg-gray-900 border border-gray-800">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight">Checkout</h1>
            <p className="text-xs text-gray-500 font-medium">Ashim's Canteen (Nehru)</p>
          </div>
        </header>

        <main className="flex-1 p-4 overflow-y-auto">
          {/* CART ITEMS */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-gray-800 p-4 mb-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Your Order</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-sm">Cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map(c => (
                  <div key={c.cartId} className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <div className={`w-3 h-3 border ${c.isVeg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center p-[1px]`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${c.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                        <h3 className="font-bold text-[15px]">{c.name}</h3>
                      </div>
                      <p className="text-gray-400 text-xs pl-4 font-medium mb-1">₹{c.basePrice}</p>

                      {c.addons.length > 0 && (
                        <div className="pl-4 mt-1">
                          {c.addons.map(a => (
                            <p key={a.id} className="text-gray-500 text-[10px] font-medium">+ {a.name} (₹{a.price})</p>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <p className="font-extrabold">₹{(c.basePrice + c.addons.reduce((sum, a) => sum + a.price, 0)) * c.qty}</p>
                      <div className="flex items-center bg-[#2A2A2A] border border-gray-700 rounded-lg overflow-hidden h-7">
                        <button onClick={() => updateQty(c.cartId, -1)} className="w-7 flex items-center justify-center text-[#FFC107] hover:bg-gray-800"><Minus size={14} /></button>
                        <span className="w-6 text-center text-xs font-bold">{c.qty}</span>
                        <button onClick={() => updateQty(c.cartId, 1)} className="w-7 flex items-center justify-center text-[#FFC107] hover:bg-gray-800"><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ADD MORE ITEMS NUDGE */}
            {cart.length > 0 && (
              <button onClick={() => setShowCart(false)} className="mt-4 w-full py-2.5 border border-dashed border-[#7C4DFF]/50 rounded-xl text-[#7C4DFF] text-xs font-extrabold tracking-wide text-center bg-[#7C4DFF]/5">
                + ADD MORE ITEMS
              </button>
            )}
          </div>

          {/* OFFERS SECTION (Swiggy Style Carousel in Checkout) */}
          {cart.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-bold text-white mb-3">Available Coupons</h2>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {COUPONS.map(coupon => {
                  const isEligible = subtotal >= coupon.threshold;
                  const isActive = activeCoupon === coupon.code;
                  return (
                    <div
                      key={coupon.code}
                      onClick={() => isEligible ? setActiveCoupon(isActive ? null : coupon.code) : null}
                      className={`flex-shrink-0 w-[240px] rounded-xl p-3 border transition-all cursor-pointer ${isActive
                        ? 'bg-[#7C4DFF]/10 border-[#7C4DFF] shadow-[0_0_15px_rgba(124,77,255,0.2)]'
                        : isEligible
                          ? 'bg-[#1A1A1A] border-gray-700'
                          : 'bg-gray-900 border-gray-800 opacity-60'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 ${isActive ? 'text-[#7C4DFF]' : 'text-gray-400'}`}>
                          <Ticket size={12} /> {coupon.code}
                        </p>
                        {isActive && <Check size={16} className="text-[#7C4DFF]" />}
                      </div>
                      <h3 className={`font-extrabold text-[14px] leading-tight mb-1 ${!isEligible ? 'text-gray-500' : 'text-white'}`}>{coupon.title}</h3>
                      <p className="text-gray-500 text-[10px] font-medium">{coupon.desc}</p>

                      {!isEligible && (
                        <p className="text-red-400 text-[9px] font-bold mt-2">
                          Add ₹{coupon.threshold - subtotal} more to unlock
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* BILL DETAILS */}
          {cart.length > 0 && (
            <div className="bg-[#1A1A1A] rounded-2xl border border-gray-800 p-4 mb-4">
              <h2 className="text-sm font-bold text-white mb-3">Bill Details</h2>

              <div className="space-y-2 text-xs font-medium text-gray-400">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="text-white">₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span className="flex items-center gap-1">Item Discount {isHappyHour && activeCoupon ? '(Coupon + Happy Hour)' : ''}</span>
                    <span>- ₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    Delivery Fee
                    <Info size={12} />
                  </span>
                  {deliveryFee === 0 ? (
                    <span className="text-[#FFC107] font-bold">FREE</span>
                  ) : (
                    <span className="text-white">₹{deliveryFee}</span>
                  )}
                </div>

                {deliveryFee > 0 && (
                  <p className="text-[10px] text-gray-500 bg-gray-900 p-2 rounded-lg mt-1 border border-gray-800">
                    Add ₹{199 - (subtotal - discount)} more to get FREE Delivery!
                  </p>
                )}
              </div>

              <div className="border-t border-gray-800 mt-3 pt-3 flex justify-between items-center">
                <span className="font-extrabold text-sm uppercase tracking-wider text-gray-300">To Pay</span>
                <span className="font-extrabold text-lg text-white">₹{finalTotal}</span>
              </div>

              {discount > 0 && (
                <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-2 mt-3 flex items-center justify-center gap-2">
                  <Zap size={14} className="text-green-400 fill-green-400" />
                  <p className="text-green-400 text-[11px] font-extrabold tracking-wide">
                    YOU SAVED ₹{discount} ON THIS ORDER!
                  </p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* CHECKOUT BUTTON */}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-gray-900">
            <button className="w-full bg-[#FFC107] text-black font-extrabold py-4 rounded-xl shadow-[0_5px_20px_rgba(255,193,7,0.3)] active:scale-95 transition-all text-sm uppercase tracking-wider">
              Place Order • ₹{finalTotal}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // RENDER MAIN MENU VIEW
  // ==========================================
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white pb-24 font-sans selection:bg-[#7C4DFF]/30 relative">
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md px-4 pt-10 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-800 bg-gray-900 flex-shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-700 to-amber-900 opacity-60"></div>
              <ChefHat className="absolute inset-0 m-auto text-amber-500/50" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold flex items-center gap-1 tracking-tight">
                ASHIM'S CANTEEN <ChevronDown size={18} className="text-gray-400" />
              </h1>
              <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5 font-medium">
                <span className="text-yellow-500">⚡ 20-25 min</span> • NEHRU HALL
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search for pure protein..."
            className="w-full bg-[#1A1A1A] text-white border border-gray-800 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-[#7C4DFF]/50 transition-colors placeholder:text-gray-600"
          />
        </div>
      </header>

      {/* TABS */}
      <div className="flex gap-6 px-4 mb-2 overflow-x-auto no-scrollbar border-b border-gray-900 mt-2">
        <button className="text-gray-500 font-bold text-sm pb-3 whitespace-nowrap">All Items</button>
        <button className="text-[#FFC107] font-bold text-sm pb-3 border-b-2 border-[#FFC107] whitespace-nowrap">Zlice Fit 🏋️</button>
        <button className="text-gray-500 font-bold text-sm pb-3 whitespace-nowrap">Bestsellers</button>
      </div>

      <main className="px-4 pt-4">
        {/* OFFERS BANNER */}
        <div className="mb-6 bg-gradient-to-r from-[#7C4DFF]/20 to-[#FFC107]/10 border border-[#7C4DFF]/30 rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-8xl opacity-10">🤑</div>
          <h2 className="font-extrabold text-[16px] text-white mb-1">Gym Deals are LIVE</h2>
          <p className="text-gray-300 text-xs font-medium max-w-[80%]">Up to ₹75 OFF or Get Free Eggs. <br />Plus Happy Hours active!</p>
        </div>

        <section className="mb-6">
          <h2 className="text-lg font-extrabold mb-4 tracking-tight flex items-center gap-2">
            🥗 Veg Protein <span className="text-gray-500 text-sm font-medium">({'>'}15g)</span>
          </h2>
          <div className="space-y-4">
            {MENU_ITEMS.filter(m => m.isVeg).map(item => (
              <MenuItemCard key={item.id} item={item} onAdd={() => openAddonSheet(item.id)} cartQty={cart.filter(c => c.itemId === item.id).reduce((s, c) => s + c.qty, 0)} />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-extrabold mb-4 tracking-tight flex items-center gap-2">
            🥚 Egg Protein <span className="text-gray-500 text-sm font-medium">({'>'}12g)</span>
          </h2>
          <div className="space-y-4">
            {MENU_ITEMS.filter(m => !m.isVeg).map(item => (
              <MenuItemCard key={item.id} item={item} onAdd={() => openAddonSheet(item.id)} cartQty={cart.filter(c => c.itemId === item.id).reduce((s, c) => s + c.qty, 0)} />
            ))}
          </div>
        </section>
      </main>

      {/* ADD-ON BOTTOM SHEET (ZOMATO/SWIGGY STYLE) */}
      {showAddonSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowAddonSheet(null)}></div>
          <div className="bg-[#1A1A1A] w-full rounded-t-3xl border-t border-gray-800 pb-safe relative z-10 max-h-[85vh] flex flex-col animation-slide-up">

            <div className="flex justify-between items-center p-5 border-b border-gray-800">
              <div>
                <h3 className="font-extrabold text-lg text-white">Customize</h3>
                <p className="text-xs font-medium text-gray-400">{MENU_ITEMS.find(m => m.id === showAddonSheet)?.name}</p>
              </div>
              <button onClick={() => setShowAddonSheet(null)} className="p-2 bg-gray-900 rounded-full text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              <h4 className="font-bold text-sm text-gray-300 mb-3 uppercase tracking-wider">Boost Your Meal</h4>
              <div className="space-y-3">
                {ADDONS.map(addon => (
                  <div key={addon.id} className="flex justify-between items-center p-3 rounded-xl border border-gray-800 bg-[#2A2A2A]/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 border ${addon.isVeg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center p-[1px]`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${addon.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                      <span className="font-medium text-sm text-gray-200">{addon.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm">₹{addon.price}</span>
                      <button
                        onClick={() => toggleAddon(addon.id)}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${selectedAddons.includes(addon.id) ? 'bg-[#FFC107] border-[#FFC107] text-black' : 'border-gray-500 text-gray-400'}`}
                      >
                        {selectedAddons.includes(addon.id) ? <Check size={14} strokeWidth={3} /> : <Plus size={14} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-800 bg-[#0A0A0A]">
              <button
                onClick={confirmAddToCart}
                className="w-full bg-[#FFC107] text-black font-extrabold py-3.5 rounded-xl text-sm tracking-wider uppercase shadow-[0_5px_20px_rgba(255,193,7,0.2)]"
              >
                Add to Cart • ₹{(MENU_ITEMS.find(m => m.id === showAddonSheet)?.price || 0) + ADDONS.filter(a => selectedAddons.includes(a.id)).reduce((s, a) => s + a.price, 0)}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FLOATING CART SUMMARY */}
      {cart.length > 0 && !showAddonSheet && (
        <div className="fixed bottom-24 left-4 right-4 z-40">
          <div onClick={() => setShowCart(true)} className="bg-[#FFC107] text-black rounded-2xl flex items-center justify-between p-2 shadow-[0_10px_25px_-5px_rgba(255,193,7,0.4)] cursor-pointer active:scale-95 transition-transform">
            <div className="flex gap-3 items-center ml-1">
              <div className="bg-black/10 rounded-xl w-10 h-10 flex items-center justify-center font-extrabold text-lg">
                {cart.reduce((s, c) => s + c.qty, 0)}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-[2px]">
                  {cart.reduce((s, c) => s + c.qty, 0)} items
                </p>
                <p className="font-extrabold leading-none text-[15px]">₹{subtotal}</p>
              </div>
            </div>
            <button className="h-full px-4 font-extrabold text-[15px] flex items-center gap-1">
              View Cart <ChevronRight size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 w-full bg-[#0A0A0A]/95 backdrop-blur-md border-t border-gray-900 pb-safe pt-2 px-1 z-30">
        <div className="flex justify-between items-center text-gray-500 pb-2">
          <div className="flex flex-col items-center gap-1 w-[20%]">
            <ShoppingBag size={22} strokeWidth={2} />
            <span className="text-[10px] font-medium">Order</span>
          </div>
          <div className="flex flex-col items-center gap-1 w-[20%]">
            <Tag size={22} strokeWidth={2} />
            <span className="text-[10px] font-medium">Under ₹149</span>
          </div>
          <div className="flex flex-col items-center gap-1 w-[20%] relative -top-2">
            <div className="bg-[#FFC107]/10 p-2.5 rounded-full border border-[#FFC107]/20 shadow-[0_0_15px_rgba(255,193,7,0.15)]">
              <Zap size={24} className="text-[#FFC107]" fill="currentColor" />
            </div>
            <span className="text-[#FFC107] text-[10px] font-extrabold tracking-wide mt-[-2px]">Fit Menu</span>
          </div>
          <div className="flex flex-col items-center gap-1 w-[20%]">
            <span className="bg-gray-800 rounded-md p-1">
              <Ticket size={16} strokeWidth={2} className="text-white" />
            </span>
            <span className="text-[10px] font-medium text-white">My Orders</span>
          </div>
          <div className="flex flex-col items-center gap-1 w-[20%]">
            <User size={22} strokeWidth={2} />
            <span className="text-[10px] font-medium">Profile</span>
          </div>
        </div>
      </nav>

    </div>
  );
}

// ----------------------------------------------------
// COMPONENTS
// ----------------------------------------------------

function MenuItemCard({ item, onAdd, cartQty }: { item: any, onAdd: () => void, cartQty: number }) {
  const discount = Math.round(((item.mrp - item.price) / item.mrp) * 100);

  return (
    <div className="flex bg-[#1A1A1A] rounded-2xl p-3 shadow-lg border border-gray-800/60 relative overflow-hidden">

      {/* Image */}
      <div className="relative w-28 h-28 flex-shrink-0 bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 to-gray-700 opacity-30 grayscale mix-blend-multiply"></div>
        <ChefHat className="absolute inset-0 m-auto text-gray-700" size={32} />
        <div className="absolute top-1 left-1 bg-black/80 backdrop-blur-sm text-gray-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
          NO PKG FEE
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 ml-3 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 mb-1">
          <div className={`w-3 h-3 border ${item.isVeg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center p-[1px]`}>
            <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          <h3 className="font-extrabold text-[15px] leading-tight text-white">{item.name}</h3>
        </div>

        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <span className="bg-green-900/30 text-green-400 border border-green-800/50 text-[9px] font-bold px-1.5 py-[2px] rounded uppercase tracking-wider">
            {item.tag}
          </span>
          <span className="text-gray-400 text-[10px] font-medium tracking-tight">
            {item.protein}
          </span>
        </div>

        <div className="flex items-end mb-1">
          <span className="text-white font-extrabold text-[17px] mr-1.5 leading-none">₹{item.price}</span>
        </div>

        <p className="text-gray-400 text-[10px] font-medium tracking-wide">
          {item.desc}
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-col justify-end items-end ml-1 pb-1">
        <div className="relative">
          <button
            onClick={onAdd}
            className="bg-[#2A2A2A] text-[#FFC107] font-extrabold text-xs px-5 py-2 rounded-xl border border-gray-700 active:scale-95 transition-transform shadow-md"
          >
            ADD
          </button>
          <div className="absolute -top-1 -right-1 bg-gray-900 rounded-full w-4 h-4 flex items-center justify-center border border-gray-800">
            <Plus size={10} className="text-[#FFC107]" strokeWidth={3} />
          </div>
        </div>
        <p className="text-gray-500 text-[9px] mt-1.5 font-medium pr-1 text-center">Customise {'>'}</p>
      </div>

    </div>
  )
}
