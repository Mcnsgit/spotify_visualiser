import React, {useState } from 'react';
import './browser.css';
import Header from './components/header/browseHeader';
import Categories from './components/categories/categoriesSection';

const options = [
  { name: 'Genres & Moods' },
  { name: 'Charts' },
  { name: 'New Releases' },
  { name: 'Featured' }
];

const Browse = () => {
  const [active, setActive] = useState('Genres & Moods');
  return (
    <div>
      <Header
        options={options}
        onClick={setActive}
        active={active}
      />
      <h3 className="browse-title">
        {active ? active : 'Genres & Moods'}
      </h3>
      <Categories active={active} setActive={setActive} />
    </div>
  );
};

export default Browse;
