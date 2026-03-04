# Zlice Fit: Gym Menu Prototype

This Next.js prototype demonstrates the new UI and psychological pricing architecture for the Zlice Fit gym menu tab.

## Running the Prototype
1. Ensure Node.js is installed.
2. In this directory (`zlice-gym-menu`), run:
   ```bash
   npm install
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser. (We recommend switching to an **iPhone/Mobile View** in Chrome DevTools to see the exact student experience).

## Key UI Components (See `src/app/page.tsx`)
1. **The Coupon Carousel**: Horizontally scrollable `div` containing `FITFREE`, `BEAST50`, and `HULK75`. This is exact Swiggy/Zomato behavior.
2. **Pricing Illusion Cards**: Notice how the `mrp` vs `price` variables are piped into the component. The user sees `₹79` but the card reinforces "40% OFF TODAY".
3. **Bottom Navigation**: Includes the active yellow `Zap` icon for "Fit Menu" and matches the original standard gray navigation.
4. **Sticky Cart Summary**: Mimics the FOMO of adding to cart when a coupon is in play.

## Integration Notes for Devs
- Transfer the JSX from `src/app/page.tsx` into your React Native / actual app framework.
- The Tailwind utility classes should map almost 1:1 if you are using `NativeWind` or standard Tailwind spacing.
- The color codes (`#0A0A0A` background, `#1A1A1A` cards, `#FFC107` primary) match your dark theme perfectly.
