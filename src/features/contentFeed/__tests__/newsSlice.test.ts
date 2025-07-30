import newsReducer, { getNews } from '../newsSlice'

// Mock the fetchNews function
jest.mock('../../../utils/newsApi', () => ({
  fetchNews: jest.fn(),
}))

import { fetchNews } from '../../../utils/newsApi'

const mockFetchNews = fetchNews as jest.MockedFunction<typeof fetchNews>

describe('newsSlice', () => {
  const initialState = {
    articles: [],
    status: 'idle',
    error: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the initial state', () => {
    expect(newsReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  describe('getNews thunk', () => {
    it('should handle pending state', () => {
      const action = { type: getNews.pending.type }
      const state = newsReducer(initialState, action)
      expect(state.status).toBe('loading')
      expect(state.error).toBe(null)
    })

    it('should handle fulfilled state with articles', () => {
      const mockArticles = [
        {
          title: 'Test Article 1',
          description: 'Test description 1',
          url: 'https://example.com/1',
          source: { name: 'Test Source' },
        },
        {
          title: 'Test Article 2',
          description: 'Test description 2',
          url: 'https://example.com/2',
          source: { name: 'Test Source' },
        },
      ]

      const action = {
        type: getNews.fulfilled.type,
        payload: mockArticles,
      }
      const state = newsReducer(initialState, action)
      expect(state.status).toBe('succeeded')
      expect(state.articles).toEqual(mockArticles)
      expect(state.error).toBe(null)
    })

    it('should handle rejected state with error', () => {
      const errorMessage = 'Failed to fetch news'
      const action = {
        type: getNews.rejected.type,
        error: { message: errorMessage },
      }
      const state = newsReducer(initialState, action)
      expect(state.status).toBe('failed')
      expect(state.error).toBe(errorMessage)
    })

    it('should handle rejected state without error message', () => {
      const action = {
        type: getNews.rejected.type,
        error: {},
      }
      const state = newsReducer(initialState, action)
      expect(state.status).toBe('failed')
      expect(state.error).toBe('Failed to fetch news')
    })
  })

  describe('async thunk integration', () => {
    it('should handle successful news fetch', async () => {
      const mockArticles = [
        {
          title: 'Test Article',
          description: 'Test description',
          url: 'https://example.com',
          source: { name: 'Test Source' },
        },
      ]

      mockFetchNews.mockResolvedValue(mockArticles)

      const dispatch = jest.fn()
      const getState = jest.fn()

      await getNews('technology')(dispatch, getState, undefined)

      expect(mockFetchNews).toHaveBeenCalledWith('technology')
    })

    it('should handle failed news fetch', async () => {
      const errorMessage = 'Network error'
      mockFetchNews.mockRejectedValue(new Error(errorMessage))

      const dispatch = jest.fn()
      const getState = jest.fn()

      try {
        await getNews('technology')(dispatch, getState, undefined)
      } catch (error) {
        // Expected to throw
      }

      expect(mockFetchNews).toHaveBeenCalledWith('technology')
    })

    it('should use default category when none provided', async () => {
      const mockArticles = []
      mockFetchNews.mockResolvedValue(mockArticles)

      const dispatch = jest.fn()
      const getState = jest.fn()

      await getNews()(dispatch, getState, undefined)

      expect(mockFetchNews).toHaveBeenCalledWith('general')
    })
  })

  describe('state transitions', () => {
    it('should transition from idle to loading to succeeded', () => {
      const mockArticles = [{ title: 'Test', description: 'Test', url: 'https://example.com' }]

      let state = newsReducer(initialState, { type: getNews.pending.type })
      expect(state.status).toBe('loading')

      state = newsReducer(state, {
        type: getNews.fulfilled.type,
        payload: mockArticles,
      })
      expect(state.status).toBe('succeeded')
      expect(state.articles).toEqual(mockArticles)
    })

    it('should transition from idle to loading to failed', () => {
      let state = newsReducer(initialState, { type: getNews.pending.type })
      expect(state.status).toBe('loading')

      state = newsReducer(state, {
        type: getNews.rejected.type,
        error: { message: 'Error' },
      })
      expect(state.status).toBe('failed')
      expect(state.error).toBe('Error')
    })

    it('should clear error when starting new request', () => {
      const stateWithError = {
        ...initialState,
        error: 'Previous error',
      }

      const state = newsReducer(stateWithError, { type: getNews.pending.type })
      expect(state.status).toBe('loading')
      expect(state.error).toBe(null)
    })
  })
}) 