# PROJECT ZLICE: THE CAMPUS OPERATING SYSTEM
## THE MASTER BIBLE (v1.0)
**Confidential: For Core Development & Strategy Team Only**

---

# TABLE OF CONTENTS

A. ** EXECUTIVE VISION: The Campus OS**
B. ** CHAPTER 1: The Master Design (Psychology & Game Theory)**
C. ** CHAPTER 2: The Aura Economy (Monetary Policy)**
D. ** CHAPTER 3: The User Experience (Onboarding & Retention)**
E. ** CHAPTER 4: Technical Architecture (DB Schema & API)**
F. ** CHAPTER 5: Growth & Marketing Strategy**
G. ** CHAPTER 6: Operational Playbook (Daily Management)**
H. ** APPENDIX: Full SQL Reference**

---

# A. EXECUTIVE VISION: THE CAMPUS OS

## 1. The Core Thesis
**Zlice is NOT a food delivery app.**
If you treat it like one, you have failed.
**Zlice is the Operating System for Residential Campuses.**

We are building a closed-loop digital economy for isolated communities (starting with IIT Kharagpur).

### The Problem: System Failure
- **Food:** Delivery dies at 11 PM. 60% of students skip meals due to queues.
- **Transport:** ₹40/ride solo is unaffordable.
- **Market Failure:** Swiggy/Zomato lose money here because of low density (1 order/trip = Loss).

### The Solution: Batch Economics
- **Swiggy Model:** 1 order, 1 delivery = ₹12 fee, ₹12 cost = **₹0 Margin**.
- **Zlice Model:** 15 orders, 1 batch (at 11:30 PM) = ₹180 fees, ₹60 cost = **₹120 Margin**.
- **Why it works:** We trade *speed* (on-demand) for *efficiency* (batched slots). Students accept this because the alternative is starvation.

---

# B. CHAPTER 1: THE MASTER DESIGN

## 1. The Adversarial User Profile
We are designing for **IIT Students (Top 0.1% IQ)**.
They are:
- **Optimization machines:** They WILL reverse-engineer the point system.
- **Broke but smart:** They will exploit every loophole to save ₹10.
- **Tech-literate:** Comfortable with emulators, scripting, and multi-accounting.

**Design Philosophy:** "Secure by Design"
- Simple to use, complex to exploit.
- The only way to "win" is to be a loyal customer.

## 2. Behavioral Economics Framework
We don't sell food; we sell **Dopamine**.

### 2.1 The Endowed Progress Effect
**Rule:** Never show a user "0 Points".
**Implementation:**
- Sign-up bonus gives them 50% of the first reward instantly.
- Messaging: "You are 50% of the way to Free Chai!" (Conversion jumps 2x).

### 2.2 Variable Ratio Reinforcement (The "Slot Machine")
**Mechanism:** "Aura Spin" after *every* order.
**Why:** Predictable rewards are boring. Unpredictable rewards (5 Aura? 100 Aura?) create habit loops.
**Probability Matrix:**
- **Common (60%):** 5-10 Aura
- **Uncommon (25%):** 15-25 Aura
- **Rare (12%):** 50 Aura
- **Legendary (3%):** 200 Aura (+ Badge)

### 2.3 Loss Aversion (The Streak)
**Mechanism:** The Streak Freeze.
- Students will pay distinct currency (Aura) to save a 50-day streak. It is an ego asset.
- **Inflation Control:** As Aura supply increases, the price of Streak Freezes rises. It is our "Interest Rate".

---

# C. CHAPTER 2: THE AURA ECONOMY (Monetary Policy)

## 1. The Central Bank Model
We act as the Central Bank of the Campus.

| Central Bank Function | Aura Equivalent |
|-----------------------|-----------------|
| Print currency | Mint Aura (on orders) |
| Control money supply | Velocity limits, breakage |
| Manage inflation | Dynamic pricing, point sinks |
| Reserve assets | Coupon inventory |

## 2. Partner-Funded Economy
**Distinction:**
- **Partner-Funded Coupons:** Cost us ₹0. Revenue ₹10/redemption. **(PROFIT CENTER)**
- **Self-Funded Coupons:** Cost us ₹X. Revenue ₹0. **(COST CENTER)**

**Strategy:** Maximize velocity of Partner-Funded coupons. Lower their Aura price to drive volume.

## 3. Monetary Policy Levers

### 3.1 Dynamic Pricing Formula
```
FINAL_PRICE = BASE_PRICE × Inflation_Mult × Velocity_Mult × Scarcity_Mult
```
- **Inflation High (>10%):** Lower prices by 30% to encourage burning Aura.
- **Inventory Low (<20%):** Raise prices by 50% to protect stock.
- **Velocity Low:** Lower prices to stimulate demand.

### 3.2 Anti-Hoarding Mechanisms
**The Problem:** Whales accumulating 10,000+ Aura wait to drain high-value inventory.
**Controls:**
1.  **Balance Tax:** If balance > 2000, earning rate drops by 50%.
2.  **Inactivity Decay:** No order in 7 days? Lose 5% of balance.
3.  **Redemption Priority:** Whales see different "Premium" coupon sets.

---

# D. CHAPTER 3: THE USER EXPERIENCE (Onboarding v10)

