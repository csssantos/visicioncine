import './assets/App.css';
import MoviesSection from './components/MoviesSection';
import MovieFeatured from './components/Moviefeatured';

function App() {
  return (
    <>
      <MovieFeatured />
      <div className='py-5'>
        <MoviesSection />
      </div>
    </>
  );
}

export default App;
