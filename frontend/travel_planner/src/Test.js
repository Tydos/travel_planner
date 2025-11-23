import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Plane, 
  Users, 
  Trash2, 
  PlusCircle, 
  DollarSign, 
  MapPin, 
  Star, 
  Activity, 
  Menu, 
  X,
  ArrowRight,
  CheckCircle,
  MessageSquare,
  Heart,
  Zap,
  Shield,
  Camera,
  Sun,
  Mountain,
  Music,
  Calendar,
  Loader
} from "lucide-react";

// --- COMPONENTS ---

const Header = ({ setView, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-indigo-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 text-2xl font-bold cursor-pointer hover:text-indigo-200 transition"
          onClick={() => setView('landing')}
        >
          <Plane className="w-8 h-8" />
          <span>SquadPlanner</span>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          <button 
            onClick={() => setView('landing')}
            className={`hover:text-indigo-300 transition ${currentView === 'landing' ? 'text-indigo-300 font-semibold' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => setView('destinations')}
            className={`hover:text-indigo-300 transition ${currentView === 'destinations' ? 'text-indigo-300 font-semibold' : ''}`}
          >
            Destinations
          </button>
          <button 
            onClick={() => setView('planner')}
            className={`hover:text-indigo-300 transition ${currentView === 'planner' ? 'text-indigo-300 font-semibold' : ''}`}
          >
            Planner Dashboard
          </button>
          <button 
            onClick={() => setView('planner')}
            className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-full font-medium transition shadow-lg shadow-teal-500/30"
          >
            Get Started
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-800 p-4 flex flex-col gap-4">
          <button onClick={() => { setView('landing'); setIsMenuOpen(false); }}>Home</button>
          <button onClick={() => { setView('destinations'); setIsMenuOpen(false); }}>Destinations</button>
          <button onClick={() => { setView('planner'); setIsMenuOpen(false); }}>Planner</button>
        </div>
      )}
    </header>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 py-12">
    <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
      <div>
        <div className="flex items-center gap-2 text-xl font-bold text-white mb-4">
          <Plane className="w-6 h-6" />
          <span>SquadPlanner</span>
        </div>
        <p className="mb-4">Orchestrating the perfect group travel experience through consensus and budget optimization.</p>
        <div className="flex gap-4">
          {/* Social placeholders */}
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-500 hover:text-white transition cursor-pointer"><MessageSquare size={16}/></div>
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-500 hover:text-white transition cursor-pointer"><Heart size={16}/></div>
        </div>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:text-white transition">About Us</a></li>
          <li><a href="#" className="hover:text-white transition">How it Works</a></li>
          <li><a href="#" className="hover:text-white transition">Destinations</a></li>
          <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
        </ul>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-4">Contact</h3>
        <p>123 Innovation Drive</p>
        <p>Madison, WI 53703</p>
        <p className="mt-2 text-teal-400">hello@squadplanner.com</p>
        <p>+1 (555) 123-4567</p>
      </div>
    </div>
    <div className="text-center mt-12 pt-8 border-t border-gray-800 text-sm">
      © {new Date().getFullYear()} SquadPlanner. All rights reserved.
    </div>
  </footer>
);

const LandingPage = ({ onStart }) => (
  <div className="flex flex-col">
    {/* Hero Section */}
    <section className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white px-6 py-20">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Group Travel, <br/>
            <span className="text-teal-400">Simplified.</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 opacity-90 leading-relaxed">
            Stop fighting over budgets and itineraries. Let our algorithm find the perfect trip that makes everyone happy, balancing costs and interests seamlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button 
              onClick={onStart}
              className="group flex items-center justify-center gap-3 bg-teal-500 hover:bg-teal-400 text-indigo-900 px-8 py-4 rounded-full font-bold text-lg transition shadow-xl shadow-teal-900/20 transform hover:-translate-y-1"
            >
              Start Planning Free
              <ArrowRight className="group-hover:translate-x-1 transition" />
            </button>
          </div>
          <p className="text-sm text-indigo-300/70 pt-2">No credit card required • Instant results</p>
        </div>
        <div className="md:w-1/2 relative">
           {/* Decorative abstract graphic */}
           <div className="absolute top-0 right-0 bg-teal-500 w-64 h-64 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
           <div className="absolute bottom-0 left-10 bg-purple-500 w-72 h-72 rounded-full filter blur-3xl opacity-20"></div>
           <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-2xl relative z-10 transform rotate-2 hover:rotate-0 transition duration-500">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="text-white" />
                </div>
                <div>
                  <div className="h-2 w-32 bg-white/50 rounded mb-2"></div>
                  <div className="h-2 w-20 bg-white/30 rounded"></div>
                </div>
             </div>
             <div className="space-y-4">
               <div className="h-24 bg-white/5 rounded-lg border border-white/10 p-3 flex gap-3 items-center">
                  <div className="w-16 h-16 bg-indigo-500/30 rounded-md"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-2 w-3/4 bg-white/40 rounded"></div>
                    <div className="h-2 w-1/2 bg-white/20 rounded"></div>
                  </div>
               </div>
               <div className="h-4 w-5/6 bg-white/10 rounded"></div>
               <div className="h-4 w-4/6 bg-white/10 rounded"></div>
             </div>
           </div>
        </div>
      </div>
    </section>

    {/* How it Works Section */}
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Three simple steps to your dream vacation.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>
          
          <div className="flex flex-col items-center text-center bg-white">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg">
              <Users className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">1. Add Your Squad</h3>
            <p className="text-gray-600 px-4">Input details for everyone in your group, including their names.</p>
          </div>
          <div className="flex flex-col items-center text-center bg-white">
            <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg">
              <DollarSign className="w-10 h-10 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">2. Set Constraints</h3>
            <p className="text-gray-600 px-4">Define budgets, saving capacities, and individual preferences for activities.</p>
          </div>
          <div className="flex flex-col items-center text-center bg-white">
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg">
              <Zap className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">3. Get Optimized</h3>
            <p className="text-gray-600 px-4">Our algorithm crunches the numbers to find the perfect itinerary match.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why SquadPlanner?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We handle the complex math of group dynamics so you can focus on the memories.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <DollarSign className="w-8 h-8 text-green-500"/>, title: "Budget Optimization", desc: "Ensure no one spends more than they can afford while maximizing the group's experience." },
            { icon: <Activity className="w-8 h-8 text-blue-500"/>, title: "Activity Matching", desc: "Find activities that align with everyone's interests using our weighted preference system." },
            { icon: <Shield className="w-8 h-8 text-purple-500"/>, title: "Fair & Democratic", desc: "Our algorithm removes bias and ensures every voice is heard in the planning process." }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 group">
              <div className="mb-4 bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-20 bg-indigo-900 text-white text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6">Ready to plan your next adventure?</h2>
        <p className="text-indigo-200 mb-8 max-w-2xl mx-auto">Join thousands of groups who have simplified their travel planning process.</p>
        <button 
          onClick={onStart}
          className="bg-teal-500 hover:bg-teal-400 text-indigo-900 px-10 py-4 rounded-full font-bold text-lg shadow-xl transition transform hover:scale-105"
        >
          Start Planning Now
        </button>
      </div>
    </section>
  </div>
);

// --- NEW DESTINATIONS COMPONENT ---
const DestinationsPage = () => {
  const destinations = [
    {
      id: 1,
      name: "New York City, NY",
      tag: "Urban & Culture",
      image: "https://images.unsplash.com/photo-1496442226666-8d4a0e29e128?auto=format&fit=crop&q=80&w=800",
      description: "Experience the bustling energy of Times Square, world-class museums, and diverse culinary scenes.",
      icon: <Camera className="w-5 h-5 text-purple-500" />,
      rating: 4.8,
      price: "$$$"
    },
    {
      id: 2,
      name: "Grand Canyon, AZ",
      tag: "Nature & Adventure",
      image: "https://images.unsplash.com/photo-1474044159687-1ee9f883701f?auto=format&fit=crop&q=80&w=800",
      description: "Breathtaking views and hiking trails for every skill level in one of the world's natural wonders.",
      icon: <Mountain className="w-5 h-5 text-orange-500" />,
      rating: 4.9,
      price: "$$"
    },
    {
      id: 3,
      name: "Maui, Hawaii",
      tag: "Beach & Relaxation",
      image: "https://images.unsplash.com/photo-1542259548-26213747fcd3?auto=format&fit=crop&q=80&w=800",
      description: "Pristine beaches, the road to Hana, and incredible snorkeling spots for the ultimate group getaway.",
      icon: <Sun className="w-5 h-5 text-yellow-500" />,
      rating: 4.9,
      price: "$$$$"
    },
    {
      id: 4,
      name: "New Orleans, LA",
      tag: "Food & Nightlife",
      image: "https://images.unsplash.com/photo-1571893544028-06b07af6adee?auto=format&fit=crop&q=80&w=800",
      description: "Vibrant jazz music, historic French Quarter architecture, and unbeatable Creole cuisine.",
      icon: <Music className="w-5 h-5 text-indigo-500" />,
      rating: 4.7,
      price: "$$"
    },
    {
      id: 5,
      name: "Yellowstone, WY",
      tag: "Wilderness & Wildlife",
      image: "https://images.unsplash.com/photo-1544558635-667480601430?auto=format&fit=crop&q=80&w=800",
      description: "Geysers, hot springs, and abundant wildlife make this America's premier outdoor playground.",
      icon: <Mountain className="w-5 h-5 text-green-500" />,
      rating: 4.9,
      price: "$$"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Top Group Destinations</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Curated locations across the US that are perfect for squad trips, offering a mix of activities for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <div key={dest.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    {dest.icon}
                    {dest.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{dest.name}</h3>

                <div className="flex justify-between items-center mb-4 text-sm font-medium">
                  <span className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 fill-current" /> {dest.rating}
                  </span>
                  <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Price: {dest.price}</span>
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                  {dest.description}
                </p>

                <button className="w-full bg-white border-2 border-indigo-600 text-indigo-700 font-bold py-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 group-hover:gap-3">
                  Explore Itinerary
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PLANNER COMPONENT (With Original Logic) ---
const PlannerDashboard = () => {
  const [res, setRes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [refreshToggle, setRefreshToggle] = useState(0);
  const [deleteName, setDeleteName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    start_date: "",
    end_date: "",
    total_budget: "",
    monthly_saving_capacity: "",
    preference_weights: { nightlife: 0, adventure: 0, shopping: 0, food: 0, urban: 0 },
    constraints: { min_hotel_rating: 0, max_flight_legs: 0 },
    notes: ""
  });

  useEffect(() => {
    axios.get("http://localhost:5000/getusers")
      .then((response) => setRes(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, [refreshToggle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.preference_weights) {
      setFormData(prev => ({
        ...prev,
        preference_weights: { ...prev.preference_weights, [name]: Number(value) }
      }));
    } else if (name in formData.constraints) {
      setFormData(prev => ({
        ...prev,
        constraints: { ...prev.constraints, [name]: Number(value) }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/adduser", formData);
      setRefreshToggle(prev => prev + 1);
      setFormData({
        name: "", city: "", start_date: "", end_date: "", total_budget: "", monthly_saving_capacity: "",
        preference_weights: { nightlife: 0, adventure: 0, shopping: 0, food: 0, urban: 0 },
        constraints: { min_hotel_rating: 0, max_flight_legs: 0 }, notes: ""
      });
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteName.trim()) return;
    try {
      await axios.delete(`http://localhost:5000/deluser/${deleteName}`);
      setDeleteName("");
      setRefreshToggle(prev => prev + 1);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handlePlanTrip = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/planmytrip");
      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      setActivities(data);
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      // Small delay to ensure loading screen is visible for UX
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-12 relative">
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-indigo-900/90 z-[100] flex flex-col items-center justify-center text-white backdrop-blur-sm">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Plane className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
          <h2 className="mt-8 text-2xl font-bold tracking-wider">Generating Itinerary...</h2>
          <p className="text-indigo-200 mt-2">Crunching the numbers for your squad</p>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        
        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Controls & Users (Col Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Control Panel */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-indigo-900 p-4 flex items-center gap-2">
                <Users className="text-white w-5 h-5" />
                <h2 className="text-white font-semibold">Group Management</h2>
              </div>
              
              <div className="p-6">
                 {/* Add User Form */}
                 <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">New Member</h3>
                    <input className="input-field" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                    
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input className="input-field pl-10" name="city" placeholder="Origin City" value={formData.city} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-semibold">Start Date</label>
                        <input className="input-field" type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-semibold">End Date</label>
                        <input className="input-field" type="date" name="end_date" value={formData.end_date} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input className="input-field" type="number" name="total_budget" placeholder="Budget ($)" value={formData.total_budget} onChange={handleChange} />
                      <input className="input-field" type="number" name="monthly_saving_capacity" placeholder="Saving ($)" value={formData.monthly_saving_capacity} onChange={handleChange} />
                    </div>

                    {/* Preferences Sliders */}
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Interests (0-5)</h4>
                      <div className="space-y-3">
                        {Object.keys(formData.preference_weights).map(key => (
                          <div key={key} className="flex flex-col">
                            <div className="flex justify-between items-center mb-1">
                               <label className="text-xs font-bold text-gray-600 uppercase">{key}</label>
                               <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                 {formData.preference_weights[key]}
                               </span>
                            </div>
                            <input
                              type="range" 
                              min="0" 
                              max="5" 
                              name={key}
                              value={formData.preference_weights[key]} 
                              onChange={handleChange}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={handleSubmit} 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition flex justify-center items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" /> Add Member
                    </button>
                 </div>

                 <hr className="my-6 border-gray-100" />

                 {/* Delete User */}
                 <div className="flex gap-2">
                   <input 
                      className="input-field flex-grow" 
                      placeholder="Username to remove" 
                      value={deleteName} 
                      onChange={(e) => setDeleteName(e.target.value)} 
                    />
                   <button onClick={handleDelete} className="bg-red-50 text-red-500 px-3 rounded-lg hover:bg-red-100 transition">
                      <Trash2 className="w-5 h-5" />
                   </button>
                 </div>
              </div>
            </div>

            {/* Current Users List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
               <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Current Group</h3>
               {res.length === 0 ? (
                 <p className="text-sm text-gray-400 italic">No members added yet.</p>
               ) : (
                 <div className="space-y-3">
                   {res.map((user, i) => (
                     <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-200 transition">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500">Budget: ${user.total_budget}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {user.preference_weights && Object.entries(user.preference_weights).map(([k, v]) => v > 3 && (
                             <span key={k} title={k} className="w-2 h-2 rounded-full bg-teal-400"></span>
                          ))}
                        </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>

            {/* NEW STATIC CONTENT: Pro Tips Card */}
            <div className="bg-teal-50 rounded-2xl border border-teal-100 p-6">
              <h3 className="text-teal-800 font-bold flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5" /> Pro Planning Tips
              </h3>
              <ul className="text-sm text-teal-700 space-y-2">
                <li className="flex gap-2 items-start">
                  <span className="font-bold">•</span> Be honest about your budget constraints.
                </li>
                <li className="flex gap-2 items-start">
                  <span className="font-bold">•</span> Use the full 0-5 scale for preferences to help the algorithm distinguish interests.
                </li>
                <li className="flex gap-2 items-start">
                  <span className="font-bold">•</span> Add all members before clicking "Plan Trip" for the best results.
                </li>
              </ul>
            </div>

          </div>

          {/* RIGHT COLUMN: Action & Feed (Col Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Action Banner */}
            <div className="bg-gradient-to-r from-teal-500 to-indigo-600 rounded-2xl shadow-lg p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready to explore?</h2>
                <p className="text-indigo-100 opacity-90">Generate your optimized itinerary based on group consensus.</p>
              </div>
              <button 
                onClick={handlePlanTrip}
                className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold shadow-xl hover:bg-indigo-50 transition transform hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                PLAN TRIP NOW
              </button>
            </div>

            {/* Activities Feed (Full Width as requested) */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-500" />
                Itinerary Suggestions
              </h3>
              
              {activities.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                  <Plane className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No itinerary generated yet.</p>
                  <p className="text-sm text-gray-400">Add users and click Plan Trip to start.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {activities.map((activity, i) => (
                    <ActivityCard key={i} activity={activity} />
                  ))}
                </div>
              )}
            </div>

            {/* Static Helper Text Below Results */}
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm py-4">
              <Shield size={14} />
              <span>Results are generated based on local Madison, WI database availability.</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: FULL WIDTH ACTIVITY CARD ---
const ActivityCard = ({ activity }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className="flex flex-col md:flex-row h-full">
        {/* Left Color Bar */}
        <div className="hidden md:block w-3 bg-gradient-to-b from-indigo-500 to-teal-400"></div>
        
        {/* Content Area */}
        <div className="p-6 flex-grow flex flex-col justify-center">
           <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                 <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                   Activity
                 </span>
                 <h3 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition">
                   {activity.name}
                 </h3>
              </div>
              <span className="flex items-center gap-1 font-bold text-lg text-green-600 bg-green-50 px-3 py-1 rounded-full">
                ${activity.budget}
              </span>
           </div>
           
           <div className="mt-2 mb-4">
             <p className="text-gray-600 leading-relaxed text-sm md:text-base">
               <span className="font-semibold text-gray-900">Why this works: </span>
               {activity.justification_score}
             </p>
           </div>

           <div className="flex items-center gap-4 text-sm text-gray-400 pt-4 border-t border-gray-50">
             <div className="flex items-center gap-1">
               <Star className="w-4 h-4 text-yellow-400 fill-current" />
               <span>High Match</span>
             </div>
             <div className="flex items-center gap-1">
               <Activity className="w-4 h-4" />
               <span>Moderate Intensity</span>
             </div>
           </div>
        </div>

        {/* Action / Right Side */}
        <div className="bg-gray-50 p-6 flex items-center justify-center border-l border-gray-100">
           <button className="bg-white border border-gray-200 text-gray-600 hover:text-teal-600 hover:border-teal-400 p-3 rounded-full transition shadow-sm">
              <CheckCircle className="w-6 h-6" />
           </button>
        </div>
      </div>
    </div>
  );
};

// --- GLOBAL STYLES & UTILS ---
const inputStyles = `
  .input-field {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 0.75rem;
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s;
  }
  .input-field:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

// --- MAIN APP ENTRY ---
function App() {
  const [view, setView] = useState('landing'); // 'landing', 'planner', or 'destinations'

  return (
    <div className="font-sans text-gray-800">
      <style>{inputStyles}</style>
      <Header setView={setView} currentView={view} />
      
      <main>
        {view === 'landing' && <LandingPage onStart={() => setView('planner')} />}
        {view === 'destinations' && <DestinationsPage />}
        {view === 'planner' && <PlannerDashboard />}
      </main>

      <Footer />
    </div>
  );
}

export default App;