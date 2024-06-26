// src/MeuComponente.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion'; // Importando motion do framer-motion

const MoviesSection = () => {
  const [sections, setSections] = useState([]);
  const [scrollPositions, setScrollPositions] = useState([]);
  const carouselRefs = useRef([]);

  const apiKey = '07d652fc4000bcc7676d6aaec88eaffd';
  const omdbApiKey = 'ba1f4581';

  const formatRuntime = (runtime) => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  };

  const fetchData = async (url) => {
    const response = await axios.get(url);
    return response.data.results.filter(item => item.poster_path !== null).map(item => ({
      id: item.id,
      title: item.title || item.name,
      styles: {
        background: `https://image.tmdb.org/t/p/original${item.poster_path}`,
      },
    }));
  };

  const fetchMovieDetails = async (movieID) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieID}`, {
        params: {
          api_key: apiKey,
          language: 'pt-BR'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do filme:', error);
      return null;
    }
  };

  const fetchIMDbRating = async (imdbID) => {
    try {
      const response = await axios.get(`https://www.omdbapi.com/?i=${imdbID}&plot=short&r=json`, {
        params: {
          apikey: omdbApiKey
        }
      });
      return response.data.imdbRating;
    } catch (error) {
      console.error('Erro ao buscar rating do IMDb:', error);
      return null;
    }
  };
  useEffect(() => {
    // Função para buscar os dados
    const fetchSections = async () => {

      const disneyCompanies = [
        2,    // Walt Disney Pictures
        3,    // Pixar
        19551, // Disney Television Animation
        47795, // Disney Channel
        6125, // Lucasfilm
      ];
      
      const disneyCompaniesString = disneyCompanies.join('|');

      const urls = [
        { title: 'Últimos Lançamentos', url: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=878,28&language=pt-BR&sort_by=release_date.desc&include_adult=false&include_video=false&page=1&release_date.lte=${new Date().toISOString().split('T')[0]}` },
        { title: 'Marvel', url: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_companies=420&language=pt-BR` },
        { title: 'DC: Comics', url: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_companies=9993&language=pt-BR` },
        { title: 'Disney', url: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_companies=${disneyCompaniesString}&language=pt-BR` },
      ];
  
      const results = await Promise.all(urls.map(section => fetchData(section.url)));
  
      const newSections = await Promise.all(results.map(async (movies, index) => {
        const moviesWithDetails = await Promise.all(movies.map(async movie => {
          const details = await fetchMovieDetails(movie.id);
          let imdbRating = null;
          if (details && details.imdb_id) {
            imdbRating = await fetchIMDbRating(details.imdb_id);
          }
          return { ...movie, details, imdbRating };
        }));
        return {
          title: urls[index].title,
          movies: moviesWithDetails,
        };
      }));
  
      // Separar a seção Marvel das outras
      const marvelSection = newSections.find(section => section.title === 'Marvel');
      const otherSections = newSections.filter(section => section.title !== 'Marvel');
  
      setSections({ marvel: marvelSection, others: otherSections });
    };
  
    fetchSections();
  }, []);

  useEffect(() => {
    const numSections = (sections.marvel ? 1 : 0) + (sections.others ? sections.others.length : 0);
    carouselRefs.current = Array(numSections).fill(null);

    const initialScrollPositions = Array(numSections).fill(0);
    setScrollPositions(initialScrollPositions);
  }, [sections]);

  const scrollCarousel = (index, direction) => {
    const carousel = carouselRefs.current[index];
    const currentPosition = scrollPositions[index];

    if (carousel) {
      const carouselWidth = carousel.clientWidth; // Movido para dentro do bloco if
      const scrollWidth = carousel.scrollWidth;
      const tamanhoDivMovie = carousel.querySelector('.movie').clientWidth + 13;

      const scrollAmount = direction === 'left' ? -tamanhoDivMovie : tamanhoDivMovie; // Usar tamanhoDivMovie
      let newPosition = currentPosition + scrollAmount;

      // Limitar a posição de rolagem para que não ultrapasse o início ou o final do carrossel
      newPosition = Math.max(0, Math.min(newPosition, scrollWidth - carouselWidth));

      // Atualizar a posição de rolagem
      setScrollPositions(prevPositions => {
        const newPositions = [...prevPositions];
        newPositions[index] = newPosition;
        return newPositions;
      });

      const items = carousel.querySelectorAll('.movie');
      items.forEach(item => {
        item.style.transition = 'transform 0.5s ease'; // Adiciona transição
        item.style.transform = `translateX(-${newPosition}px)`; // Move cada filme individualmente
      });
    }
  };
  // Adicionando função para tratar o touch
  const handleTouchStart = (index, event) => {
    const touchStartX = event.touches[0].clientX;
    const carousel = carouselRefs.current[index];

    carousel.addEventListener('touchmove', handleTouchMove.bind(null, index, touchStartX), { passive: true });
    carousel.addEventListener('touchend', handleTouchEnd.bind(null, index));
  };

  const handleTouchMove = (index, touchStartX, event) => {
    const touchCurrentX = event.touches[0].clientX;
    const deltaX = touchStartX - touchCurrentX;
    const carousel = carouselRefs.current[index];
    const currentPosition = scrollPositions[index];
    const carouselWidth = carousel.clientWidth;
    const scrollWidth = carousel.scrollWidth;

    const scrollAmount = deltaX * 2; // Ajuste a sensibilidade do movimento conforme necessário
    let newPosition = currentPosition + scrollAmount;

    // Limitar a posição de rolagem para que não ultrapasse o início ou o final do carrossel
    newPosition = Math.max(0, Math.min(newPosition, scrollWidth - carouselWidth));

    // Atualizar a posição de rolagem
    setScrollPositions(prevPositions => {
      const newPositions = [...prevPositions];
      newPositions[index] = newPosition;
      return newPositions;
    });

    const items = carousel.querySelectorAll('.movie');
    items.forEach(item => {
      item.style.transition = 'none'; // Remover a transição durante o movimento
      item.style.transform = `translateX(-${newPosition}px)`; // Move cada filme individualmente
    });
  };

  const handleTouchEnd = (index) => {
    const carousel = carouselRefs.current[index];
    carousel.removeEventListener('touchmove', handleTouchMove);
    carousel.removeEventListener('touchend', handleTouchEnd);
  };

  const isEndOfCarousel = (index) => {
    const carousel = carouselRefs.current[index];
    const currentPosition = scrollPositions[index];

    if (!carousel) return false; // Verifica se o carrossel existe

    const carouselWidth = carousel.clientWidth;
    const scrollWidth = carousel.scrollWidth;
    const maxScroll = scrollWidth - carouselWidth;

    // Verifica se o carrossel está no final ou além
    return maxScroll - currentPosition <= 0;
  };

  const isStartOfCarousel = (index) => {
    return scrollPositions[index] === 0;
  };

  return (
    <div className='container-fluid px-5'>
      {/* Renderizar apenas a primeira seção */}
      {sections.others && sections.others.length > 0 && sections.others.slice(0, 1).map((section) => (
        <div key={0} className='caroussel-container mb-5'>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <h6 className='mb-0'>{section.title}</h6>
            <div className='btns'>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={isStartOfCarousel(0)} onClick={() => scrollCarousel(0, 'left')}><i className="bi bi-arrow-left-square"></i></motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={isEndOfCarousel(0)} onClick={() => scrollCarousel(0, 'right')}><i className="bi bi-arrow-right-square"></i></motion.button>
            </div>
          </div>
          <div className='carousel' ref={ref => carouselRefs.current[0] = ref}>
            {section.movies.map(movie => (
              <div key={movie.id} style={{ backgroundImage: `url(${movie.styles.background})` }} className='movie text-white'>
                <div className='info-movie'>
                  {movie?.imdbRating && <div className="note-rating m-2">{movie.imdbRating}</div>}
                  <div className='info p-2'>
                    <div className='lCenter px-1'>
                      <h6 className='mb-0'>{movie.title}</h6>
                      <h6>{movie.details?.production_companies?.[0]?.name || movie.details?.production_companies?.[1]?.name}</h6>
                    </div>
                    <div className='btns px-1'>
                      <button><i className="bi bi-play-fill"></i></button>
                      <button><i className="bi bi-info-square"></i></button>
                      <button><i className="bi bi-bookmark-check"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
  
      {/* Renderizar os posters */}
      <div className='caroussel-container mb-5'>
        <div className='carousel'>
          <div className='movie watch text-white' style={{ background: 'url(https://i.pinimg.com/originals/c9/11/8b/c9118b1feb6daa99605a9f4e2cbfe83c.png)' }}>
            <img src='https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/82785BD663F59D31A62BB254B62D1D0D4DFC9BDE84D6EBC5794E6E4402F7478A/scale?width=600&aspectRatio=1.78&format=webp' alt='WandaVision: Episódio 1' />
            <button><i className="bi bi-play-fill"></i></button>
            <div className='info px-3'>
              <h6 className='fw-bold'>WandaVision: Episódio 1</h6>
              <div className='progress-info'>
                <p>20:23</p>
                <div className='progress-watch'>
                  <div className='bar'></div>
                </div>
                <p>41:10</p>
              </div>
            </div>
          </div>
          <div className='movie watch text-white' style={{ background: 'url(https://i.imgur.com/FbriUYm.jpeg)' }}>
            <img src='https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/AF115C56EE26DD0CF0AFAA1AD1733992BF2D5AE1C35DEFCC4263E31F994F5747/scale?width=600&aspectRatio=1.78&format=webp' alt='Doutor Estranho 2: No multiverso da loucura' />
            <button><i className="bi bi-play-fill"></i></button>
            <div className='info px-3'>
              <h6 className='fw-bold'>Doutor Estranho 2: No multiverso da loucura</h6>
              <div className='progress-info'>
                <p>01:50:23</p>
                <div className='progress-watch'>
                  <div className='bar' style={{ width: '88%' }}></div>
                </div>
                <p>02:10:10</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Renderizar as outras seções */}
      {sections.others && sections.others.length > 1 && sections.others.slice(1).map((section, index) => (
        <div key={index + 1} className='caroussel-container mb-5'>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <h6 className='mb-0'>{section.title}</h6>
            <div className='btns'>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={isStartOfCarousel(index + 1)} onClick={() => scrollCarousel(index + 1, 'left')}><i className="bi bi-arrow-left-square"></i></motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={isEndOfCarousel(index + 1)} onClick={() => scrollCarousel(index + 1, 'right')}><i className="bi bi-arrow-right-square"></i></motion.button>
            </div>
          </div>
          <div className='carousel' ref={ref => carouselRefs.current[index + 1] = ref}>
            {section.movies.map(movie => (
              <div key={movie.id} style={{ backgroundImage: `url(${movie.styles.background})` }} className='movie text-white'>
                <div className='info-movie'>
                  <div className="note-rating m-2">{movie?.imdbRating || '0.0'}</div>
                  <div className='info p-2'>
                    <div className='lCenter px-1'>
                      <h6 className='mb-0'>{movie.title}</h6>
                      <h6>{movie.details?.production_companies?.[0]?.name || movie.details?.production_companies?.[1]?.name}</h6>
                    </div>
                    <div className='btns px-1'>
                      <button><i className="bi bi-play-fill"></i></button>
                      <button><i className="bi bi-info-square"></i></button>
                      <button><i className="bi bi-bookmark-check"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    <div className='posters mb-5'>
    <div className='poster rounded-4' style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/Aur8dDhjDDJBuSDa9Y9GNrvlPI5.jpg)` }}>
      <div className='info'>
        <div>
          <h5>Para perder o sono</h5>
          <p className='line-two'>O melhor do terror. Fantasmas, zumbis, demônios e bruxas... Você tem coragem?</p>
        </div>
        <button className='btn primary rounded'>Confira</button>
      </div>
    </div>
    <div className='poster rounded-4' style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/gWZTAnjLQlk0bg16zP5G5XG70Ys.jpg)` }}>
      <div className='info'>
        <div>
          <h5>Resumindo a família!</h5>
          <p className='line-two'>Filmes e séries para se divertir enquanto aprende valores e lições ao lado da família!</p>
        </div>
        <button className='btn primary rounded'>Confira</button>
      </div>
    </div>
    <div className='poster rounded-4' style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/nB8Z2lDOOSpZgTRLUVYSJ74RPof.jpg)` }}>
      <div className='info'>
        <div>
          <h5>O céu (não) é o limite!</h5>
          <p className='line-two'>Explore o espaço, viaje no tempo e descubra novas tecnologias: nossa seleção especial de SciFi.</p>
        </div>
        <button className='btn primary rounded'>Confira</button>
      </div>
    </div>
  </div>
      {/* Renderizar a seção Marvel */}
      {sections.marvel && (
        <div className='caroussel-container mb-5'>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <h6 className='mb-0'>{sections.marvel.title}</h6>
            <div className='btns'>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={isStartOfCarousel(sections.others.length)} onClick={() => scrollCarousel(sections.others.length, 'left')}><i className="bi bi-arrow-left-square"></i></motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={isEndOfCarousel(sections.others.length)} onClick={() => scrollCarousel(sections.others.length, 'right')}><i className="bi bi-arrow-right-square"></i></motion.button>
            </div>
          </div>
          <div className='carousel' ref={ref => carouselRefs.current[sections.others.length] = ref}>
            {sections.marvel.movies.map(movie => (
              <div key={movie.id} style={{ backgroundImage: `url(${movie.styles.background})` }} className='movie text-white'>
                <div className='info-movie'>
                  {movie?.imdbRating && <div className="note-rating m-2">{movie.imdbRating}</div>}
                  <div className='info p-2'>
                    <div className='lCenter px-1'>
                      <h6 className='mb-0'>{movie.title}</h6>
                      <h6>{movie.details?.production_companies?.[0]?.name || movie.details?.production_companies?.[1]?.name}</h6>
                    </div>
                    <div className='btns px-1'>
                      <button><i className="bi bi-play-fill"></i></button>
                      <button><i className="bi bi-info-square"></i></button>
                      <button><i className="bi bi-bookmark-check"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesSection;