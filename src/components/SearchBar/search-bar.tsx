import './search-bar-styles.scss';

import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { searchParams } from '../../App';

import Checkbox from '../Checkbox/checkbox';
import { X } from 'lucide-react';

function SearchBar({ paramsChanged }: { paramsChanged: (params: searchParams) => void }) {
  const [cookies, setCookie] = useCookies(['searchParams'])

  const [params, setParams] = useState<searchParams>({ query: "", searchIngredients: false, showAlternatives: false });
  
  // Load params from cookie
  useEffect(() => {
    const cookieValue = cookies.searchParams;
    if (cookieValue) {
      setParams(cookieValue);
    } else {
      setParams({ query: "", searchIngredients: false, showAlternatives: false });
    }
  }, []);

  // Save params to cookies
  useEffect(() => {
    const timeout = setTimeout(() => {
      paramsChanged(params);
    }, 400);

    if(params) {
      setCookie('searchParams', JSON.stringify({ ...params, query: ""}), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });
    }

    return () => clearTimeout(timeout);
  }, [params]);

  useEffect(() => {
    
  }, [params]);


  return (
    <div className='search-bar-container'>
      <div className='search-box-container' >
        <input type='text' placeholder='Search...' value={params.query} onChange={(e) => {setParams({ ...params, query: e.target.value })}}/>
        <div className='clear-search-icon' onClick={() => setParams({ ...params, query: "" })}><X /></div>
      </div>
      
      <div className='checkbox-container'>
        <span>Search Ingredients</span>
        <Checkbox value={params.searchIngredients} valueChanged={(value) => setParams({ ...params, searchIngredients: value })}/>
      </div>
      <div className='checkbox-container'>
        <span>Show Alternatives</span>
        <Checkbox value={params.showAlternatives} valueChanged={(value) => setParams({ ...params, showAlternatives: value })}/>
      </div>
    </div>
  )
}

export default SearchBar