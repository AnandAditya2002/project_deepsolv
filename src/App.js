import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import PokemonCard from './components/PokemonCard';
import SearchBar from './components/SearchBar';
import TypeFilter from './components/TypeFilter';
import Pagination from './components/Pagination';
import PokemonDetailModal from './components/PokemonDetailModal';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [types, setTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPokemons, setTotalPokemons] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const limit = 20;

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    fetchTypes();
  }, []);

  useEffect(() => {
    fetchPokemon();
    // eslint-disable-next-line
  }, [currentPage, selectedTypes, searchQuery]);

  const fetchTypes = async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/type');
      setTypes(response.data.results);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch types.');
    }
  };

  const fetchPokemon = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${(currentPage - 1) * limit}`;

      if (searchQuery) {
        url = `https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}`;
        const response = await axios.get(url);
        setPokemonList([response.data]);
        setTotalPokemons(1);
      } else if (selectedTypes.length > 0) {
        const promises = selectedTypes.map((type) =>
          axios.get(`https://pokeapi.co/api/v2/type/${type}`)
        );
        const results = await Promise.all(promises);
        const pokemons = results.flatMap((res) => res.data.pokemon.map((p) => p.pokemon));
        // Remove duplicates
        const uniquePokemons = Array.from(new Set(pokemons.map((p) => p.name))).map((name) =>
          pokemons.find((p) => p.name === name)
        );
        setTotalPokemons(uniquePokemons.length);
        const paginated = uniquePokemons.slice((currentPage - 1) * limit, currentPage * limit);
        const detailedPromises = paginated.map((p) => axios.get(p.url));
        const detailedResults = await Promise.all(detailedPromises);
        setPokemonList(detailedResults.map((res) => res.data));
      } else {
        const response = await axios.get(url);
        setTotalPokemons(response.data.count);
        const detailedPromises = response.data.results.map((p) => axios.get(p.url));
        const detailedResults = await Promise.all(detailedPromises);
        setPokemonList(detailedResults.map((res) => res.data));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch Pokémon.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedTypes([]);
    setCurrentPage(1);
  };

  const handleTypeFilter = (types) => {
    setSelectedTypes(types);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleFavorite = (pokemon) => {
    let updatedFavorites;
    if (favorites.includes(pokemon.name)) {
      updatedFavorites = favorites.filter((name) => name !== pokemon.name);
    } else {
      updatedFavorites = [...favorites, pokemon.name];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const openModal = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const closeModal = () => {
    setSelectedPokemon(null);
  };

  const totalPages = Math.ceil(totalPokemons / limit);

  return (
    <div className="App">
      <h1>Pokedex Lite</h1>
      <div className="controls">
        <SearchBar onSearch={handleSearch} />
        <TypeFilter types={types} selectedTypes={selectedTypes} onFilter={handleTypeFilter} />
      </div>
      {loading ? (
        <div className="loader">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : pokemonList.length > 0 ? (
        <div className="pokemon-grid">
          {pokemonList.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              isFavorite={favorites.includes(pokemon.name)}
              onFavorite={() => handleFavorite(pokemon)}
              onSelect={() => openModal(pokemon)}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">No Pokémon found.</div>
      )}
      {!searchQuery && !selectedTypes.includes && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
      {selectedPokemon && (
        <PokemonDetailModal pokemon={selectedPokemon} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
