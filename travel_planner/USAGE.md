# 🌍 Travel Planner - User Guide

## Features

✨ **Beautiful UI** - Modern gradient design  
👥 **Collaborative Planning** - Invite friends with unique ID  
🎯 **Smart Preferences** - Budget, pace, interests, and more  
📧 **Email Invites** - Share trip link easily  
🔗 **Shareable Links** - Unique trip ID for each group  

## Quick Start

```bash
cd travel_planner
npm run dev
```

Open: http://localhost:5173

## Workflow

### Step 1: Create Trip
- Enter your name and email
- Choose destination and dates
- Select budget (Budget / Moderate / Luxury)
- Choose travel pace (Relaxed / Moderate / Packed)
- Pick your interests
- Add dietary restrictions and preferences

### Step 2: Invite Friends
- Get unique trip ID (e.g., ABC123)
- Copy shareable link
- Send email invites to friends
- Friends join using the link

### Step 3: Generate Itinerary
- All participants submit preferences
- AI generates itinerary based on everyone's inputs
- Rate and refine itinerary
- Get final perfect plan!

## Form Fields

**Personal:**
- Username *
- Email *

**Trip Details:**
- Destination *
- Start Date *
- End Date *

**Preferences:**
- Budget: Budget / Moderate / Luxury
- Pace: Relaxed / Moderate / Packed
- Interests: 10+ options (Culture, Food, Adventure, etc.)
- Dietary Restrictions
- Accommodation Type
- Travel Style
- Additional Notes

## Technologies

- React 19
- Vite
- Modern CSS with Gradients
- Responsive Design

## Next Steps

Connect to backend:
- POST `/api/trips` - Create trip
- POST `/api/invites` - Send invitations
- POST `/api/preferences` - Submit preferences
- POST `/api/itinerary/generate` - Generate itinerary

---

**Ready to plan amazing trips!** ✈️

