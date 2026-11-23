import { useMemo, useState } from 'react'
import {
  ArrowRight, ArrowUpRight, BookOpen, Check, CheckCircle2, Clock3,
  Coffee, Headphones, MapPin, Search, SlidersHorizontal, Sparkles,
  Users, Wifi, Zap, X, Leaf, Menu, CalendarDays, UsersRound
} from 'lucide-react'

type Vibe = 'Quiet' | 'Moderate' | 'Group'
type Spot = {
  id: number
  name: string
  building: string
  floor: string
  seats: number
  totalSeats: number
  vibe: Vibe
  outlets: boolean
  hours: string
  description: string
  image: string
  tags: string[]
}

const initialSpots: Spot[] = [
  {
    id: 1, name: 'The Reading Nook', building: 'Learning Commons', floor: '2nd floor',
    seats: 8, totalSeats: 24, vibe: 'Quiet', outlets: true, hours: '7:00 AM – 8:00 PM',
    description: 'A calm corner for deep focus, solo reading, and getting things done.',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1000&q=85',
    tags: ['Silent zone', 'Window seats']
  },
  {
    id: 2, name: 'Greenhouse Lounge', building: 'Student Center', floor: 'Ground floor',
    seats: 12, totalSeats: 30, vibe: 'Moderate', outlets: true, hours: '8:00 AM – 9:00 PM',
    description: 'A bright, plant-filled space for a little background buzz and creative work.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85',
    tags: ['Natural light', 'Coffee nearby']
  },
  {
    id: 3, name: 'Collab Studio', building: 'Innovation Hall', floor: '3rd floor',
    seats: 5, totalSeats: 16, vibe: 'Group', outlets: true, hours: '9:00 AM – 7:00 PM',
    description: 'Bring your people, spread out your notes, and make something great.',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85',
    tags: ['Whiteboard', 'Team tables']
  },
  {
    id: 4, name: 'The Quiet Floor', building: 'Main Library', floor: '4th floor',
    seats: 3, totalSeats: 40, vibe: 'Quiet', outlets: false, hours: '7:00 AM – 10:00 PM',
    description: 'A no-distractions zone when you really need to lock in.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=85',
    tags: ['Silent zone', 'Individual desks']
  },
  {
    id: 5, name: 'Corner Café Tables', building: 'Student Center', floor: 'Ground floor',
    seats: 9, totalSeats: 18, vibe: 'Moderate', outlets: false, hours: '7:30 AM – 6:00 PM',
    description: 'A relaxed spot for quick review sessions and a change of scenery.',
    image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1000&q=85',
    tags: ['Casual vibe', 'Snacks nearby']
  },
  {
    id: 6, name: 'Project Room B', building: 'Innovation Hall', floor: '2nd floor',
    seats: 2, totalSeats: 10, vibe: 'Group', outlets: true, hours: '8:00 AM – 8:00 PM',
    description: 'A smaller room for planning, practice, and last-minute group work.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=85',
    tags: ['Team tables', 'Power outlets']
  }
]

type CampusEvent = { id: number; title: string; type: string; date: string; time: string; location: string; description: string; capacity: number; attendees: number; image: string }

