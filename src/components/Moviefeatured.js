// src/MeuComponente.js
import React, { useState, useRef, useEffect } from 'react';
import logoFeatured from '../assets/featured-logo.png';
import hbomax from '../assets/logos/hbomax.png';
import disney from '../assets/logos/disney.png';
import netflix from '../assets/logos/netflix.png';
import century from '../assets/logos/20th.webp';
import featuredImg from '../assets/featured.jpg';

const MovieFeatured = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slidesRef = useRef([]);
    const containerRef = useRef(null);
    const autoSlideInterval = 20000; // Tempo em milissegundos para trocar de slide automaticamente
  
    // Função para ir para o próximo slide
    const nextSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slidesRef.current.length);
    };
  
    // Função para ir para o slide anterior
    const prevSlide = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? slidesRef.current.length - 1 : prevIndex - 1
      );
    };
  
    // Atualiza a posição dos slides
    const updateSlidePosition = () => {
      const slideWidth = containerRef.current?.offsetWidth || 0;
      containerRef.current.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
    };
  
    useEffect(() => {
      updateSlidePosition();
    }, [currentIndex]);
  
    useEffect(() => {
      const handleResize = () => {
        updateSlidePosition();
      };
  
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    // Troca automática de slides
    useEffect(() => {
      const interval = setInterval(nextSlide, autoSlideInterval);
      return () => clearInterval(interval);
    }, []);


    return (
        <div className='featureds-container'>
            <div className='sliderB'>
                <button id='prev' onClick={prevSlide}>
                    <i className="bi bi-caret-left-fill"></i>
                </button>
                <button id='next' onClick={nextSlide}>
                    <i className="bi bi-caret-right-fill"></i>
                </button>
            </div>
            <div className='featureds' ref={containerRef} >
                <div className='featured p-5' ref={(el) => (slidesRef.current[0] = el)} style={{ backgroundImage: `url(${featuredImg})` }}>
                    <div className='overlay'></div>
                    <div className='px-5' style={{ height: "100%" }}>
                        <div className='row' style={{ height: "100%" }}>
                            <div className='col-12 col-md-12 col-xl-5'>
                                <div className='info-featured'>
                                    <h6 className='mb-4'>DESTAQUE VISIONCINE</h6>
                                    <img src={logoFeatured} className='mb-4' alt='The Gifted'></img>
                                    <p className='sinopse mb-4' >Cento e setenta e três anos antes de Game of Thrones, os Sete Reinos estavam no auge da prosperidade e riqueza durante o governo de Viserys I Targaryen, que já reinava por nove anos após suceder seu avô, o velho rei Jaehaerys, o Conciliador. Viserys é pai de Rhaenyra, uma jovem bastante orgulhosa e teimosa, mas com um carisma, beleza e inteligência que a levaram a ter o respeito esperado para uma princesa. Há também o príncipe Daemon Targaryen, o irmão sagaz e violento do rei que tem uma desavença amarga com sir Otto Hightower, o Mão do Rei. Após vários anos, o rei Viserys casa-se novamente e acaba tento outros filhos com Alicent Hightower, filha de Otto, o que logo põe a questão de sucessão em dúvida, já que a tradição sempre favorece o herdeiro masculino. A situação fica ainda mais desfavorável para Rhaenyra quando seus três filhos tem a legitimidade deles questionada pela rainha Alicent, causando um atrito maior entre elas, que uma vez já foram melhores amigas na adolescência..</p>
                                    <div className='infos-movie mb-4'>
                                        <img src={hbomax} className='producter' alt=''></img><span className='separed'></span><p>2 Temporadas</p><span className='separed'></span><p>2024</p><span className='separed'></span><p><i class="bi bi-badge-hd-fill"></i></p><span className='separed'></span><div className="note-rating n">8.1</div>
                                    </div>
                                    <div className='btns px-1'>
                                        <button className='rounded'><i className="bi bi-play-fill"></i> ASSISTIR</button>
                                        <button className='rounded'><i className="bi bi-info-square"></i></button>
                                        <button className='rounded'><i className="bi bi-bookmark-check"></i></button>
                                    </div>
                                </div>
                            </div>

                            <div className='d-xl-block d-none col-md-7 position-relative'>
                                <div class="tvshow">
                                    <div className='episode'>
                                        <div className='backdrop' style={{ background: 'url("https://i.imgur.com/vi37J9A.jpeg")' }}>
                                            <div className='overlay'></div>
                                            <button className='playing'><i className="bi bi-play-fill"></i></button>
                                            <h6>T01 <b>EP01</b></h6>
                                        </div>
                                    </div>
                                    <div className='episode'>
                                        <div className='backdrop' style={{ background: 'url("https://i.imgur.com/JFkEkpO.png")' }}>
                                            <div className='overlay'></div>
                                            <button className='playing'><i className="bi bi-play-fill"></i></button>
                                            <h6>T01 <b>EP02</b></h6>
                                        </div>
                                    </div>
                                    <div className='episode'>
                                        <div className='backdrop' style={{ background: 'url("https://i.imgur.com/Ygnj8D9.png")' }}>
                                            <div className='overlay'></div>
                                            <button className='playing'><i className="bi bi-play-fill"></i></button>
                                            <h6>T01 <b>EP03</b></h6>
                                        </div>
                                    </div>
                                    <div className='episode'>
                                        <div className='backdrop' style={{ background: 'url("https://i.imgur.com/cBSGfJO.png")' }}>
                                            <div className='overlay'></div>
                                            <button className='playing'><i className="bi bi-play-fill"></i></button>
                                            <h6>T01 <b>EP04</b></h6>
                                        </div>
                                    </div>
                                    <div className='episode'>
                                        <div className='backdrop' style={{ background: 'url("https://i.imgur.com/syLoYZ9.png")' }}>
                                            <div className='overlay'></div>
                                            <button className='playing'><i className="bi bi-play-fill"></i></button>
                                            <h6>T01 <b>EP05</b></h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='featured p-5' ref={(el) => (slidesRef.current[1] = el)} style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/wuANo81Kh2lEFlt0P3XwexUjVpP.jpg)` }}>
                    <div className='overlay'></div>
                    <div className='px-5' style={{ height: "100%" }}>
                        <div className='row' style={{ height: "100%" }}>
                            <div className='col-12 col-md-12 col-xl-5'>
                                <div className='info-featured'>
                                    <h6 className='mb-4'>DESTAQUE VISIONCINE</h6>
                                    <img src='https://image.tmdb.org/t/p/original/8GglIA60bm4DfwoTk7jxXdcOYPf.png' className='mb-4' alt='The Gifted'></img>
                                    <p className='sinopse mb-4' >No futuro, várias gerações após o reinado de César, onde os macacos são a espécie dominante que vive harmoniosamente e os humanos foram reduzidos a viver nas sombras. À medida que um novo líder primata tirano constrói o seu império, um jovem macaco inicia uma jornada angustiante que o levará a questionar tudo o que sabe sobre o passado e a fazer escolhas que irão definir o futuro dos macacos e dos humanos.</p>
                                    <div className='infos-movie mb-4'>
                                        <img src={century} className='producter' alt=''></img>
                                        <span className='separed'></span>
                                        <p>2h 25m</p>
                                        <span className='separed'></span>
                                        <p>2024</p>
                                        <span className='separed'></span>
                                        <p><i class="bi bi-badge-hd-fill"></i></p>
                                        <span className='separed'></span>
                                        <div className="note-rating n">8.0</div>
                                    </div>
                                    <div className='btns px-1'>
                                        <button className='rounded'><i className="bi bi-play-fill"></i> ASSISTIR</button>
                                        <button className='rounded'><i className="bi bi-info-square"></i></button>
                                        <button className='rounded'><i className="bi bi-bookmark-check"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='sliderF'>
                {Array(slidesRef.current.length)
                    .fill()
                    .map((_, index) => (
                        <div key={index} className={currentIndex === index ? 'active' : ''}></div>
                    ))}
            </div>
        </div>
    );
};

export default MovieFeatured;