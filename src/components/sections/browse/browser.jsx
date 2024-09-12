import React from 'react';

import './browser.css';

// import Categories from './components/categories/categoriesSection';
import Header from './components/header/browseHeader';

const options = [
  { name: 'Genres & Moods' },
  { name: 'Charts' },
  { name: 'New Releases' },
  { name: 'Featured' }
];

const Browse = ({ active = 'Genres & Moods', setActive }) => (
  <div>
    <Header options={options} onClick={setActive} active={active} />
    <h3 className="browse-title">{active ? active : 'Genres & Moods'}</h3>
  </div>
);

export default Browse;
{/* <Categories active={active} setActive={setActive} /> */} 

