import React from 'react';
import '../styles/Home.css';
import Caja from '../components/Caja';

const Home = () => (
    <section className="home">
        <Caja titulo='Acerca de las olimpiadas'>
            <p>
                Las Olimpiadas Científicas tienen como objetivo fomentar la curiosidad y el
                pensamiento crítico en jóvenes estudiantes a través de desafíos académicos.
            </p>
        </Caja>

        <Caja titulo='Convocatoria'>
            <p>
                Las Olimpiadas Científicas tienen como objetivo fomentar la curiosidad y el
                pensamiento crítico en jóvenes estudiantes a través de desafíos académicos.
            </p>
        </Caja>

        <Caja titulo='Requisitos'>
            <p>
                Las Olimpiadas Científicas tienen como objetivo fomentar la curiosidad y el
                pensamiento crítico en jóvenes estudiantes a través de desafíos académicos.
            </p>
        </Caja>
        
        <Caja titulo='Áreas'>
            <p>
                Las Olimpiadas Científicas tienen como objetivo fomentar la curiosidad y el
                pensamiento crítico en jóvenes estudiantes a través de desafíos académicos.
            </p>
        </Caja>
    </section>
    
    
);

export default Home;
