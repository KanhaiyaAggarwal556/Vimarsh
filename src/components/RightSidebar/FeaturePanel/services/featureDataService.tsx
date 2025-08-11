import { Feature } from '../constants/featuresData';

// Define interfaces for API responses
interface JokeResponse {
  id: number;
  setup: string;
  punchline: string;
}

interface QuoteResponse {
  id: number;
  quote: string;
  author: string;
}

interface FunFactResponse {
  text: string;
}

interface MealResponse {
  meals: Array<{
    idMeal: string;
    strMeal: string;
    strArea: string;
    strCategory: string;
    strInstructions: string;
    strMealThumb: string;
  }>;
}

interface BookWork {
  key: string;
  title: string;
  authors?: Array<{ name: string }>;
  first_publish_year?: number;
  cover_id?: number;
}

interface BookResponse {
  works: BookWork[];
}

interface Movie {
  title: string;
  releaseDate: string;
  imdbRating?: number;
  plot?: string;
  posterURL?: string;
}

interface Product {
  title: string;
  category: string;
  rating: number;
  thumbnail: string;
}

interface ProductResponse {
  products: Product[];
}

interface SearchResults {
  feature: string;
  title: string;
  content: string;
  shareUrl: string;
  redirectUrl?: string;
  imageUrl?: string;
}

interface Destination {
  name: string;
  emoji: string;
  famous: string;
  cuisine: string;
}

interface MusicGenre {
  genre: string;
  artist: string;
  album: string;
  year: string;
}

