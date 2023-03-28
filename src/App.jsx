import { useEffect, useState } from 'react'
import './App.css'

const defaultParameters = {
  date: "2023-03-28",
  currency: "USD",
  exchangeRates: "forex"
}

function App() {
  const [menuParameters, setMenuParameters] = useState(defaultParameters);
  const [rates, setRates] = useState([]);
  const [searchValue,setSearchValue] = useState("");
  const [searchResponse, setSearchResponse] = useState();
  const [ratesList, setRatesList] = useState([]);

  const createRatesList = (rates) => {
    const itemsList = [];
    let id = 1;

    Object.entries(rates).forEach(([key, value]) => {
      itemsList.push(
        <div key={id++} className="flex flex-none flex-row flex-wrap mx-6 my-2 py-4 px-6 rounded-2xl my-1 justify-between bg-white">
          <div className='exchange_rate_name w-fit mr-5 font-sans text-blue-900'>
            {key}
          </div>

          <div className='exchange_rate_value w-fit font-mono text-blue-600'>
            {value}/{menuParameters.currency}
          </div>
        </div>)
    });
    setRatesList(itemsList);
  }

  const fetchRates = async (date, currency) => {
    // Construct URL
    const url = `https://api.exchangerate.host/${date}?base=${currency}&places=2`;
    // Makes the API call
    const response = await fetch(url);
    const json = await response.json();

    const rates = json.rates;
    createRatesList(rates);
    setRates(rates);
  }

  const handleSearch = () => {
  
  if(searchValue != "") {
   const index = Object.keys(rates).indexOf(searchValue);

   if(index<0)
   {
    setSearchResponse(`Couldn't find: ${searchValue}`);
   }
   else
   {
    // setSearchResponse(`${searchValue}: ${Object.values(rates)[index]}`)
    setSearchResponse(ratesList[index])
   }
    }
  }

  const handleClear = () => 
  {
   setSearchValue("");
   setSearchResponse("");
  }

  const handleCurrencyChange = (event) => {
    setMenuParameters(
      {
        date: menuParameters.date,
        currency: event.target.value,
        exchangeRates: menuParameters.exchangeRates
      }
    );
  }

  useEffect(() => {
    fetchRates(menuParameters.date, menuParameters.currency)
  })

  const currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'CAD', label: 'CAD' }]
    
  return (
    <div className="App">
      <div id='menu' className='font-sans font-semibold justify-self-center justify-around bg-gray-200 rounded-3xl p-4'>
        <div className=''> Exchange Rates Date: {menuParameters.date} </div>

          <div id='currency_select'>
            <label className='p-2'>
              <div>Currency</div>
              <select value={menuParameters.currency} onChange={handleCurrencyChange}>
                {currencyOptions.map((option, index) => (
                  <option key={index} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>
          
          <div id="search_currency"> 
          <div>
            <input placeholder="Search Currency" type="text" value={searchValue} onChange={(event)=>{setSearchValue(event.target.value)}} className=' font-sans mx-1 p-2 rounded-2xl'/>
            <button onClick={handleSearch} className=" rounded-2xl font-sans mx-1 font-normal text-gray-900 bg-white hover:bg-blue-100"> Search </button>
            <button onClick={handleClear} className=" rounded-2xl font-sans mx-1  font-normal text-gray-900 bg-white hover:bg-blue-100"> Clear </button>
          </div>
                  <div id='Search Respones'>{searchResponse} </div>
          </div>


      </div>

      <div className='font-serif font-medium'> Currency Exchange Rates</div>
      <div> 
        <div> # currencies:{}</div>
      </div>
      <div id='rates_list' className='rounded-2xl'>
        {ratesList}
      </div>
    </div>
  )
}

export default App
