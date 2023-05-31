import React from 'react'
import "../css/Inicio.css";
import cardImage1 from "../assets/img/1.jpg";
import cardImage2 from "../assets/img/2.jpg";
import cardImage3 from "../assets/img/3.jpg";

export default function Inicio() {
  return (
    <div className='Margen'>
      
    
      <body className="fondo-negro con">

    <div className="card" style={{ backgroundImage: `url(${cardImage1})` }}>
        <div class="content2">
            <h2>Diciplina</h2>
           
        </div>
    </div>

    <div className="card" style={{ backgroundImage: `url(${cardImage2})` }} >
        <div className="content2">
            <h2>Pasión</h2>
          
        </div>
    </div>

    <div className="card" style={{ backgroundImage: `url(${cardImage3})` }}>
        <div className="content2">
            <h2>Persistencia</h2>
            
        </div>
    </div>
    
</body>
      
      </div>
  )
}
