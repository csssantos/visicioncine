import './assets/App.css';
import MoviesSection from './components/MoviesSection';
import MovieFeatured from './components/Moviefeatured';
import Sectionstreaming from './components/Sectionstreaming';
function App() {
  return (
    <>
      <div className='py-5'>
      <MovieFeatured />
        <MoviesSection />
      </div>
      <Sectionstreaming />
    </>
  );
}

export default App;
