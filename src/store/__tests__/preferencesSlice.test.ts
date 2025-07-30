import preferencesReducer, {
  setCategories,
  toggleDarkMode,
  setDarkMode,
  addFavorite,
  removeFavorite,
  setFavorites,
} from '../preferencesSlice'

describe('preferencesSlice', () => {
  const initialState = {
    categories: [],
    darkMode: false,
    favorites: [],
  }

  it('should return the initial state', () => {
    expect(preferencesReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  describe('setCategories', () => {
    it('should set categories correctly', () => {
      const categories = ['technology', 'sports', 'entertainment']
      const actual = preferencesReducer(initialState, setCategories(categories))
      expect(actual.categories).toEqual(categories)
    })

    it('should replace existing categories', () => {
      const state = {
        ...initialState,
        categories: ['old-category'],
      }
      const newCategories = ['new-category']
      const actual = preferencesReducer(state, setCategories(newCategories))
      expect(actual.categories).toEqual(newCategories)
    })
  })

  describe('toggleDarkMode', () => {
    it('should toggle dark mode from false to true', () => {
      const actual = preferencesReducer(initialState, toggleDarkMode())
      expect(actual.darkMode).toBe(true)
    })

    it('should toggle dark mode from true to false', () => {
      const state = {
        ...initialState,
        darkMode: true,
      }
      const actual = preferencesReducer(state, toggleDarkMode())
      expect(actual.darkMode).toBe(false)
    })
  })

  describe('setDarkMode', () => {
    it('should set dark mode to true', () => {
      const actual = preferencesReducer(initialState, setDarkMode(true))
      expect(actual.darkMode).toBe(true)
    })

    it('should set dark mode to false', () => {
      const state = {
        ...initialState,
        darkMode: true,
      }
      const actual = preferencesReducer(state, setDarkMode(false))
      expect(actual.darkMode).toBe(false)
    })
  })

  describe('addFavorite', () => {
    it('should add a movie favorite', () => {
      const movieFavorite = {
        id: 1,
        type: 'movie' as const,
        title: 'Test Movie',
        description: 'A test movie',
        url: 'https://example.com/movie',
      }
      const actual = preferencesReducer(initialState, addFavorite(movieFavorite))
      expect(actual.favorites).toHaveLength(1)
      expect(actual.favorites[0]).toEqual(movieFavorite)
    })

    it('should add a news favorite', () => {
      const newsFavorite = {
        type: 'news' as const,
        title: 'Test News',
        description: 'A test news article',
        url: 'https://example.com/news',
        source: { name: 'Test Source' },
      }
      const actual = preferencesReducer(initialState, addFavorite(newsFavorite))
      expect(actual.favorites).toHaveLength(1)
      expect(actual.favorites[0]).toEqual(newsFavorite)
    })

    it('should not add duplicate movie favorites', () => {
      const movieFavorite = {
        id: 1,
        type: 'movie' as const,
        title: 'Test Movie',
        description: 'A test movie',
        url: 'https://example.com/movie',
      }
      const state = {
        ...initialState,
        favorites: [movieFavorite],
      }
      const actual = preferencesReducer(state, addFavorite(movieFavorite))
      expect(actual.favorites).toHaveLength(1)
    })

    it('should not add duplicate news favorites', () => {
      const newsFavorite = {
        type: 'news' as const,
        title: 'Test News',
        description: 'A test news article',
        url: 'https://example.com/news',
        source: { name: 'Test Source' },
      }
      const state = {
        ...initialState,
        favorites: [newsFavorite],
      }
      const actual = preferencesReducer(state, addFavorite(newsFavorite))
      expect(actual.favorites).toHaveLength(1)
    })
  })

  describe('removeFavorite', () => {
    it('should remove a movie favorite', () => {
      const movieFavorite = {
        id: 1,
        type: 'movie' as const,
        title: 'Test Movie',
        description: 'A test movie',
        url: 'https://example.com/movie',
      }
      const state = {
        ...initialState,
        favorites: [movieFavorite],
      }
      const actual = preferencesReducer(state, removeFavorite('movie-1'))
      expect(actual.favorites).toHaveLength(0)
    })

    it('should remove a news favorite', () => {
      const newsFavorite = {
        type: 'news' as const,
        title: 'Test News',
        description: 'A test news article',
        url: 'https://example.com/news',
        source: { name: 'Test Source' },
      }
      const state = {
        ...initialState,
        favorites: [newsFavorite],
      }
      const actual = preferencesReducer(state, removeFavorite('news-https://example.com/news'))
      expect(actual.favorites).toHaveLength(0)
    })

    it('should not remove other favorites when removing one', () => {
      const movieFavorite = {
        id: 1,
        type: 'movie' as const,
        title: 'Test Movie',
        description: 'A test movie',
        url: 'https://example.com/movie',
      }
      const newsFavorite = {
        type: 'news' as const,
        title: 'Test News',
        description: 'A test news article',
        url: 'https://example.com/news',
        source: { name: 'Test Source' },
      }
      const state = {
        ...initialState,
        favorites: [movieFavorite, newsFavorite],
      }
      const actual = preferencesReducer(state, removeFavorite('movie-1'))
      expect(actual.favorites).toHaveLength(1)
      expect(actual.favorites[0]).toEqual(newsFavorite)
    })
  })

  describe('setFavorites', () => {
    it('should set favorites array', () => {
      const favorites = [
        {
          id: 1,
          type: 'movie' as const,
          title: 'Test Movie',
          description: 'A test movie',
          url: 'https://example.com/movie',
        },
        {
          type: 'news' as const,
          title: 'Test News',
          description: 'A test news article',
          url: 'https://example.com/news',
          source: { name: 'Test Source' },
        },
      ]
      const actual = preferencesReducer(initialState, setFavorites(favorites))
      expect(actual.favorites).toEqual(favorites)
    })

    it('should replace existing favorites', () => {
      const existingFavorites = [
        {
          id: 1,
          type: 'movie' as const,
          title: 'Old Movie',
          description: 'An old movie',
          url: 'https://example.com/old-movie',
        },
      ]
      const newFavorites = [
        {
          type: 'news' as const,
          title: 'New News',
          description: 'A new news article',
          url: 'https://example.com/new-news',
          source: { name: 'New Source' },
        },
      ]
      const state = {
        ...initialState,
        favorites: existingFavorites,
      }
      const actual = preferencesReducer(state, setFavorites(newFavorites))
      expect(actual.favorites).toEqual(newFavorites)
    })
  })
}) 