import { useState, useEffect, useRef } from 'react'
import './index.css'

const InstagramLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" style={{ verticalAlign: 'middle' }}>
    <defs>
      <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#fed373' }} />
        <stop offset="25%" style={{ stopColor: '#f15245' }} />
        <stop offset="50%" style={{ stopColor: '#d92e7f' }} />
        <stop offset="75%" style={{ stopColor: '#9b36b7' }} />
        <stop offset="100%" style={{ stopColor: '#515ecf' }} />
      </linearGradient>
    </defs>
    <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

// Importing images
import crossImg from './art-work/Cross.jpg'
import dogHouseImg from './art-work/Dog House.jpg'
import forestRoadImg from './art-work/Forest Road.jpg'
import lifeDeathImg from './art-work/Life and Death.jpg'
import mountainsImg from './art-work/Mountains.jpg'
import horsesImg from './art-work/Mystical horses.jpg'
import sunsetImg from './art-work/Sunset Overhill.jpg'
import luckImg from './art-work/Test Your Luck.jpg'
import churchImg from './art-work/The Church.jpg'
import wolfImg from './art-work/wolf.jpg'
import yingYangImg from './art-work/Ying Yang.jpg'

interface ArtPiece {
  id: number;
  title: string;
  category: 'Painting' | 'Hand Drawn' | 'Mixed Media';
  series: string;
  image: string;
  description: string;
}

const INITIAL_ART: ArtPiece[] = [
  { id: 1, title: "Life and Death", category: "Mixed Media", series: "Series 2026", image: lifeDeathImg, description: "A profound exploration of the cycle of existence." },
  { id: 2, title: "The Church", category: "Painting", series: "Series 2026", image: churchImg, description: "Capturing the architectural soul and stillness of sacred spaces." },
  { id: 3, title: "Mystical Horses", category: "Painting", series: "Series 2026", image: horsesImg, description: "Ethereal equine forms captured in a moment of fluid motion." },
  { id: 4, title: "Sunset Overhill", category: "Painting", series: "Series 2026", image: sunsetImg, description: "The warm, final glow of the day as it settles over the horizon." },
  { id: 5, title: "Ying Yang", category: "Mixed Media", series: "Series 2026", image: yingYangImg, description: "The eternal balance of light and dark, form and void." },
  { id: 6, title: "Wolf", category: "Hand Drawn", series: "Series 2026", image: wolfImg, description: "A detailed study of the primal and noble spirit of the wolf." },
  { id: 7, title: "Forest Road", category: "Painting", series: "Series 2026", image: forestRoadImg, description: "A journey through the quiet, sun-dappled paths of the deep woods." },
  { id: 8, title: "Mountains", category: "Painting", series: "Series 2026", image: mountainsImg, description: "The majestic and immovable presence of high peaks." },
  { id: 9, title: "Test Your Luck", category: "Mixed Media", series: "Series 2026", image: luckImg, description: "An interactive and textural piece exploring chance and destiny." },
  { id: 10, title: "Cross", category: "Mixed Media", series: "Series 2026", image: crossImg, description: "A symbolic textural piece blending traditional iconography with modern media." },
  { id: 11, title: "Dog House", category: "Mixed Media", series: "Series 2026", image: dogHouseImg, description: "A whimsical yet structured piece exploring themes of home." },
];