## 1. The "Zero Dropoff" Philosophy
**Old Flow (v1):** Register -> Name -> Phone -> Password -> Browse. (Dropoff: 45%)
**New Flow (v10):** Browse -> Add to Cart -> Checkout -> Google Login. (Dropoff: <15%)

## 2. The Golden Path
1.  **Splash:** "Finally. Someone with taste." -> [See What's Open]
2.  **Home (Guest):** Full access to menus. No login.
3.  **Cart:** Shows "+50 Aura Bonus" waiting.
4.  **Checkout:** "Commit now to claim bonus".
5.  **Login:** Google One-Tap (No password, no OTP).
6.  **Success:** "You're in. +50 Aura added."

## 3. KGP Verification (The "Blue Tick")
**Trigger:** After first order.
**Offer:** "Want 2x Aura on every order? Verify your student email."
**Flow:** Enter `@iitkgp.ac.in` -> Magic Link -> **Verified Status**.
**Economics:** Verified users earn 1.0x rate. Unverified earn 0.5x.

---

# E. CHAPTER 4: TECHNICAL ARCHITECTURE

## 1. Priority Modules (Sprint 1)
| Priority | Module | Effort |
|----------|--------|--------|
| **P0** | Auth (Google Sign-in) | 2 days |
| **P0** | User Profile + Phone | 1 day |
| **P1** | Aura Core (Earning) | 3 days |
| **P1** | KGP Verification | 2 days |
| **P1** | Aura Spin | 1 day |

## 2. Database Schema (Core Tables)

### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15),
  is_kgp_verified BOOLEAN DEFAULT FALSE,
  aura_balance INT DEFAULT 0,
  tier ENUM('rookie', 'foodie', 'og') DEFAULT 'rookie',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Aura Transactions (The Ledger)
```sql
CREATE TABLE aura_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount INT NOT NULL,  -- positive = mint, negative = burn
  type ENUM('order', 'signup', 'spin', 'redemption', 'expiry'),
  order_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Coupons (Inventory)
```sql
CREATE TABLE coupons (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  cost_type ENUM('partner', 'self_funded'),
  aura_price INT,
  stock_remaining INT,
  partner_id UUID
);
```

## 3. Anti-Gaming Logic (Python)
```python
def can_earn_aura(user):
    # VELOCITY LIMITS
    if today_orders >= 3: return False
    if today_points >= 500: return False
    if minutes_since_last_order < 15: return False # Prevent split orders
    return True
```

---

# F. CHAPTER 5: GROWTH & MARKETING STRATEGY

## 1. The "Cool Senior" Brand DNA
**Tone:** Savage, Witty, Insider.
- **We are:** The guy who knows how to sneak onto the roof.
- **We are NOT:** A "Customer Support Agent".

**Sonic Branding:**
- **Texture:** Metallic, Sharp.
- **Sound:** "Schwing" (Katana slice) + Digital Glitch.
- **Effect:** Pavlovian trigger. Sound = Food.

## 2. Viral Automation (Zero Cost)
**Strategy:** "The Internet is the Product."
**Tools:** Make.com + Gemini + Pollinations.ai.
**Content Engine:**
1.  **The Oracle:** "Food Horoscope". ("Mercury in retrograde. You need Biryani.")
2.  **The Diary:** Anonymous student food journals.
3.  **The Data:** "Yesterday, Patel Hall ordered 400 Maggis. Are you okay?"

## 3. Adoption Funnel (Financial Model)
**Spring Fest Launch Targets:**
- **Awareness:** 80% (17,600 students) via SF sponsorship.
- **Install:** 15% (2,600 installs).
- **Activation:** 65% (1,700 first orders).
- **M6 Retention:** 1,000+ Daily Active Users.

---

# G. CHAPTER 6: OPERATIONAL PLAYBOOK

## 1. Daily Checks (The "Pulse")
- [ ] **Revenue:** Is GMV on target?
- [ ] **Velocity:** Is Aura Burn Rate > 0.8? (Are people spending?)
- [ ] **Inflation:** Is Inflation < 5%/week?
- [ ] **Inventory:** Any partner stock < 20%?

## 2. Emergency Triggers
- **Inflation > 10%:** RED ALERT. Reduce Spin Wheel payouts by 30% immediately.
- **Fraud Wave:** Pause redemptions for users with > 10 referrals/day.
- **Server Load:** If >1000 concurrent, enable "Queue Mode" (Waitlist for app access).

## 3. Spring Fest Special Mode ("SF_MODE")
- **Active:** Days 1-4 of Spring Fest.
- **Rules:**
    - Spin Payouts: +50% (75 Aura avg).
    - Partner Coupons: -50% Price (Fire sale).
    - Goal: Massive user acquisition, worry about inflation later.

---

# H. APPENDIX: PROMPTS & ASSETS

## 1. Jingle Prompts (Suno AI)
*"A sharp, punchy sound logo. 2 seconds maximum. Metallic 'Schwing' sound followed by a deep bass drop. Digital glitch texture. ending with a crisp silence. No melody, just texture."*

## 2. Visual Prompt (Midjourney/Pollinations)
*"A hyper-realistic close-up of a greasy cheese burger, neon lighting, dark mode aesthetic, glistening oil, steam rising, cyberpunk food photography, 4k, sharp focus."*

---

**END OF MASTER BIBLE**
*Version 1.0 | Feb 2026 | Prepared for Migration*
