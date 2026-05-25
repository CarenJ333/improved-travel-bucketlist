# Trip Trail 🌍
**Your Travel Bucket List App**

A React-based travel tracking app with a rich editorial design.

## Features Included
- ✅ Add / Edit / Delete destinations (name, country, continent, image, description, coordinates, status, notes)
- ✅ View all destinations in a beautiful card grid
- ✅ Toggle "Visited" / "Not Yet" status per destination
- ✅ Filter by status and continent
- ✅ Search by name or country
- ✅ Destination detail view with editable notes
- ✅ Data persistence with localStorage
- ✅ Responsive design (mobile + desktop)
- ✅ Interactive map with OpenStreetMap (Leaflet) — visited pins (green) + bucket list pins (terracotta)
- ✅ Travel timeline grouped by year
- ✅ Weekly and yearly goal tracker with progress bars
- ✅ Sidebar stats: total, visited, bucket list, % explored

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack
- React 18
- React Router v6
- Leaflet + React-Leaflet (OpenStreetMap)
- localStorage for persistence
- DM Sans + Playfair Display fonts

## Folder Structure
```
src/
  components/
    AddDestinationModal.jsx   # Add/edit destination form
    DestinationCard.jsx       # Individual destination card
  pages/
    DestinationsPage.jsx      # Main list view
    DetailPage.jsx            # Single destination detail
    MapPage.jsx               # OpenStreetMap view
    TimelinePage.jsx          # Chronological journey view
    GoalsPage.jsx             # Weekly/yearly goal tracker
  hooks/
    useLocalStorage.js        # Persistence hook
  data/
    destinations.js           # Sample data + constants
  App.jsx                     # Main app + navigation
  App.css                     # Global styles
```

## Roadmap (from your brief)
- [ ] Firebase Authentication
- [ ] Unsplash API for destination images
- [ ] Firebase Firestore for cloud sync
- [ ] Photo uploads to travel timeline
