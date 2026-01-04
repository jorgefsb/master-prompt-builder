# Implementation Plan: Landing Page Polish & Phase 2 Kickoff

## Phase 1: UI Final Polish (Current)
1. **Refine Chips**: Ensure `.glass-chip` has proper `backdrop-filter`, `border`, and `hover` effects.
2. **Icons**: Use high-quality emojis or SVG icons for the AI engines.
3. **Anchor Fix**: Update `#how-it-works` ID to be at the top of the "Pain" section to show the full narrative.
4. **Button Verification**: Test all "Comenzar" buttons to ensure navigation to Onboarding.

## Phase 2: Lead Capture & Infrastructure
1. **Supabase Setup**: 
    - Create `leads` table.
    - Create `master_prompts` table.
2. **Authentication**:
    - Implement Google/GitHub Auth for the "Acceso VIP" button.
3. **Wizard Persistence**:
    - Save progress to Supabase for logged-in users.
4. **Export Logic**:
    - Finalize PDF/MD export functions.