const initialEvents: CampusEvent[] = [
  { id: 1, title: 'Focus Friday', type: 'Group study', date: 'Friday, November 27', time: '3:00 PM – 5:00 PM', location: 'Learning Commons · 2nd floor', description: 'A quiet, guided study session with dedicated focus blocks and short breaks.', capacity: 20, attendees: 14, image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85' },
  { id: 2, title: 'Study Skills Workshop', type: 'Workshop', date: 'Monday, November 30', time: '10:00 AM – 11:30 AM', location: 'Innovation Hall · Room 204', description: 'Learn practical note-taking, time management, and exam preparation techniques.', capacity: 30, attendees: 18, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85' },
  { id: 3, title: 'Math Buddies Meetup', type: 'Peer study', date: 'Wednesday, December 2', time: '1:00 PM – 2:30 PM', location: 'Greenhouse Lounge · Student Center', description: 'Bring your questions and work through tricky problems with fellow students.', capacity: 12, attendees: 12, image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=85' }
]

function StudySpotFinder() {
  const [spots, setSpots] = useState(initialSpots)
  const [events, setEvents] = useState(initialEvents)
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null)
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpEmail, setRsvpEmail] = useState('')
  const [rsvpConfirmed, setRsvpConfirmed] = useState(false)
  const [query, setQuery] = useState('')
  const [vibe, setVibe] = useState('Any vibe')
  const [outletsOnly, setOutletsOnly] = useState(false)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [selected, setSelected] = useState<Spot | null>(null)
  const [name, setName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [duration, setDuration] = useState('2 hours')
  const [confirmed, setConfirmed] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  const filtered = useMemo(() => spots.filter(spot => {
    const searchMatch = `${spot.name} ${spot.building} ${spot.description} ${spot.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())
    const vibeMatch = vibe === 'Any vibe' || spot.vibe === vibe
    const outletMatch = !outletsOnly || spot.outlets
    const availableMatch = !availableOnly || spot.seats > 0
    return searchMatch && vibeMatch && outletMatch && availableMatch
  }), [spots, query, vibe, outletsOnly, availableOnly])

  const openBooking = (spot: Spot) => {
    setSelected(spot)
    setConfirmed(false)
    setName('')
    setStudentId('')
    setDuration('2 hours')
  }

  const reserve = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selected || !name.trim() || !studentId.trim()) return
    setSpots(current => current.map(spot => spot.id === selected.id
      ? { ...spot, seats: Math.max(spot.seats - 1, 0) }
      : spot))
    setConfirmed(true)
  }

  const closeModal = () => {
    setSelected(null)
    setConfirmed(false)
  }

  return (
    <div className="app-shell">
      <nav className="topbar">
        <a href="#" className="brand" aria-label="StudySpot home">
          <span className="brand-mark"><Leaf size={19} strokeWidth={2.2} /></span>
          <span>study<span className="brand-light">spot</span><span className="brand-period">.</span></span>
        </a>
        <div className={`nav-links ${mobileMenu ? 'nav-open' : ''}`}>
          <a href="#spaces" onClick={() => setMobileMenu(false)}>Find a spot</a>\n          <a href="#events" onClick={() => setMobileMenu(false)}>Events & RSVP</a>
          <a href="#how-it-works" onClick={() => setMobileMenu(false)}>How it works</a>
          <a href="#about" onClick={() => setMobileMenu(false)}>About</a>
        </div>
        <a className="nav-cta" href="#spaces">Explore spaces <ArrowUpRight size={15} /></a>
        <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle navigation">
          {mobileMenu ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> YOUR CAMPUS, YOUR CORNER</div>
            <h1>Find your space.<br /><em>Find your focus.</em></h1>
            <p className="hero-description">Good study sessions start with the right spot. Discover open spaces around campus and save your seat before you even leave class.</p>
            <div className="hero-actions">
              <a href="#spaces" className="primary-button">Find my study spot <ArrowRight size={17} /></a>
              <a href="#how-it-works" className="text-link">See how it works <ArrowUpRight size={15} /></a>
            </div>
            <div className="hero-proof">
              <div className="proof-avatars"><span>A</span><span>M</span><span>J</span><span>+</span></div>
              <p><strong>Less wandering, more learning.</strong><br />Made for the way students study.</p>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-photo" role="img" aria-label="Warm, light-filled library study space" />
            <div className="photo-label"><span className="live-dot" /> CAMPUS SPACES, AT A GLANCE</div>
            <div className="floating-card">
              <div className="floating-icon"><BookOpen size={18} /></div>
              <div><strong>Your next study session</strong><span>Starts with one good seat.</span></div>
              <ArrowUpRight size={17} className="floating-arrow" />
            </div>
            <div className="hero-stamp"><Sparkles size={16} /><span>MAKE ROOM<br />FOR GOOD IDEAS</span></div>
          </div>
          <div className="hero-index"><span>01</span><span className="index-line" /><span>STUDY SMARTER</span></div>
        </section>

        <section className="stats-strip" aria-label="StudySpot highlights">
          <div><strong>06</strong><span>SPACES TO EXPLORE</span></div>
          <div><strong>03</strong><span>STUDY VIBES</span></div>
          <div><strong>01</strong><span>LESS THING TO WORRY ABOUT</span></div>
          <p>A little less searching.<br /><em>A lot more studying.</em></p>
        </section>

        <section className="spaces-section" id="spaces">
          <div className="section-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-dot" /> THE SPACE DIRECTORY</div>
              <h2>Your spot is <em>out there.</em></h2>
              <p>Browse campus spaces and find the atmosphere that works for you.</p>
            </div>
            <div className="result-count"><span>{filtered.length.toString().padStart(2, '0')}</span> SPACES FOUND</div>
          </div>

          <div className="search-panel">
            <div className="search-box"><Search size={19} /><input aria-label="Search spaces" placeholder="Search by name, building, or keyword..." value={query} onChange={e => setQuery(e.target.value)} /><kbd>⌘ K</kbd></div>
            <div className="filter-divider" />
            <label className="vibe-select"><SlidersHorizontal size={16} /><select aria-label="Filter by study vibe" value={vibe} onChange={e => setVibe(e.target.value)}><option>Any vibe</option><option>Quiet</option><option>Moderate</option><option>Group</option></select></label>
            <label className="check-filter"><input type="checkbox" checked={availableOnly} onChange={e => setAvailableOnly(e.target.checked)} /><span className="custom-check"><Check size={12} /></span> Seats open</label>
            <label className="check-filter"><input type="checkbox" checked={outletsOnly} onChange={e => setOutletsOnly(e.target.checked)} /><span className="custom-check"><Check size={12} /></span> Power outlets</label>
          </div>

          <div className="active-filters">
            <span>SHOWING</span><b>{vibe === 'Any vibe' ? 'ALL VIBES' : vibe.toUpperCase()}</b>
            {availableOnly && <b>SEATS OPEN</b>}{outletsOnly && <b>POWER OUTLETS</b>}
            {(query || vibe !== 'Any vibe' || availableOnly || outletsOnly) && <button onClick={() => { setQuery(''); setVibe('Any vibe'); setAvailableOnly(false); setOutletsOnly(false) }}>Clear filters <X size={12} /></button>}
          </div>

          {filtered.length > 0 ? <div className="space-grid">
            {filtered.map((spot, index) => (
              <article className="space-card" key={spot.id}>
                <div className="space-image-wrap">
                  <img src={spot.image} alt={spot.name} className="space-image" />
                  <span className={`vibe-pill vibe-${spot.vibe.toLowerCase()}`}>{spot.vibe === 'Quiet' ? <Headphones size={12} /> : spot.vibe === 'Group' ? <Users size={12} /> : <Coffee size={12} />} {spot.vibe}</span>
                  <span className="card-number">0{index + 1}</span>
                </div>
                <div className="space-card-body">
                  <div className="card-location"><MapPin size={13} /> {spot.building} <span>·</span> {spot.floor}</div>
                  <h3>{spot.name}</h3>
                  <p className="card-description">{spot.description}</p>
                  <div className="card-meta">
                    <span className={spot.seats > 0 ? 'seats-available' : 'seats-full'}><span className="tiny-dot" /> {spot.seats} seats available</span>
                    <span><Clock3 size={13} /> {spot.hours}</span>
                  </div>
                  <div className="card-bottom">
                    <div className="amenities">{spot.outlets && <span><Zap size={13} /> Outlets</span>}<span><Wifi size={13} /> Wi-Fi</span></div>
                    <button className="reserve-button" onClick={() => openBooking(spot)} disabled={spot.seats === 0}>{spot.seats === 0 ? 'Full' : 'Reserve'} <ArrowUpRight size={15} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div> : <div className="empty-state"><Search size={28} /><h3>No spots found just yet.</h3><p>Try another keyword or clear your filters to see all spaces.</p><button onClick={() => { setQuery(''); setVibe('Any vibe'); setAvailableOnly(false); setOutletsOnly(false) }}>Show all spaces</button></div>}
          <p className="directory-note"><span className="tiny-dot" /> Availability shown is sample data for this prototype.</p>
        </section>

        <section className="events-section" id="events">
          <div className="section-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-dot" /> CAMPUS COMMUNITY</div>
              <h2>More than a seat.<br /><em>Find your people.</em></h2>
              <p>Join study sessions, learn something new, and meet classmates along the way.</p>
            </div>
            <div className="result-count"><span>{events.length.toString().padStart(2, '0')}</span> UPCOMING EVENTS</div>
          </div>
          <div className="event-grid">
            {events.map(event => {
              const remaining = Math.max(event.capacity - event.attendees, 0)
              return <article className="event-card" key={event.id}>
                <div className="event-image-wrap"><img src={event.image} alt="" /><span className="event-type">{event.type}</span></div>
                <div className="event-body">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className="event-detail"><CalendarDays size={14} /> {event.date} · {event.time}</div>
                  <div className="event-detail"><MapPin size={14} /> {event.location}</div>
                  <div className="event-footer"><span className={remaining ? 'event-seats' : 'event-full'}><UsersRound size={14} /> {remaining ? remaining + ' spots left' : 'Fully booked'}</span>
                    <button className="reserve-button" disabled={!remaining} onClick={() => { setSelectedEvent(event); setRsvpName(''); setRsvpEmail(''); setRsvpConfirmed(false) }}>{remaining ? 'RSVP now' : 'Full'} <ArrowUpRight size={15} /></button>
                  </div>
                </div>
              </article>
            })}
          </div>
          <p className="directory-note"><span className="tiny-dot" /> Event schedules and RSVP counts are sample data for this prototype.</p>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="how-intro">
            <div className="eyebrow"><span className="eyebrow-dot" /> THE EASY PART</div>
            <h2>Three steps.<br /><em>Zero guesswork.</em></h2>
            <p>Because your time is better spent learning than looking for somewhere to sit.</p>
          </div>
          <div className="steps">
            <div className="step"><span className="step-index">01</span><div className="step-icon"><Search size={21} /></div><h3>Explore</h3><p>Search campus spaces by name, building, or the kind of atmosphere you need.</p><ArrowRight size={17} className="step-arrow" /></div>
            <div className="step"><span className="step-index">02</span><div className="step-icon"><SlidersHorizontal size={21} /></div><h3>Find your vibe</h3><p>Filter by quiet or group-friendly spaces, open seats, and power outlets.</p><ArrowRight size={17} className="step-arrow" /></div>
            <div className="step"><span className="step-index">03</span><div className="step-icon"><CheckCircle2 size={21} /></div><h3>Save your seat</h3><p>Enter your student details, choose a session, and get a reservation confirmation.</p><ArrowRight size={17} className="step-arrow" /></div>
          </div>
        </section>

        <section className="quote-section" id="about">
          <div className="quote-mark">“</div>
          <blockquote>A good place to study can make<br />a <em>world of difference.</em></blockquote>
          <p>STUDYSPOT — MADE FOR STUDENT LIFE</p>
          <div className="quote-decoration"><Leaf size={45} strokeWidth={1} /></div>
        </section>
      </main>

      <footer className="footer">
        <a href="#" className="brand"><span className="brand-mark"><Leaf size={17} /></span><span>study<span className="brand-light">spot</span><span className="brand-period">.</span></span></a>
        <p>Find your space. Find your focus.</p>
        <span>DESIGNED FOR CAMPUS LIFE · 2026</span>
      </footer>

      {selectedEvent && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setSelectedEvent(null) }}>
        <div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="rsvp-title">
          <button className="modal-close" onClick={() => setSelectedEvent(null)} aria-label="Close RSVP"><X size={19} /></button>
          {!rsvpConfirmed ? <>
            <div className="eyebrow"><span className="eyebrow-dot" /> SAVE YOUR PLACE</div>
            <h2 id="rsvp-title">Count me <em>in.</em></h2>
            <p className="modal-subtitle">RSVP for {selectedEvent.title}.</p>
            <div className="booking-summary"><img src={selectedEvent.image} alt="" /><div><strong>{selectedEvent.title}</strong><span><CalendarDays size={12} /> {selectedEvent.date} · {selectedEvent.time}</span><small>{selectedEvent.location}</small></div></div>
            <form className="booking-form" onSubmit={e => { e.preventDefault(); setEvents(current => current.map(item => item.id === selectedEvent.id ? { ...item, attendees: Math.min(item.attendees + 1, item.capacity) } : item)); setRsvpConfirmed(true) }}>
              <label>Your name<input required value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="e.g. Alex Santos" /></label>
              <label>Email address<input required type="email" value={rsvpEmail} onChange={e => setRsvpEmail(e.target.value)} placeholder="you@example.com" /></label>
              <div className="prototype-notice"><Sparkles size={15} /><span>This is a demo RSVP. No real event registration or email will be sent.</span></div>
              <button type="submit" className="primary-button modal-submit">Confirm RSVP <ArrowRight size={17} /></button>
            </form>
          </> : <div className="confirmation">
            <div className="success-icon"><CheckCircle2 size={34} /></div>
            <div className="eyebrow"><span className="eyebrow-dot" /> RSVP CONFIRMED</div>
            <h2>See you <em>there!</em></h2>
            <p>You're on the list, {rsvpName.split(' ')[0] || 'student'}.</p>
            <div className="confirmation-ticket"><span>YOUR EVENT</span><strong>{selectedEvent.title}</strong><p><CalendarDays size={13} /> {selectedEvent.date} · {selectedEvent.time}</p><div><span>ATTENDEE</span><b>{rsvpName}</b></div><div><span>EMAIL</span><b>{rsvpEmail}</b></div><div><span>LOCATION</span><b>{selectedEvent.location}</b></div><div><span>STATUS</span><b className="status-confirmed"><Check size={13} /> RSVP CONFIRMED (DEMO)</b></div></div>
            <button className="primary-button modal-submit" onClick={() => setSelectedEvent(null)}>Back to StudySpot <ArrowRight size={17} /></button>
          </div>}
        </div>
      </div>}
      {selected && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) closeModal() }}>
        <div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
          <button className="modal-close" onClick={closeModal} aria-label="Close reservation"><X size={19} /></button>
          {!confirmed ? <>
            <div className="eyebrow"><span className="eyebrow-dot" /> MAKE IT YOURS</div>
            <h2 id="booking-title">Save your <em>seat.</em></h2>
            <p className="modal-subtitle">A few details and you're all set.</p>
            <div className="booking-summary">
              <img src={selected.image} alt="" />
              <div><strong>{selected.name}</strong><span><MapPin size={12} /> {selected.building} · {selected.floor}</span><small>{selected.seats} seats currently available</small></div>
            </div>
            <form onSubmit={reserve} className="booking-form">
              <label>Your name<input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Alex Santos" /></label>
              <label>Student ID<input required value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="Enter your student ID" /></label>
              <label>Study session duration<select value={duration} onChange={e => setDuration(e.target.value)}><option>1 hour</option><option>2 hours</option><option>3 hours</option><option>4 hours</option></select></label>
              <div className="prototype-notice"><Sparkles size={15} /><span>This is a demo reservation. No real booking will be created.</span></div>
              <button type="submit" className="primary-button modal-submit">Confirm reservation <ArrowRight size={17} /></button>
            </form>
          </> : <div className="confirmation">
            <div className="success-icon"><CheckCircle2 size={34} /></div>
            <div className="eyebrow"><span className="eyebrow-dot" /> YOU'RE ALL SET</div>
            <h2>Seat <em>saved!</em></h2>
            <p>Nice one, {name.split(' ')[0] || 'student'}. Your demo reservation is ready.</p>
            <div className="confirmation-ticket"><span>YOUR STUDY SPOT</span><strong>{selected.name}</strong><p><MapPin size={13} /> {selected.building} · {selected.floor}</p><div><span>STUDENT</span><b>{name}</b></div><div><span>STUDENT ID</span><b>{studentId}</b></div><div><span>SESSION</span><b>{duration}</b></div><div><span>STATUS</span><b className="status-confirmed"><Check size={13} /> CONFIRMED (DEMO)</b></div></div>
            <button className="primary-button modal-submit" onClick={closeModal}>Back to spaces <ArrowRight size={17} /></button>
          </div>}
        </div>
      </div>}
    </div>
  )
}

export default StudySpotFinder