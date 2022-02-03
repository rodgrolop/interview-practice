import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from './store';
import {sendEventFirstProvider, sendEventSecondProvider} from './../analytics/analytics';

import axios from 'axios';

const storageCards = JSON.parse(localStorage.getItem('cards'));

if (storageCards.length) {  
  sendEventFirstProvider('cards amount', {amount: storageCards.length});
  sendEventSecondProvider('cards amount', {amount: storageCards.length});  
}

export interface CardsState {
  cards: Array<any>;
  filtered_cards: Array<any>;
  editing_card: any;
  search: String;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CardsState = {
  cards: storageCards ?? [],  
  filtered_cards:  [],
  editing_card: null,
  search: "",
  status: 'idle',
};

export const getCards = createAsyncThunk(
  'cards/getCards',
  async () => {
    try {
      const response = await axios.get('https://api.jsonbin.io/v3/b/61fa6583f77b236211e90167', { 
        headers: { 
          "X-Master-Key": process.env.REACT_APP_JSONBIN_API_KEY,
          "X-Bin-Meta": false,	} 
      })
      localStorage.setItem('cards', JSON.stringify(response.data));
      sendEventFirstProvider('cards amount', {amount: response.data.length});
      sendEventSecondProvider('cards amount', {amount: response.data.length});
      return response.data;
    } catch (e) {
      console.error(e)
    }
  }
);

export const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  
  reducers: {
    setEditCard: (state, action: PayloadAction<Object>) => {
      state.editing_card = action.payload;
    },
    removeCard: (state, action: PayloadAction<String>) => {
      const new_cards_set = state.cards.filter(card => card._id !== action.payload);
      state.cards = new_cards_set;      
      localStorage.setItem('cards', JSON.stringify(new_cards_set));      
      sendEventFirstProvider('cards amount', {amount: new_cards_set.length});
      sendEventSecondProvider('cards amount', {amount: new_cards_set.length});
    },
    editCard: (state, action: PayloadAction<any>) => {
      let cards = state.cards;
      const index = cards.findIndex((card => card._id === action.payload.editing_card._id));
      let card_to_edit = cards[index];
      card_to_edit = {...card_to_edit, name: action.payload.form.name, imageUrl: action.payload.form.imageUrl};
      cards[index] = card_to_edit;
      state.cards = cards;
      localStorage.setItem('cards', JSON.stringify(cards));
    },
    filterCards: (state, action: PayloadAction<String>) => {
      state.search = action.payload;
      state.filtered_cards = state.cards.filter(card => card.name.toLowerCase().includes(action.payload.toLowerCase()));
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(getCards.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCards.fulfilled, (state, action) => {
        state.status = 'idle';
        state.cards = action.payload;
      })
      .addCase(getCards.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { setEditCard, removeCard, editCard, filterCards } = cardsSlice.actions;

export const selectCards = (state: RootState) => state.cards;

export default cardsSlice.reducer;