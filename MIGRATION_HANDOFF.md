# PROJECT MIGRATION HANDOFF: ZLICE & AURA
**Status:** Active Development | **Date:** February 2026
**Target Audience:** Next Intelligent Agent (LLM)

---

## 1. THE VISION
**Zlice** is not just a food delivery app; it is a "Campus Operating System" for IIT Kharagpur (and beyond).
**Aura** is the internal currency that gamifies the economy.

**Core Philosophy:**
- **Psychology First:** Every interaction (sound, visual, click) is designed to trigger dopamine or hunger ("Visual Hunger").
- **Premium Aesthetics:** Glassmorphism, dark mode, high-fidelity imagery ("Nano Banana" prompts). No "MVP" vibes.
- **Witty/Savage Tone:** We speak Gen-Z. We are an insider, not a corporation.

---

## 2. BRAND TONE & LANGUAGE (CRITICAL)
**Voice:** The "Cool Senior" who knows all the campus secrets.
- **Keywords:** Savage, Witty, Exclusive, Premium, Mysterious.
- **Do Not Use:** Corporate jargon ("Synergy", "User-centric"), generic pleasantries.
- **Do Use:** "The Oracle says...", "Unlock", "glitch", "dopamine", "Aura".

**Sonic Identity ("Sonic DNA"):**
- **Texture:** Sharp, metallic "Schwing" (Katana slice) + Digital Glitch.
- **Music:** Glitch-Pop / Future Bass.
- **Voice:** Deep, intimate, slightly fried (ASMR quality).

**Visual Identity:**
- **Colors:** Deep Charcoal (#121212) background, Neon Accents (Red/Orange for hunger, Green/Purple for status).
- **Imagery:** Hyper-realistic macro food shots (Steam, dripping cheese, glistening fats).
- **UI Style:** Glassmorphism 2.0, bento grids, interactive micro-animations.

---

## 3. CURRENT TECHNICAL STATUS

### **A. Aura Admin Dashboard (Frontend)**
- **File:** `tech_dashboard.html` (in `Zlice-user` repo)
- **Repo URL:** `https://github.com/akshatlathi/Zlice-user/blob/main/tech_dashboard.html`
- **State:**
    - **Wireframe Complete:** Visuals for Revenue, Economy, Coupons, Partners are built.
    - **Navigation Fixed:** We implemented a robust `window.showScreen` global function to handle tab switching because standard `onclick` events were failing in some browser environments. **Do not refactor this back to simple inline JS without testing.**
    - **Login Removed:** The `connection-modal` has been removed to allow immediate access for demos. The authentication logic is bypassed.
    - **Backend:** **NOT IMPLEMENTED.** The dashboard currently uses hardcoded/mock data.

### **B. Marketing & Content**
- **Instagram Strategy:** Automated content engine using Make.com + Gemini + Pollinations.ai.
- **Themes:**
    - "The Midnight Diary": Anonymous student stories.
    - "The Food Oracle": Mystical food predictions.
- **Assets:** Standee designs finalized ("KGP. Upgraded.").

### **C. Repository Structure**
- `Zlice-user/`: Main git repository.
    - `tech_dashboard.html`: The **LATEST** dashboard code.
    - `*.xlsx`: Financial models (v6, v5_SF) are backed up here.
    - `*.html`: Older wireframes (reference only).

---

## 4. IMMEDIATE ROADMAP (What you need to do next)

### **Phase 1: Backend Integration (The "Real" Work)**
1.  **Supabase Setup:**
    - Create the project.
    - Schema: `users` (students), `partners` (restaurants), `coupons` (inventory), `aura_ledger` (transactions).
2.  **Connect Dashboard:**
    - Re-enable the login (securely).
    - Replace hardcoded HTML tables with `fetch()` calls to Supabase.

### **Phase 2: The "Aura" Economy**
1.  **Logic Implementation:**
    - Implement the "Inflation/Velocity" logic defined in `aura_monetary_policy.md`.
    - Build the "Dynamic Pricing" engine for coupons.

### **Phase 3: Marketing Rollout**
1.  **Execute the Automation:** Set up the Make.com workflows defined in `zlice_marketing_strategy.md`.
2.  **Sonic Branding:** Generate the actual audio assets using Suno/ElevenLabs as per `zlice_jingle_prompts.md`.

---

## 5. ARTIFACTS TO READ (Your Context Window)
*These files contain the "Soul" of the project.*
1.  `zlice_marketing_strategy.md`: The blueprint for viral growth.
2.  `zlice_ux_blueprint.md`: The "Neuroaesthetic" design Bible.
3.  `zlice_jingle_prompts.md`: The Audio identity guide.
4.  `aura_monetary_policy.md`: The economic math behind the token.

---

**Final Note to Agent:**
Maintain the "Premium" standard. If it looks basic, it fails. If it sounds boring, it fails. We are building a culture, not just an app.
