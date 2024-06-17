// src/MeuComponente.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import logoFeatured from '../assets/featured-logo.png';
import hbomax from '../assets/logos/hbomax.png';
import { motion } from 'framer-motion'; // Importando motion do framer-motion

const MovieFeatured = () => {

    return (
        <>
            <div className='featured'>
                <div className='overlay'></div>
                <div className='px-5' style={{ height: "100%" }}>
                    <div className='row' style={{ height: "100%" }}>
                        <div className='col-12 col-sm-9 col-md-5'>
                            <div className='info-featured'>
                                <h6 className='mb-4'>DESTAQUE VISIONCINE</h6>
                                <img src={logoFeatured} className='mb-4' alt='The Gifted'></img>
                                <p className='sinopse mb-4' >Cento e setenta e três anos antes de Game of Thrones, os Sete Reinos estavam no auge da prosperidade e riqueza durante o governo de Viserys I Targaryen, que já reinava por nove anos após suceder seu avô, o velho rei Jaehaerys, o Conciliador. Viserys é pai de Rhaenyra, uma jovem bastante orgulhosa e teimosa, mas com um carisma, beleza e inteligência que a levaram a ter o respeito esperado para uma princesa. Há também o príncipe Daemon Targaryen, o irmão sagaz e violento do rei que tem uma desavença amarga com sir Otto Hightower, o Mão do Rei. Após vários anos, o rei Viserys casa-se novamente e acaba tento outros filhos com Alicent Hightower, filha de Otto, o que logo põe a questão de sucessão em dúvida, já que a tradição sempre favorece o herdeiro masculino. A situação fica ainda mais desfavorável para Rhaenyra quando seus três filhos tem a legitimidade deles questionada pela rainha Alicent, causando um atrito maior entre elas, que uma vez já foram melhores amigas na adolescência..</p>
                                <div className='infos-movie mb-4'>
                                    <img src={hbomax} className='producter'></img><span className='separed'></span><p>2 Temporadas</p><span className='separed'></span><p>2024</p><span className='separed'></span><p><i class="bi bi-badge-hd-fill"></i></p><span className='separed'></span><div className="note-rating n">8.1</div>
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
        </>
    );
};

export default MovieFeatured;