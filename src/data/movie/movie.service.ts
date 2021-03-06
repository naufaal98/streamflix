import axios from 'axios';
import { BASE_URL } from 'constant';
import { MovieDetail, MovieList } from 'data/movie/movie.type';
import { movieListAdapter, movieDetailAdapter } from './movie.adapter';

const API_KEY = process.env.REACT_APP_API_KEY;

interface MovieListParams {
  page: number;
  language?: string;
  region?: string;
}

export default {
  async getNowPlaying({ page = 1, language, region }: MovieListParams): Promise<MovieList> {
    const params: MovieListParams = { page };
    if (language) params.language = language;
    if (region) params.region = region;
    const URL = `${BASE_URL}/now_playing`;
    const { data } = await axios.get<any>(URL, {
      params: {
        api_key: API_KEY,
        ...params,
      },
    });
    return movieListAdapter(data);
  },

  async getDetail(id: number): Promise<MovieDetail> {
    const URL_DETAIL = `${BASE_URL}/${id}`;
    const URL_CREDIT = `${BASE_URL}/${id}/credits`;
    const { data: movie } = await axios.get<any>(URL_DETAIL, { params: { api_key: API_KEY } });
    const { data: credit } = await axios.get<any>(URL_CREDIT, { params: { api_key: API_KEY } });
    return movieDetailAdapter(movie, credit.cast);
  },

  async getRecommended(id: number, { page = 1, language }: MovieListParams): Promise<MovieList> {
    const params: MovieListParams = { page };
    if (language) params.language = language;
    const URL = `${BASE_URL}/${id}/recommendations`;
    const { data } = await axios.get<any>(URL, {
      params: {
        api_key: API_KEY,
        ...params,
      },
    });
    return movieListAdapter(data);
  },

  async getSimilar(id: number, { page = 1, language }: MovieListParams): Promise<MovieList> {
    const params: MovieListParams = { page };
    if (language) params.language = language;
    const URL = `${BASE_URL}/${id}/similar`;
    const { data } = await axios.get<any>(URL, {
      params: {
        api_key: API_KEY,
        ...params,
      },
    });
    return movieListAdapter(data);
  },
};
