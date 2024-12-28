import React from 'react';
import Modal from 'react-modal';
import './PokemonDetailModal.css';

function PokemonDetailModal({ pokemon, onClose }) {
  const { name, sprites, types, abilities, stats } = pokemon;

  return (
    <Modal
      isOpen={!!pokemon}
      onRequestClose={onClose}
      contentLabel="Pokémon Details"
      className="modal"
      overlayClassName="overlay"
    >
      <button onClick={onClose} className="close-button">
        &times;
      </button>
      <div className="modal-content">
        <h2>{name.charAt(0).toUpperCase() + name.slice(1)}</h2>
        <img src={sprites.other['official-artwork'].front_default} alt={name} className="detail-image" />
        <div className="detail-section">
          <h3>Types</h3>
          <div className="types">
            {types.map((typeInfo) => (
              <span key={typeInfo.type.name} className={`type ${typeInfo.type.name}`}>
                {typeInfo.type.name}
              </span>
            ))}
          </div>
        </div>
        <div className="detail-section">
          <h3>Abilities</h3>
          <ul>
            {abilities.map((abilityInfo) => (
              <li key={abilityInfo.ability.name}>
                {abilityInfo.ability.name.charAt(0).toUpperCase() + abilityInfo.ability.name.slice(1)}
              </li>
            ))}
          </ul>
        </div>
        <div className="detail-section">
          <h3>Stats</h3>
          <ul>
            {stats.map((statInfo) => (
              <li key={statInfo.stat.name}>
                {statInfo.stat.name.toUpperCase()}: {statInfo.base_stat}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
}

export default PokemonDetailModal; 