import React from 'react'
import "../css/Inicio.css";
import cardImage1 from "../assets/img/1.jpg";
import cardImage2 from "../assets/img/2.jpg";
import cardImage3 from "../assets/img/3.jpg";

export default function Inicio() {
  return (
    <div className='Margen'>
      
    
<body className='con'>

    <div className="card" style={{ backgroundImage: `url(${cardImage1})` }}>
        <div class="content2">
            <h2>Información</h2>
            <a href="#">Ver Detalles</a>
        </div>
    </div>

    <div className="card" style={{ backgroundImage: `url(${cardImage2})` }} >
        <div className="content2">
            <h2>Logros</h2>
            <a href="#">Ver Detalles</a>
        </div>
    </div>

    <div className="card" style={{ backgroundImage: `url(${cardImage3})` }}>
        <div className="content2">
            <h2>Contacto</h2>
            <a href="#">Ver Detalles</a>
        </div>
    </div>
    
</body>
      
      </div>
  )
}
