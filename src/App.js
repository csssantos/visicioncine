import './assets/App.css';
import MoviesSection from './components/MoviesSection';
import MovieFeatured from './components/Moviefeatured';
import Sectionstreaming from './components/Sectionstreaming';
function App() {
  return (
    <>
      <MovieFeatured />
      <div className='py-5'>
        <MoviesSection />
      </div>
      <Sectionstreaming />
    </>
  );
}

export default App;
