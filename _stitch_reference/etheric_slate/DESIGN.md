# Design System Document

## 1. Overview & Creative North Star: "The Celestial Archive"

This design system is built to facilitate introspection. Moving away from the rigid, "productivity-first" layouts of traditional journaling apps, this system follows the Creative North Star of **The Celestial Archive**. 

The UI is not a tool; it is a space. We treat user thoughts as "nodes" in a vast, dark expanse. To achieve this, we reject the standard "boxed-in" grid. Instead, we use **intentional asymmetry** and **tonal depth** to create an organic, floating experience. Elements should feel as though they are suspended in a low-gravity environment, using soft glows and layered transparency to guide the eye rather than harsh lines.

**Spanish Localization Note:** The interface uses Spanish. Because Spanish words are often 20-30% longer than English counterparts, layouts must prioritize horizontal breathing room and flexible containers to avoid cramped typography.

---

### 2. Colors: Ethereal Depth

Our palette is rooted in the void of the night sky, punctuated by the soft light of conscious thought.

#### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections or containers. 
*   **The Technique:** Boundaries must be defined solely through background shifts. Place a `surface-container-low` section on a `surface` background to create a subtle "dip" in the interface. Use the `surface-container-lowest` (#000000) for the most profound areas of focus, like the main journaling canvas.

#### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
*   **Base:** `background` (#0e0e0e)
*   **Layer 1 (The Stage):** `surface-container` (#191a1a)
*   **Layer 2 (The Focus):** `surface-container-high` (#1f2020)
*   **The "Glass & Gradient" Rule:** Floating elements (modals, active nodes) must use `surface-variant` (#262626) at 60% opacity with a `20px` backdrop-blur. 

#### Signature Accents
*   **Primary (Teal):** `primary` (#89d4cd) - Use for active mental "threads."
*   **Secondary (Violet):** `secondary` (#d3bcfc) - Use for reflective insights or past memories.
*   **Tertiary (Amber):** `tertiary` (#ffeaaf) - Use for critical breakthroughs or "Aha!" moments.
*   **CTA Soul:** Hero buttons should not be flat. Use a subtle linear gradient from `primary` (#89d4cd) to `primary_container` (#01625d) at a 135-degree angle.

---

### 3. Typography: Manrope (Modern Minimalist)

We use **Manrope** for its geometric clarity and organic warmth. It bridges the gap between technical precision and human emotion.

*   **Display (Display-LG/MD):** Used for mood-tracking summaries and "Thread" titles. Use low tracking (-2%) to make the Spanish words feel more architectural.
*   **Headlines (Headline-SM):** Used for section headers like *"Pensamientos de Hoy"* (Today's Thoughts).
*   **Body (Body-LG):** The core journaling experience. Line height must be generous (1.6) to allow the "thread" of thought to breathe.
*   **Labels (Label-MD):** Used for metadata (date, mood tags). Always in uppercase with +5% letter spacing to evoke a premium, editorial feel.

---

### 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are too "digital." We use **Ambient Light** and **Tonal Layering**.

*   **The Layering Principle:** To lift an element, move it one step up the surface tier. A `surface-container-highest` card sitting on a `surface-container-low` background provides enough contrast to be felt, rather than seen.
*   **Ambient Shadows:** For floating "Thought Nodes," use an extra-diffused shadow: `box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);`.
*   **The "Ghost Border" Fallback:** If a boundary is required for accessibility, use `outline-variant` (#484848) at **15% opacity**. This creates a "suggestion" of a line that disappears into the background.
*   **Ethereal Glow:** Active nodes should utilize a soft outer glow using the `primary` (#89d4cd) color at 20% opacity with a 15px blur.

---

### 5. Components: The Archive Elements

#### Buttons (Botones)
*   **Primary:** Gradient fill (`primary` to `primary_container`), `xl` (0.75rem) roundedness. No border.
*   **Secondary:** Ghost style. No background. `primary` text. No border unless hovered, then show a "Ghost Border."
*   **Tertiary:** `on_surface_variant` text, minimal footprint.

#### Mental Nodes (Nodos)
A custom component for this app. Small circles (8px to 12px).
*   **Inactive:** `surface_variant` (#262626).
*   **Active:** `primary` (#89d4cd) with a 10px soft glow.
*   **Connection:** Use `outline_variant` at 20% opacity for the "threads" connecting nodes.

#### Input Fields (Entradas de Texto)
*   **Styling:** Remove the traditional box. Use a simple `surface-container-low` background with an `md` (0.375rem) corner radius.
*   **States:** On focus, the background transitions to `surface-container-high`. The cursor (caret) should be the `primary` color.

#### Cards & Lists (Tarjetas y Listas)
*   **The "No Divider" Rule:** Forbid 1px dividers between list items. Use 16px of vertical whitespace or a subtle stagger in the `surface-container` hierarchy to separate entries.

---

### 6. Do's and Don'ts

#### Do
*   **Do** use asymmetrical layouts. Let a "thread" start on the left and drift toward the right.
*   **Do** prioritize "Espacio en Blanco" (White space). The app should feel like a quiet room.
*   **Do** use lowercase for body text headers to increase the feeling of a private, informal journal.

#### Don't
*   **Don't** use pure white (#FFFFFF). It is too harsh for a reflective dark mode. Use `on_surface` (#e7e5e4).
*   **Don't** use standard Material Design "elevated" buttons with heavy shadows. They feel too "transactional."
*   **Don't** cram content. If a Spanish sentence is long, let it wrap or provide more height; never truncate a user's thought with "..." (ellipses).

#### Accessibility
*   Ensure the contrast ratio between `on_surface` and `surface_dim` remains at least 4.5:1. 
*   Interactive nodes must have a minimum touch target of 44x44px, even if the visual "node" is only 8px.