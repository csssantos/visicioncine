import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';


const Sectionstreaming = () => {
    const [sections, setSections] = useState([]);
    const [scrollPositions, setScrollPositions] = useState([]);
    const carouselRefs = useRef([]);

    const apiKey = '07d652fc4000bcc7676d6aaec88eaffd';
    const omdbApiKey = 'ba1f4581';

    // const formatRuntime = (runtime) => {
    //     const hours = Math.floor(runtime / 60);
    //     const minutes = runtime % 60;
    //     return `${hours}h ${minutes}m`;
    // };

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
                { title: 'hbomax', url: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=878,28&language=pt-BR&sort_by=release_date.desc&include_adult=false&include_video=false&page=1&release_date.lte=${new Date().toISOString().split('T')[0]}` },
                { title: 'netflix', url: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_companies=420&language=pt-BR` },
                { title: 'disneyplus', url: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_companies=${disneyCompaniesString}&language=pt-BR` },
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
                    logo: `${urls[index].title.toLowerCase().replace(/[\s:]/g, '')}.png`,
                    banner: `${urls[index].title.toLowerCase().replace(/[\s:]/g, '')}-banner.jpg`, // Corrigido para formatar o título para o nome do arquivo
                    movies: moviesWithDetails,
                };
            }));

            setSections(newSections);
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
        <>
            {sections.map((section, index) => (
                <div key={index} className='section-streaming'>
                    <div className='bg' style={{ backgroundImage: 'url(https://raw.githubusercontent.com/csssantos/visicioncine/main/src/assets/logos/max/'+section.banner+')' }}>
                        <div className='container-fluid p-5 d-flex flex-column justify-content-between'>
                            <p className='title'>NO<br />VISIONCINE<br />VOCÊ ENCONTRA TUDO</p>
                            <img src={`https://raw.githubusercontent.com/csssantos/visicioncine/main/src/assets/logos/max/${section.logo}`} alt='' /> {/* Ajuste o que deve ser exibido aqui */}
                            <div className='btns'>
                                <button className='btn primary'>VER MAIS</button>
                            </div>
                        </div>
                    </div>
                    <div className='container-fluid px-5'>
                        <div className='caroussel-container mb-5'>
                            <div className='d-flex justify-content-between align-items-center mb-2'>
                                <h6 className='mb-0'></h6> {/* Coloque o título da seção aqui */}
                                <div className='btns'>
                                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={isStartOfCarousel(index)} onClick={() => scrollCarousel(index, 'left')}>
                                        <i className="bi bi-arrow-left-square"></i>
                                    </motion.button>
                                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={isEndOfCarousel(index)} onClick={() => scrollCarousel(index, 'right')}>
                                        <i className="bi bi-arrow-right-square"></i>
                                    </motion.button>
                                </div>
                            </div>
                            <div className='carousel' ref={ref => carouselRefs.current[index] = ref}>
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
                    </div>
                </div>
            ))}
        </>

    );
}
export default Sectionstreaming;