export const fetchFeatureData = async (feature: Feature): Promise<SearchResults> => {
  try {
    let response: Response;
    let data: any;
    
    switch (feature.id) {
      case 'joke':
        response = await fetch('https://official-joke-api.appspot.com/random_joke');
        data = await response.json() as JokeResponse;
        return {
          feature: feature.name,
          title: 'Random Joke',
          content: `${data.setup}\n\n${data.punchline} 😄`,
          shareUrl: `https://official-joke-api.appspot.com/jokes/${data.id}`,
          redirectUrl: 'https://official-joke-api.appspot.com/'
        };

      case 'quote':
        response = await fetch('https://dummyjson.com/quotes/random');
        data = await response.json() as QuoteResponse;
        return {
          feature: feature.name,
          title: 'Daily Inspiration',
          content: `"${data.quote}"\n\n— ${data.author} ✨`,
          shareUrl: `https://dummyjson.com/quotes/${data.id}`,
          redirectUrl: `https://dummyjson.com/quotes`
        };

      case 'funfact':
        response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
        data = await response.json() as FunFactResponse;
        return {
          feature: feature.name,
          title: 'Did You Know?',
          content: `🧠 ${data.text}\n\nShare this interesting fact with your friends!`,
          shareUrl: `https://uselessfacts.jsph.pl/`,
          redirectUrl: 'https://uselessfacts.jsph.pl/'
        };

      case 'dish':
        response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        data = await response.json() as MealResponse;
        const meal = data.meals[0];
        return {
          feature: feature.name,
          title: meal.strMeal,
          content: `🍽️ ${meal.strMeal}\n\n📍 Origin: ${meal.strArea}\n🥘 Category: ${meal.strCategory}\n\n${meal.strInstructions.substring(0, 150)}...`,
          shareUrl: `https://www.themealdb.com/meal/${meal.idMeal}`,
          redirectUrl: `https://www.themealdb.com/meal/${meal.idMeal}`,
          imageUrl: meal.strMealThumb
        };

      case 'travel':
        response = await fetch('https://jsonplaceholder.typicode.com/users');
        data = await response.json();
        
        const destinations: Destination[] = [
          { name: 'Paris, France', emoji: '🇫🇷', famous: 'Eiffel Tower', cuisine: 'French cuisine' },
          { name: 'Tokyo, Japan', emoji: '🇯🇵', famous: 'Mount Fuji', cuisine: 'Sushi and Ramen' },
          { name: 'New York, USA', emoji: '🇺🇸', famous: 'Statue of Liberty', cuisine: 'Pizza and Bagels' },
          { name: 'London, UK', emoji: '🇬🇧', famous: 'Big Ben', cuisine: 'Fish and Chips' },
          { name: 'Rome, Italy', emoji: '🇮🇹', famous: 'Colosseum', cuisine: 'Pasta and Pizza' },
          { name: 'Sydney, Australia', emoji: '🇦🇺', famous: 'Opera House', cuisine: 'Seafood' },
          { name: 'Mumbai, India', emoji: '🇮🇳', famous: 'Gateway of India', cuisine: 'Spicy Curries' },
          { name: 'Cairo, Egypt', emoji: '🇪🇬', famous: 'Pyramids of Giza', cuisine: 'Falafel and Kebabs' }
        ];
        
        const randomDestination = destinations[Math.floor(Math.random() * destinations.length)];
        
        return {
          feature: feature.name,
          title: `Visit ${randomDestination.name}`,
          content: `${randomDestination.emoji} ${randomDestination.name}\n\n🏛️ Famous for: ${randomDestination.famous}\n🍽️ Must try: ${randomDestination.cuisine}\n\n✈️ Perfect destination for your next adventure!\n\nTip: Book flights 6-8 weeks in advance for best prices!`,
          shareUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(randomDestination.name.split(',')[0])}`,
          redirectUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(randomDestination.name.split(',')[0])}`,
          imageUrl: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`
        };

      case 'book':
        response = await fetch('https://openlibrary.org/subjects/fiction.json?limit=50');
        data = await response.json() as BookResponse;
        const randomBook = data.works[Math.floor(Math.random() * data.works.length)];
        return {
          feature: feature.name,
          title: randomBook.title,
          content: `📚 "${randomBook.title}"\n👤 by ${randomBook.authors ? randomBook.authors.map((author: { name: string }) => author.name).join(', ') : 'Unknown Author'}\n\n📖 First published: ${randomBook.first_publish_year || 'N/A'}\n\nA great addition to your reading list!`,
          shareUrl: `https://openlibrary.org${randomBook.key}`,
          redirectUrl: `https://openlibrary.org${randomBook.key}`,
          imageUrl: randomBook.cover_id ? `https://covers.openlibrary.org/b/id/${randomBook.cover_id}-M.jpg` : undefined
        };

      case 'movie':
        response = await fetch('https://api.sampleapis.com/movies/animation');
        data = await response.json() as Movie[];
        const randomMovie = data[Math.floor(Math.random() * data.length)];
        return {
          feature: feature.name,
          title: randomMovie.title,
          content: `🎬 "${randomMovie.title}"\n📅 Released: ${randomMovie.releaseDate}\n⭐ Rating: ${randomMovie.imdbRating || 'N/A'}\n\n${randomMovie.plot ? randomMovie.plot.substring(0, 150) + '...' : 'A great movie recommendation for you!'}`,
          shareUrl: `https://www.imdb.com/find?q=${encodeURIComponent(randomMovie.title)}`,
          redirectUrl: `https://www.imdb.com/find?q=${encodeURIComponent(randomMovie.title)}`,
          imageUrl: randomMovie.posterURL
        };

      case 'music':
        response = await fetch('https://dummyjson.com/products?limit=100');
        data = await response.json() as ProductResponse;
        const randomProduct = data.products[Math.floor(Math.random() * data.products.length)];
        
        const musicGenres: MusicGenre[] = [
          { genre: 'Pop', artist: 'Taylor Swift', album: 'Folklore', year: '2020' },
          { genre: 'Rock', artist: 'Queen', album: 'A Night at the Opera', year: '1975' },
          { genre: 'Hip-Hop', artist: 'Kendrick Lamar', album: 'DAMN.', year: '2017' },
          { genre: 'Jazz', artist: 'Miles Davis', album: 'Kind of Blue', year: '1959' },
          { genre: 'Electronic', artist: 'Daft Punk', album: 'Random Access Memories', year: '2013' },
          { genre: 'Country', artist: 'Johnny Cash', album: 'At Folsom Prison', year: '1968' },
          { genre: 'R&B', artist: 'Stevie Wonder', album: 'Songs in the Key of Life', year: '1976' },
          { genre: 'Classical', artist: 'Ludwig van Beethoven', album: 'Symphony No. 9', year: '1824' }
        ];
        
        const randomMusic = musicGenres[Math.floor(Math.random() * musicGenres.length)];
        
        return {
          feature: feature.name,
          title: `${randomProduct.title} Vibes`,
          content: `🎵 "${randomMusic.album}"\n👤 by ${randomMusic.artist}\n🎭 Genre: ${randomMusic.genre}\n📅 Released: ${randomMusic.year}\n⭐ Rating: ${randomProduct.rating}/5\n\n🎧 Perfect for your ${randomProduct.category.toLowerCase()} moments!\n\nDiscover amazing music that matches your mood!`,
          shareUrl: `https://open.spotify.com/search/${encodeURIComponent(randomMusic.artist)}`,
          redirectUrl: `https://open.spotify.com/search/${encodeURIComponent(randomMusic.artist)}`,
          imageUrl: randomProduct.thumbnail
        };

      default:
        throw new Error('Unknown feature type');
    }
  } catch (error) {
    console.error('API Error:', error);
    return {
      feature: feature.name,
      title: 'Demo Content',
      content: `Sorry, we couldn't fetch live data right now. Here's a demo ${feature.name.toLowerCase()}!\n\nTry again in a moment - our APIs are usually very reliable!`,
      shareUrl: '#',
      redirectUrl: '#'
    };
  }
};