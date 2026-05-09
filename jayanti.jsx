import { useState, useEffect, useRef } from "react";

const ADMIN_PASSWORD = "jdmc2024";

const initialData = {
  events: [
    { id: 1, title: "Annual Sangeet Utsav 2025", date: "2025-12-15", description: "Grand annual music festival featuring classical and folk performances.", venue: "Raniganj Town Hall" },
    { id: 2, title: "Rabindra Jayanti Celebration", date: "2025-05-09", description: "Special evening dedicated to the songs of Rabindranath Tagore.", venue: "JDMC Auditorium, Raniganj" }
  ],
  about: "Jayanti Devi Musical Circle (JDMC) was founded with a vision to preserve, promote and propagate the rich musical heritage of Bengal. Based in Raniganj, West Burdwan, we have been nurturing musical talent for decades — from classical Hindustani vocals to Rabindra Sangeet, Baul, and folk traditions. Our circle is a sanctuary for artists, learners, and lovers of music. We conduct regular workshops, annual festivals, and community outreach programs to keep the flame of classical music alive for generations to come.",
  images: [],
  videos: []
};

const sampleEvents = initialData.events;

export default function App() {
  const [page, setPage] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState(initialData);
  const [sliderIdx, setSliderIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Admin state
  const [newEvent, setNewEvent] = useState({ title: "", date: "", description: "", venue: "" });
  const [editAbout, setEditAbout] = useState(data.about);
  const [adminTab, setAdminTab] = useState("events");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const imageInputRef = useRef();
  const videoFileRef = useRef();

  useEffect(() => {
    const saved = localStorage.getItem("jdmc_data");
    if (saved) setData(JSON.parse(saved));
  }, []);

  const save = (updated) => {
    setData(updated);
    localStorage.setItem("jdmc_data", JSON.stringify(updated));
  };

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = () => {
    if (loginInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setLoginError("");
      setPage("admin");
    } else {
      setLoginError("Incorrect password. Try again.");
    }
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    const updated = { ...data, events: [...data.events, { ...newEvent, id: Date.now() }] };
    save(updated);
    setNewEvent({ title: "", date: "", description: "", venue: "" });
    notify("Event added successfully!");
  };

  const deleteEvent = (id) => {
    const updated = { ...data, events: data.events.filter(e => e.id !== id) };
    save(updated);
    notify("Event removed.");
  };

  const saveAbout = () => {
    save({ ...data, about: editAbout });
    notify("About Us updated!");
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const updated = { ...data, images: [...data.images, { id: Date.now() + Math.random(), src: ev.target.result, name: file.name }] };
        save(updated);
        notify("Image uploaded!");
      };
      reader.readAsDataURL(file);
    });
  };

  const deleteImage = (id) => {
    const updated = { ...data, images: data.images.filter(img => img.id !== id) };
    save(updated);
    notify("Image deleted.");
  };

  const handleVideoFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const updated = { ...data, videos: [...data.videos, { id: Date.now(), src: ev.target.result, title: videoTitle || file.name, type: "file" }] };
      save(updated);
      setVideoTitle("");
      notify("Video uploaded!");
    };
    reader.readAsDataURL(file);
  };

  const addVideoUrl = () => {
    if (!videoUrl.trim()) return;
    const getYtId = (url) => {
      const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?]+)/);
      return m ? m[1] : null;
    };
    const ytId = getYtId(videoUrl);
    const updated = { ...data, videos: [...data.videos, { id: Date.now(), src: videoUrl, ytId, title: videoTitle || "Video", type: ytId ? "youtube" : "url" }] };
    save(updated);
    setVideoUrl("");
    setVideoTitle("");
    notify("Video added!");
  };

  const deleteVideo = (id) => {
    const updated = { ...data, videos: data.videos.filter(v => v.id !== id) };
    save(updated);
    notify("Video removed.");
  };

  // Auto-advance slider
  useEffect(() => {
    if (data.images.length < 2) return;
    const t = setInterval(() => setSliderIdx(i => (i + 1) % data.images.length), 4000);
    return () => clearInterval(t);
  }, [data.images.length]);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "events", label: "Events" },
    { id: "gallery", label: "Gallery" },
    { id: "videos", label: "Videos" },
    { id: "contact", label: "Contact" },
  ];

  const colors = {
    gold: "#C9922B",
    darkgold: "#9B6E1A",
    cream: "#FDF6E3",
    dark: "#1A1208",
    text: "#3D2B0A",
    muted: "#7A6040",
    red: "#8B1A1A",
  };

  const styles = {
    app: { fontFamily: "'Georgia', 'Times New Roman', serif", background: colors.cream, minHeight: "100vh", color: colors.text },
    nav: { background: colors.dark, padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.4)" },
    logo: { color: colors.gold, fontSize: "1.1rem", fontWeight: "bold", letterSpacing: "0.04em", padding: "1rem 0", lineHeight: 1.3 },
    logoSub: { color: "#bfa060", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", display: "block" },
    navLinks: { display: "flex", gap: "0.25rem", alignItems: "center" },
    navLink: (active) => ({ color: active ? colors.gold : "#ccc", background: "none", border: "none", cursor: "pointer", padding: "0.5rem 0.75rem", fontSize: "0.9rem", letterSpacing: "0.05em", borderBottom: active ? `2px solid ${colors.gold}` : "2px solid transparent", fontFamily: "inherit", transition: "color 0.2s" }),
    section: { maxWidth: 960, margin: "0 auto", padding: "3rem 1.5rem" },
    heading: { color: colors.red, fontSize: "2rem", fontWeight: "normal", letterSpacing: "0.06em", borderBottom: `2px solid ${colors.gold}`, paddingBottom: "0.5rem", marginBottom: "1.5rem", fontFamily: "inherit" },
    card: { background: "#fff", border: `1px solid #e8d9b0`, borderRadius: 8, padding: "1.5rem", marginBottom: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
    input: { width: "100%", padding: "0.6rem 0.8rem", border: `1px solid #d4b87a`, borderRadius: 5, fontFamily: "inherit", fontSize: "0.95rem", background: "#fffdf5", color: colors.text, boxSizing: "border-box" },
    btn: (variant = "primary") => ({
      padding: "0.55rem 1.4rem",
      border: "none",
      borderRadius: 5,
      cursor: "pointer",
      fontFamily: "inherit",
      fontSize: "0.9rem",
      fontWeight: "bold",
      letterSpacing: "0.04em",
      background: variant === "primary" ? colors.gold : variant === "danger" ? colors.red : "#eee",
      color: variant === "secondary" ? colors.text : "#fff",
      transition: "opacity 0.15s",
    }),
    label: { display: "block", fontSize: "0.82rem", color: colors.muted, marginBottom: "0.3rem", letterSpacing: "0.05em", textTransform: "uppercase" },
    adminTab: (active) => ({ padding: "0.5rem 1.2rem", border: "none", borderBottom: active ? `3px solid ${colors.gold}` : "3px solid transparent", background: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem", color: active ? colors.red : colors.muted, fontWeight: active ? "bold" : "normal" }),
  };

  // HERO
  const Hero = () => (
    <div style={{ background: `linear-gradient(160deg, #1A0E04 0%, #2E1A06 60%, #4A2E0A 100%)`, minHeight: 480, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "4rem 2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, rgba(201,146,43,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ fontSize: "3.5rem", color: colors.gold, marginBottom: "0.5rem", lineHeight: 1 }}>♪</div>
      <h1 style={{ color: colors.gold, fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: "normal", letterSpacing: "0.08em", margin: "0 0 0.5rem", fontFamily: "inherit" }}>Jayanti Devi Musical Circle</h1>
      <div style={{ color: "#bfa060", letterSpacing: "0.2em", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "1.5rem" }}>জয়ন্তী দেবী মিউজিক্যাল সার্কেল</div>
      <p style={{ color: "#e8d5a0", maxWidth: 520, lineHeight: 1.8, fontSize: "1rem" }}>Preserving the eternal heritage of Indian classical music in the heart of Raniganj since decades.</p>
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <button style={{ ...styles.btn("primary"), padding: "0.7rem 2rem" }} onClick={() => setPage("events")}>Upcoming Events</button>
        <button style={{ ...styles.btn("secondary"), padding: "0.7rem 2rem", background: "transparent", border: `1px solid ${colors.gold}`, color: colors.gold }} onClick={() => setPage("about")}>About Us</button>
      </div>
    </div>
  );

  // HOME
  const Home = () => (
    <div>
      <Hero />
      {/* Quick events preview */}
      <div style={{ background: "#fff7e6", padding: "2.5rem 1.5rem" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ ...styles.heading, fontSize: "1.4rem" }}>Upcoming Events</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: "1rem" }}>
            {data.events.slice(0, 3).map(ev => (
              <div key={ev.id} style={styles.card}>
                <div style={{ color: colors.gold, fontSize: "0.8rem", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>{ev.date}</div>
                <div style={{ fontWeight: "bold", color: colors.red, marginBottom: "0.3rem" }}>{ev.title}</div>
                <div style={{ fontSize: "0.9rem", color: colors.muted }}>{ev.venue}</div>
              </div>
            ))}
          </div>
          <button style={{ ...styles.btn(), marginTop: "1rem" }} onClick={() => setPage("events")}>View All Events →</button>
        </div>
      </div>
      {/* Slider preview */}
      {data.images.length > 0 && (
        <div style={{ background: colors.dark, padding: "2.5rem 1.5rem", textAlign: "center" }}>
          <h2 style={{ color: colors.gold, fontWeight: "normal", letterSpacing: "0.06em", marginBottom: "1.5rem" }}>Gallery Highlights</h2>
          <div style={{ maxWidth: 700, margin: "0 auto", borderRadius: 8, overflow: "hidden", position: "relative", height: 340 }}>
            <img src={data.images[sliderIdx % data.images.length].src} alt="Gallery" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6 }}>
              {data.images.map((_, i) => (
                <span key={i} onClick={() => setSliderIdx(i)} style={{ width: 8, height: 8, borderRadius: "50%", background: i === sliderIdx % data.images.length ? colors.gold : "rgba(255,255,255,0.4)", cursor: "pointer", display: "inline-block" }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ABOUT
  const About = () => (
    <div style={styles.section}>
      <h2 style={styles.heading}>About Us</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
        <div style={styles.card}>
          <div style={{ fontSize: "2.5rem", color: colors.gold, marginBottom: "1rem" }}>♬</div>
          <p style={{ lineHeight: 2, fontSize: "1.05rem", whiteSpace: "pre-wrap" }}>{data.about}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "1rem" }}>
          {[["♪", "Classical Music", "Hindustani & Carnatic traditions"], ["♫", "Rabindra Sangeet", "Songs of the poet laureate"], ["♩", "Folk & Baul", "Bengal's living musical soul"], ["🎼", "Training Programs", "For all ages and levels"]].map(([icon, t, d]) => (
            <div key={t} style={{ ...styles.card, textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{icon}</div>
              <div style={{ fontWeight: "bold", color: colors.red, marginBottom: "0.3rem" }}>{t}</div>
              <div style={{ fontSize: "0.85rem", color: colors.muted }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // EVENTS
  const Events = () => (
    <div style={styles.section}>
      <h2 style={styles.heading}>Events & Announcements</h2>
      {data.events.length === 0 && <p style={{ color: colors.muted }}>No events announced yet. Check back soon.</p>}
      {[...data.events].reverse().map(ev => (
        <div key={ev.id} style={{ ...styles.card, borderLeft: `4px solid ${colors.gold}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "1.15rem", color: colors.red }}>{ev.title}</div>
              <div style={{ color: colors.gold, fontSize: "0.85rem", margin: "0.3rem 0" }}>📅 {ev.date} &nbsp;|&nbsp; 📍 {ev.venue}</div>
              <div style={{ color: colors.text, lineHeight: 1.7 }}>{ev.description}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // GALLERY
  const Gallery = () => (
    <div style={styles.section}>
      <h2 style={styles.heading}>Photo Gallery</h2>
      {data.images.length === 0 && <p style={{ color: colors.muted }}>No images yet. The admin will add photos soon.</p>}
      {data.images.length > 0 && (
        <>
          {/* Main slider */}
          <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", marginBottom: "1.5rem", background: "#000", height: 400 }}>
            <img src={data.images[sliderIdx % data.images.length].src} alt="Slide" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.4s" }} />
            {data.images.length > 1 && (
              <>
                <button onClick={() => setSliderIdx(i => (i - 1 + data.images.length) % data.images.length)} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", fontSize: "1.2rem" }}>‹</button>
                <button onClick={() => setSliderIdx(i => (i + 1) % data.images.length)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", fontSize: "1.2rem" }}>›</button>
              </>
            )}
            <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6 }}>
              {data.images.map((_, i) => (
                <span key={i} onClick={() => setSliderIdx(i)} style={{ width: 9, height: 9, borderRadius: "50%", background: i === sliderIdx % data.images.length ? colors.gold : "rgba(255,255,255,0.45)", cursor: "pointer", display: "inline-block" }} />
              ))}
            </div>
          </div>
          {/* Thumbnails */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))", gap: "0.75rem" }}>
            {data.images.map((img, i) => (
              <div key={img.id} onClick={() => setSliderIdx(i)} style={{ borderRadius: 6, overflow: "hidden", cursor: "pointer", border: i === sliderIdx % data.images.length ? `3px solid ${colors.gold}` : "3px solid transparent", height: 90 }}>
                <img src={img.src} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  // VIDEOS
  const Videos = () => (
    <div style={styles.section}>
      <h2 style={styles.heading}>Video Collection</h2>
      {data.videos.length === 0 && <p style={{ color: colors.muted }}>No videos added yet.</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "1.25rem" }}>
        {data.videos.map(v => (
          <div key={v.id} style={styles.card}>
            <div style={{ fontWeight: "bold", color: colors.red, marginBottom: "0.75rem" }}>{v.title}</div>
            {v.type === "youtube" ? (
              <iframe width="100%" height="180" src={`https://www.youtube.com/embed/${v.ytId}`} frameBorder="0" allowFullScreen style={{ borderRadius: 6 }} />
            ) : v.type === "file" ? (
              <video src={v.src} controls style={{ width: "100%", borderRadius: 6, maxHeight: 180 }} />
            ) : (
              <a href={v.src} target="_blank" rel="noreferrer" style={{ color: colors.gold }}>Open Video Link ↗</a>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // CONTACT
  const Contact = () => (
    <div style={styles.section}>
      <h2 style={styles.heading}>Contact Us</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: "1.5rem" }}>
        {[
          { icon: "📞", label: "Phone", value: "+91 97322 36383", link: "tel:+919732236383" },
          { icon: "📍", label: "Location", value: "Raniganj, West Burdwan\nWest Bengal, India", link: "https://maps.google.com/?q=Raniganj,West+Bengal" },
          { icon: "🕐", label: "Office Hours", value: "Mon–Sat: 10am – 7pm\nSunday: By appointment" },
        ].map(c => (
          <div key={c.label} style={{ ...styles.card, textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{c.icon}</div>
            <div style={{ fontWeight: "bold", color: colors.red, marginBottom: "0.4rem" }}>{c.label}</div>
            {c.link ? <a href={c.link} style={{ color: colors.gold, textDecoration: "none", whiteSpace: "pre-line" }}>{c.value}</a> : <p style={{ color: colors.text, whiteSpace: "pre-line", margin: 0 }}>{c.value}</p>}
          </div>
        ))}
      </div>
      <div style={{ ...styles.card, marginTop: "1.5rem" }}>
        <h3 style={{ color: colors.red, marginTop: 0 }}>Send Us a Message</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div><label style={styles.label}>Your Name</label><input style={styles.input} placeholder="Full name" /></div>
          <div><label style={styles.label}>Phone / Email</label><input style={styles.input} placeholder="Contact info" /></div>
        </div>
        <div style={{ marginTop: "1rem" }}><label style={styles.label}>Message</label><textarea style={{ ...styles.input, minHeight: 100, resize: "vertical" }} placeholder="Your message here..." /></div>
        <button style={{ ...styles.btn("primary"), marginTop: "1rem" }}>Send Message ♪</button>
      </div>
    </div>
  );

  // LOGIN
  const Login = () => {
    const pwRef = useRef("");
    const [localError, setLocalError] = useState("");
    const attempt = () => {
      if (pwRef.current === ADMIN_PASSWORD) {
        setIsAdmin(true);
        setLoginError("");
        setPage("admin");
      } else {
        setLocalError("Incorrect password. Try again.");
      }
    };
    return (
      <div style={{ ...styles.section, maxWidth: 420, margin: "4rem auto" }}>
        <div style={styles.card}>
          <h2 style={{ ...styles.heading, fontSize: "1.4rem" }}>Admin Login</h2>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            style={styles.input}
            defaultValue=""
            onChange={e => { pwRef.current = e.target.value; }}
            onKeyDown={e => e.key === "Enter" && attempt()}
            placeholder="Enter admin password"
          />
          {localError && <p style={{ color: colors.red, fontSize: "0.85rem", marginTop: "0.5rem" }}>{localError}</p>}
          <button style={{ ...styles.btn("primary"), marginTop: "1rem", width: "100%" }} onClick={attempt}>Login</button>
          <p style={{ fontSize: "0.78rem", color: colors.muted, marginTop: "1rem", textAlign: "center" }}>Demo password: jdmc2024</p>
        </div>
      </div>
    );
  };

  // ADMIN PANEL — uses refs for all text inputs to avoid remount-on-rerender
  const Admin = () => {
    const evTitleRef = useRef();
    const evDateRef = useRef();
    const evVenueRef = useRef();
    const evDescRef = useRef();
    const aboutRef = useRef();
    const vidTitleRef = useRef();
    const vidUrlRef = useRef();

    const handleAddEvent = () => {
      const title = evTitleRef.current?.value?.trim();
      const date = evDateRef.current?.value;
      if (!title || !date) return;
      const venue = evVenueRef.current?.value || "";
      const description = evDescRef.current?.value || "";
      const updated = { ...data, events: [...data.events, { id: Date.now(), title, date, venue, description }] };
      save(updated);
      evTitleRef.current.value = "";
      evDateRef.current.value = "";
      evVenueRef.current.value = "";
      evDescRef.current.value = "";
      notify("Event added successfully!");
    };

    const handleSaveAbout = () => {
      save({ ...data, about: aboutRef.current?.value || data.about });
      notify("About Us updated!");
    };

    const handleAddVideoUrl = () => {
      const url = vidUrlRef.current?.value?.trim();
      if (!url) return;
      const title = vidTitleRef.current?.value?.trim() || "Video";
      const getYtId = (u) => { const m = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?]+)/); return m ? m[1] : null; };
      const ytId = getYtId(url);
      const updated = { ...data, videos: [...data.videos, { id: Date.now(), src: url, ytId, title, type: ytId ? "youtube" : "url" }] };
      save(updated);
      vidUrlRef.current.value = "";
      vidTitleRef.current.value = "";
      notify("Video added!");
    };

    const handleVideoFile = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const title = vidTitleRef.current?.value?.trim() || file.name;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const updated = { ...data, videos: [...data.videos, { id: Date.now(), src: ev.target.result, title, type: "file" }] };
        save(updated);
        if (vidTitleRef.current) vidTitleRef.current.value = "";
        notify("Video uploaded!");
      };
      reader.readAsDataURL(file);
    };

    return (
      <div style={styles.section}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <h2 style={{ ...styles.heading, marginBottom: 0, borderBottom: "none" }}>Admin Panel</h2>
          <button style={styles.btn("danger")} onClick={() => { setIsAdmin(false); setPage("home"); }}>Logout</button>
        </div>
        {/* Tabs */}
        <div style={{ borderBottom: `2px solid #e8d9b0`, marginBottom: "1.5rem", display: "flex", gap: "0.5rem", overflowX: "auto" }}>
          {["events", "about", "gallery", "videos"].map(t => (
            <button key={t} style={styles.adminTab(adminTab === t)} onClick={() => setAdminTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>

        {/* EVENTS */}
        {adminTab === "events" && (
          <div>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: colors.red }}>Add New Event</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div><label style={styles.label}>Event Title *</label><input ref={evTitleRef} style={styles.input} placeholder="Event name" /></div>
                <div><label style={styles.label}>Date *</label><input ref={evDateRef} type="date" style={styles.input} /></div>
                <div><label style={styles.label}>Venue</label><input ref={evVenueRef} style={styles.input} placeholder="Location/venue" /></div>
                <div><label style={styles.label}>Description</label><input ref={evDescRef} style={styles.input} placeholder="Brief description" /></div>
              </div>
              <button style={{ ...styles.btn("primary"), marginTop: "1rem" }} onClick={handleAddEvent}>+ Add Event</button>
            </div>
            <h3 style={{ color: colors.red }}>All Events ({data.events.length})</h3>
            {data.events.length === 0 && <p style={{ color: colors.muted }}>No events yet.</p>}
            {[...data.events].reverse().map(ev => (
              <div key={ev.id} style={{ ...styles.card, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                <div>
                  <div style={{ fontWeight: "bold", color: colors.red }}>{ev.title}</div>
                  <div style={{ color: colors.gold, fontSize: "0.85rem" }}>{ev.date} | {ev.venue}</div>
                  <div style={{ fontSize: "0.9rem", color: colors.muted }}>{ev.description}</div>
                </div>
                <button style={styles.btn("danger")} onClick={() => deleteEvent(ev.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}

        {/* ABOUT */}
        {adminTab === "about" && (
          <div style={styles.card}>
            <h3 style={{ marginTop: 0, color: colors.red }}>Edit About Us</h3>
            <textarea ref={aboutRef} style={{ ...styles.input, minHeight: 240, resize: "vertical" }} defaultValue={data.about} />
            <button style={{ ...styles.btn("primary"), marginTop: "1rem" }} onClick={handleSaveAbout}>Save Changes</button>
          </div>
        )}

        {/* GALLERY */}
        {adminTab === "gallery" && (
          <div>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: colors.red }}>Upload Images</h3>
              <input ref={imageInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: "none" }} />
              <button style={styles.btn("primary")} onClick={() => imageInputRef.current.click()}>+ Upload Images</button>
              <p style={{ color: colors.muted, fontSize: "0.85rem", marginTop: "0.5rem" }}>You can upload multiple images at once.</p>
            </div>
            <h3 style={{ color: colors.red }}>Uploaded Images ({data.images.length})</h3>
            {data.images.length === 0 && <p style={{ color: colors.muted }}>No images uploaded yet.</p>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: "0.75rem" }}>
              {data.images.map(img => (
                <div key={img.id} style={{ ...styles.card, padding: "0.5rem", textAlign: "center" }}>
                  <img src={img.src} alt={img.name} style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 5, marginBottom: "0.4rem" }} />
                  <div style={{ fontSize: "0.75rem", color: colors.muted, marginBottom: "0.4rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.name}</div>
                  <button style={{ ...styles.btn("danger"), padding: "0.3rem 0.8rem", fontSize: "0.8rem" }} onClick={() => deleteImage(img.id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIDEOS */}
        {adminTab === "videos" && (
          <div>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: colors.red }}>Add Video</h3>
              <label style={styles.label}>Video Title</label>
              <input ref={vidTitleRef} style={{ ...styles.input, marginBottom: "0.75rem" }} placeholder="Title (optional)" />
              <label style={styles.label}>YouTube URL</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input ref={vidUrlRef} style={styles.input} placeholder="https://www.youtube.com/watch?v=..." />
                <button style={{ ...styles.btn("primary"), whiteSpace: "nowrap" }} onClick={handleAddVideoUrl}>Add URL</button>
              </div>
              <div style={{ textAlign: "center", color: colors.muted, margin: "1rem 0", fontSize: "0.9rem" }}>— or —</div>
              <input ref={videoFileRef} type="file" accept="video/*" onChange={handleVideoFile} style={{ display: "none" }} />
              <button style={styles.btn()} onClick={() => videoFileRef.current.click()}>Upload Video File</button>
            </div>
            <h3 style={{ color: colors.red }}>Videos ({data.videos.length})</h3>
            {data.videos.length === 0 && <p style={{ color: colors.muted }}>No videos added yet.</p>}
            {data.videos.map(v => (
              <div key={v.id} style={{ ...styles.card, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                <div>
                  <div style={{ fontWeight: "bold", color: colors.red }}>{v.title}</div>
                  <div style={{ fontSize: "0.82rem", color: colors.muted }}>{v.type === "youtube" ? "YouTube" : v.type === "file" ? "Uploaded file" : "External URL"}</div>
                </div>
                <button style={styles.btn("danger")} onClick={() => deleteVideo(v.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.app}>
      {/* Notification */}
      {notification && (
        <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, background: notification.type === "success" ? "#2e7d32" : colors.red, color: "#fff", padding: "0.75rem 1.5rem", borderRadius: 8, fontSize: "0.9rem", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
          {notification.msg}
        </div>
      )}

      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.logo} onClick={() => setPage("home")} role="button" tabIndex={0} aria-label="Home">
          ♪ Jayanti Devi
          <span style={styles.logoSub}>Musical Circle · Raniganj</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {navLinks.map(l => (
              <button key={l.id} style={styles.navLink(page === l.id)} onClick={() => setPage(l.id)}>{l.label}</button>
            ))}
          </div>
          {!isAdmin
            ? <button style={{ ...styles.navLink(page === "login"), color: "#ffd080" }} onClick={() => setPage("login")}>Admin</button>
            : <button style={{ ...styles.navLink(page === "admin"), color: colors.gold }} onClick={() => setPage("admin")}>⚙ Admin</button>
          }
        </div>
      </nav>

      {/* Pages */}
      {page === "home" && <Home />}
      {page === "about" && <About />}
      {page === "events" && <Events />}
      {page === "gallery" && <Gallery />}
      {page === "videos" && <Videos />}
      {page === "contact" && <Contact />}
      {page === "login" && !isAdmin && <Login />}
      {page === "admin" && isAdmin && <Admin />}

      {/* Footer */}
      <footer style={{ background: colors.dark, color: "#bfa060", textAlign: "center", padding: "2rem 1rem", fontSize: "0.85rem", letterSpacing: "0.05em" }}>
        <div style={{ color: colors.gold, fontSize: "1.5rem", marginBottom: "0.5rem" }}>♪</div>
        <div style={{ marginBottom: "0.3rem" }}>Jayanti Devi Musical Circle · Raniganj, West Bengal</div>
        <div>📞 +91 97322 36383 &nbsp;|&nbsp; 📍 Raniganj, WB</div>
        <div style={{ marginTop: "1rem", fontSize: "0.78rem", color: "#7a6040" }}>© 2025 Jayanti Devi Musical Circle. All rights reserved.</div>
      </footer>
    </div>
  );
}
