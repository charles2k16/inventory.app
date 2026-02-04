# Frontend - Inventory App (Nuxt.js 3)

## 📁 Complete Structure

```
frontend/
├── app.vue                  # Root component
├── nuxt.config.ts          # Nuxt configuration
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind CSS config
│
├── pages/                  # Application pages
│   ├── index.vue          # Dashboard (home page)
│   ├── login.vue          # Login page
│   ├── products.vue       # Products management
│   ├── sales.vue          # Sales transactions
│   ├── returns.vue        # Returns management
│   ├── lenders.vue        # Credit customers
│   └── stock-reports.vue  # Weekly stock reports
│
├── layouts/               # Page layouts
│   └── default.vue       # Default layout with navigation
│
├── components/            # Reusable components
│   ├── StatCard.vue      # Statistics card component
│   ├── LoadingSpinner.vue # Loading spinner
│   └── EmptyState.vue    # Empty state placeholder
│
├── composables/           # Composable functions
│   └── useApi.ts         # API helper functions
│
├── stores/                # Pinia stores (state management)
│
└── assets/
    └── css/
        └── main.css      # Tailwind CSS imports
```

## ✨ Pages Overview

### 1. **Dashboard (index.vue)**
- Real-time stats (products, stock value, sales, debt)
- Sales trend chart (Chart.js)
- Top selling products
- Recent sales
- Low stock alerts
- **Fully implemented with Tailwind CSS**

### 2. **Login (login.vue)**
- User authentication
- Form validation
- Error handling
- Default credentials shown
- Clean, centered design

### 3. **Products (products.vue)**
- Product listing table
- Search functionality
- Category filter
- Low stock filter
- Add/Edit/View products
- Color-coded stock levels

### 4. **Sales (sales.vue)**
- Sales dashboard
- Daily/Weekly summaries
- Pending payments tracking
- New sale creation
- Sales history

### 5. **Returns (returns.vue)**
- Product returns management
- Return reasons
- Refund tracking
- Status workflow

### 6. **Lenders (lenders.vue)**
- Credit customers list
- Total debt overview
- Payment tracking
- Customer management
- Debt alerts

### 7. **Stock Reports (stock-reports.vue)**
- Weekly reports
- Opening/closing stock
- Current week display
- Historical reports
- Variance analysis

## 🎨 Tailwind CSS Usage

All pages use Tailwind CSS extensively:

### Utility Classes Used:
- **Layout**: `flex`, `grid`, `grid-cols-*`
- **Spacing**: `p-*`, `m-*`, `gap-*`
- **Typography**: `text-*`, `font-*`
- **Colors**: `bg-*`, `text-*`, `border-*`
- **Effects**: `shadow`, `rounded-*`
- **Responsive**: `sm:*`, `md:*`, `lg:*`

### Custom Theme:
- Primary color palette (blue)
- Responsive breakpoints
- Custom spacing

### Components:
- Cards with shadows
- Tables with hover states
- Buttons with hover effects
- Status badges
- Loading spinners
- Navigation bar

## 🔧 Key Features

### Navigation
- Persistent navbar (in layout)
- Active link highlighting
- Logout functionality
- Responsive design

### Components
- **StatCard**: Reusable stat display
- **LoadingSpinner**: Consistent loading states
- **EmptyState**: Empty state placeholders

### Composables
- **useApi**: Centralized API calls
- Type-safe requests
- Error handling
- Authentication headers

## 📱 Responsive Design

All pages are mobile-responsive:
- Mobile: Single column, stacked
- Tablet: 2 columns where appropriate
- Desktop: Full multi-column layouts

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔐 Authentication

- Login required for all pages (except login page)
- JWT token stored in localStorage
- Token sent with all API requests
- Logout clears token and redirects

## 🎯 What Works Out of the Box

✅ All pages render correctly
✅ Navigation between pages
✅ Tailwind CSS styling
✅ Responsive layouts
✅ Loading states
✅ Error handling
✅ Authentication flow
✅ API integration ready

## 🎨 Styling Highlights

### Dashboard
- 4-column stats grid (responsive)
- Chart.js integration
- Color-coded status badges
- Clean card layouts

### Products
- Searchable, filterable table
- Low stock highlights (red/green)
- Hover effects
- Action buttons

### Navigation
- Active link indicators
- Hover states
- Responsive menu
- Professional header

## 📦 Dependencies

All modern, production-ready:
- **Nuxt 3**: Latest Vue framework
- **Tailwind CSS**: Utility-first CSS
- **Chart.js**: Data visualization
- **Pinia**: State management
- **TypeScript**: Type safety

## 🎓 Code Quality

- Clean, readable code
- Proper component structure
- Reusable components
- Type-safe composables
- Consistent styling

## 🔧 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Your brand colors
  }
}
```

### Add New Page
1. Create file in `pages/`
2. Add navigation link in `layouts/default.vue`
3. Use existing components for consistency

### Add API Calls
Extend `composables/useApi.ts`

## ✅ Production Ready

- Optimized builds
- Code splitting
- SEO friendly
- Performance optimized
- Secure authentication

---

**All pages are styled with Tailwind CSS and ready to use!** 🎨✨
