const beerURL = 'https://challenge.codingsans.com/beers.json';

const fetchData = async (url) => {
  const res = await fetch(url);
  data = await res.json();
  return data;
};

//1. Group Brands
const getBrands = async () => {
  const allBeers = await fetchData(beerURL);

  const brandGroup = allBeers.reduce((acc, curr) => {
    let currBrand = acc.find((x) => x.brand === curr.brand);
    if (currBrand) {
      currBrand.beers.push(curr.id);
    } else {
      acc.push({
        brand: curr.brand,
        beers: [curr.id],
      });
    }
    return acc;
  }, []);

  return JSON.stringify(brandGroup);
};

getBrands();

//2. Filter Beers by BeerType
const getBeerType = async (type) => {
  const allBeers = await fetchData(beerURL);
  let beerType = [];

  allBeers.filter((beer) => {
    beer.type === type ? beerType.push(beer.id) : null;
  });

  return JSON.stringify(beerType);
};

getBeerType('Wheat');

//3. Get The Cheapest Brand
const getAverage = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

const getCheapest = async () => {
  const allBeers = await fetchData(beerURL);

  const brandGroup = allBeers.reduce((acc, curr) => {
    let currBrand = acc.find((x) => x.brand === curr.brand);
    const priceToNum = Number(curr.price);

    if (currBrand) {
      currBrand.prices.push(priceToNum);
    } else {
      acc.push({
        brand: curr.brand,
        prices: [priceToNum],
      });
    }

    return acc;
  }, []);

  let avgPrices = [];

  brandGroup.map((x) => {
    return avgPrices.push({
      brand: x.brand,
      prices: x.prices,
      avg: getAverage(x.prices),
    });
  });

  const min = Math.min(...avgPrices.map((beer) => beer.avg));
  const cheapestBeer = avgPrices.find((beer) => beer.avg === min);
  return JSON.stringify(cheapestBeer.brand);
};

getCheapest();

//4. Allergies - Which Beer Lacks a Specific Ingredient

const getIngredient = async (ing) => {
  const allBeers = await fetchData(beerURL);

  let beerIds = [];

  allBeers.map((beer) => {
    const filtered = beer.ingredients.find(
      (x) => x.ratio === '0' && x.name === ing
    );
    filtered ? beerIds.push(beer.id) : '';
  });

  return JSON.stringify(beerIds);
};

getIngredient('corn');

//5. Water Ratio - Remaining ingredient ratio

const getRemaining = async () => {
  const allBeers = await fetchData(beerURL);
  let beers = [];
  let beerIDs = [];

  allBeers.map((beer) => {
    const ingredientsToNum = beer.ingredients.map((ing) => Number(ing.ratio));
    const total = ingredientsToNum.reduce((acc, curr) => acc + curr, 0);
    const waterRatio = 1 - total;
    return beers.push({
      brand: beer.brand,
      id: beer.id,
      water: waterRatio,
    });
  });

  beers
    .sort((a, b) => {
      if (a.water === b.water) {
        return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
      } else {
        return b.water - a.water;
      }
    })
    .map((beer) => beerIDs.push(beer.id));

  return JSON.stringify(beerIDs);
};
getRemaining();

//6. Bonus - Map beers with rounded price

const getRoundedPrice = async () => {
  const allBeers = await fetchData(beerURL);

  const allBeersRounded = allBeers.slice(0);

  allBeersRounded.map((beer) => {
    beer.price = Number(beer.price);
    return Object.assign(beer, { rounded: Math.ceil(beer.price / 100) * 100 });
  });

  const beerIDs = allBeersRounded.reduce(
    (acc, current) => (
      (acc[current.rounded] = allBeersRounded
        .filter((x) => {
          if (current.rounded === x.rounded) {
            return x;
          }
        })
        .map((x) => x.id)),
      acc
    ),
    {}
  );

  return JSON.stringify(beerIDs);
};

getRoundedPrice();