function App() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isFullView, setIsFullView] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  
  const selectedPiece = selectedIndex !== null ? INITIAL_ART[selectedIndex] : null;

  const resetView = () => {
    setIsFullView(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const nextPiece = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % INITIAL_ART.length);
      resetView();
    }
  };

  const prevPiece = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + INITIAL_ART.length) % INITIAL_ART.length);
      resetView();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isFullView) return;
    e.preventDefault();
    const zoomSpeed = 0.0015;
    const delta = -e.deltaY * zoomSpeed;
    const newScale = Math.min(Math.max(scale + delta, 1), 10);
    setScale(newScale);
    if (newScale <= 1.001) { setScale(1); setPosition({ x: 0, y: 0 }); }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isFullView || scale <= 1) return;
    setIsDragging(true);
    hasMovedRef.current = false;
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    hasMovedRef.current = true;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasMovedRef.current) { hasMovedRef.current = false; return; }
    if (scale > 1) { setScale(1); setPosition({ x: 0, y: 0 }); }
    else setIsFullView(!isFullView);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight' && !isFullView) nextPiece();
      if (e.key === 'ArrowLeft' && !isFullView) prevPiece();
      if (e.key === 'Escape') {
        if (scale > 1) { setScale(1); setPosition({ x: 0, y: 0 }); }
        else if (isFullView) setIsFullView(false);
        else setSelectedIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, isFullView, scale]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '8rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 200, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Katie's Mixed-Media Gallery
        </h1>
        <div style={{ width: '60px', height: '1px', background: 'var(--text-color)', margin: '0 auto 2.5rem', opacity: 0.3 }} />
        <section style={{ maxWidth: '750px', margin: '0 auto', lineHeight: '1.9', color: '#999', fontSize: '1.1rem', fontWeight: 300 }}>
          <p>Welcome to my creative space. I specialize in mixed-media art, blending textures, colors, and materials to tell stories that transcend traditional boundaries. From paintings to hand drawn pieces, each work is an experiment in emotion and form.</p>
          <a href="https://www.instagram.com/katiesartgallery01/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', marginTop: '2rem', color: 'var(--accent-color)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', transition: 'all 0.3s ease' }}>
            <InstagramLogo /> Connect on Instagram
          </a>
        </section>
      </header>
      
      <main style={{ padding: '2rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10rem 5rem' }}>
          {INITIAL_ART.map((piece, index) => (
            <div key={piece.id} className="art-card" onClick={() => setSelectedIndex(index)} style={{ aspectRatio: '4/5', cursor: 'pointer' }}>
               <div className="gallery-lamp" />
               <div className="spotlight-beam" />
               <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
                 <img src={piece.image} alt={piece.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9, transition: 'transform 0.6s cubic-bezier(0.2, 1, 0.3, 1)' }} className="art-image" />
                 <div className="art-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', opacity: 0, transition: 'opacity 0.4s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
                   <span style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>{piece.category}</span>
                   <h3 style={{ fontSize: '1.2rem', fontWeight: 300, letterSpacing: '0.1em', marginBottom: '1.5rem' }}>{piece.title}</h3>
                   <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', border: '1px solid white', padding: '0.8rem 1.5rem' }}>View Piece</div>
                 </div>
               </div>
               <div style={{ position: 'absolute', bottom: '25px', left: '25px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 6 }}>
                 <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#ccc' }}>{piece.title}</span>
                 <span style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666' }}>{piece.category}</span>
               </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal - Unchanged */}
      {selectedPiece && (
        <div onClick={() => { setSelectedIndex(null); resetView(); }} style={{ position: 'fixed', inset: 0, background: 'rgba(5, 5, 5, 0.98)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isFullView ? '0' : '4rem', backdropFilter: 'blur(15px)', cursor: 'zoom-out' }}>
          {!isFullView && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prevPiece(); }} style={{ position: 'absolute', left: '8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'white', fontSize: '3rem', cursor: 'pointer', opacity: 0.5, transition: 'opacity 0.3s', zIndex: 20 }}>‹</button>
              <button onClick={(e) => { e.stopPropagation(); nextPiece(); }} style={{ position: 'absolute', right: '8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'white', fontSize: '3rem', cursor: 'pointer', opacity: 0.5, transition: 'opacity 0.3s', zIndex: 20 }}>›</button>
            </>
          )}
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: isFullView ? '100vw' : '1400px', width: '100%', maxHeight: isFullView ? '100vh' : '90vh', height: isFullView ? '100vh' : 'auto', display: 'grid', gridTemplateColumns: isFullView ? '1fr' : '1fr 400px', gap: isFullView ? '0' : '5rem', cursor: 'default', background: isFullView ? '#000' : '#0a0a0a', border: isFullView ? 'none' : '1px solid #1a1a1a', padding: isFullView ? '0' : '3rem', position: 'relative', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <div onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onClick={handleImageClick} style={{ height: isFullView ? '100vh' : '70vh', width: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : (isFullView ? 'zoom-in' : 'zoom-in'), position: 'relative' }}>
              <img src={selectedPiece.image} alt={selectedPiece.title} draggable={false} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`, transition: isDragging ? 'none' : 'transform 0.2s ease-out' }} />
              {isFullView && (
                <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', background: 'rgba(0,0,0,0.6)', padding: '0.6rem 1rem', fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', pointerEvents: 'none', border: '1px solid #222' }}>
                  {scale > 1 ? 'Drag to Pan // Scroll to Zoom' : 'Scroll to Zoom // Click to Exit'}
                </div>
              )}
            </div>
            {!isFullView && (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: '1rem' }}>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#555', marginBottom: '1.5rem' }}>{selectedPiece.category} // {selectedPiece.series}</span>
                <h2 style={{ fontSize: '3rem', fontWeight: 200, letterSpacing: '0.1em', marginBottom: '2rem' }}>{selectedPiece.title}</h2>
                <p style={{ color: '#aaa', lineHeight: '2', marginBottom: '3rem', fontSize: '1.1rem', fontWeight: 300 }}>{selectedPiece.description}</p>
                <button onClick={() => { setSelectedIndex(null); resetView(); }} style={{ background: 'none', border: '1px solid #333', color: 'white', padding: '1.2rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.8rem', transition: 'all 0.3s' }}>Return to Gallery</button>
              </div>
            )}
          </div>
        </div>
      )}
      <footer style={{ marginTop: '10rem', paddingBottom: '4rem', textAlign: 'center', color: '#333', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
        © {new Date().getFullYear()} KATIE ROJAS — MIXED-MEDIA GALLERY
      </footer>
    </div>
  )
}

export default App
