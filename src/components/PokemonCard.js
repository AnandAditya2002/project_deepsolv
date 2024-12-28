import React from 'react';
import './PokemonCard.css';

function PokemonCard({ pokemon, isFavorite, onFavorite, onSelect }) {
  const { name, sprites, types } = pokemon;
  const image = sprites.front_default;

  return (
    <div className="pokemon-card">
      <img src={image} alt={name} onClick={onSelect} className="pokemon-image" />
      <h3 className="pokemon-name" onClick={onSelect}>
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </h3>
      <div className="pokemon-types">
        {types.map((typeInfo) => (
          <span key={typeInfo.type.name} className={`type ${typeInfo.type.name}`}>
            {typeInfo.type.name}
          </span>
        ))}
      </div>
      <button className="favorite-button" onClick={onFavorite}>
        {isFavorite ? '★' : '☆'}
      </button>
    </div>
  );
}

export default PokemonCard; 