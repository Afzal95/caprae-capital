import { createSlice, nanoid } from '@reduxjs/toolkit'

export const DEAL_STAGES = ["NDA","Due Diligence","Negotiation","LOI","Contract","Closing"]

const initialState = {
  deals: [],
  activeDealId: null
}

// helper to create initial deal object
function makeDeal(counterpartName){
  return {
    id: nanoid(),
    counterpartName,
    stage: 'NDA',
    tasks: [
      { id: nanoid(), text: 'Upload NDA', owner: 'seller', done: false },
      { id: nanoid(), text: 'Sign NDA', owner: 'buyer', done: false }
    ],
    messages: [],
    documents: [], // {id, type, name, uploadedBy, uploadedAt}
    ndaSummary: null,
    signed: { buyer: false, seller: false },
    offers: [], // {id, amount, from, at, status, notes}
    closed: false
  }
}

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    createDeal: {
      reducer(state, action){
        state.deals.push(action.payload)
        state.activeDealId = action.payload.id
      },
      prepare(counterpartName){
        return { payload: makeDeal(counterpartName) }
      }
    },
    setActiveDeal(state, action){
      state.activeDealId = action.payload
    },
    uploadDocument(state, action){
      const { dealId, docType, name, uploadedBy } = action.payload
      const deal = state.deals.find(d => d.id === dealId)
      if(!deal) return
      deal.documents.push({ id: nanoid(), type: docType, name, uploadedBy, uploadedAt: new Date().toISOString() })
    },
    setNdaSummary(state, action){
      const { dealId, summary } = action.payload
      const deal = state.deals.find(d => d.id === dealId)
      if(!deal) return
      deal.ndaSummary = summary
    },
    signDocument(state, action){
      const { dealId, role } = action.payload // role: 'buyer'|'seller'
      const deal = state.deals.find(d => d.id === dealId)
      if(!deal) return
      deal.signed[role] = true
    },
    signNDAForBoth(state, action){
      const deal = state.deals.find(d => d.id === action.payload)
      if(!deal) return
      deal.signed.buyer = true
      deal.signed.seller = true
    },
    addOffer(state, action){
      const { dealId, amount, from, notes } = action.payload
      const deal = state.deals.find(d => d.id === dealId)
      if(!deal) return
      deal.offers.push({ id: nanoid(), amount, from, at: new Date().toISOString(), status: 'pending', notes })
    },
    respondOffer(state, action){
      const { dealId, offerId, status } = action.payload // status: 'accepted'|'rejected'|'countered'
      const deal = state.deals.find(d => d.id === dealId)
      if(!deal) return
      const of = deal.offers.find(o => o.id === offerId)
      if(of) of.status = status
    },
    advanceStage(state, action){
      const deal = state.deals.find(d => d.id === action.payload)
      if(!deal) return
      const idx = DEAL_STAGES.indexOf(deal.stage)
      if(idx < DEAL_STAGES.length - 1) deal.stage = DEAL_STAGES[idx + 1]
    },
    markClosed(state, action){
      const deal = state.deals.find(d => d.id === action.payload)
      if(!deal) return
      deal.closed = true
    },
    sendMessage(state, action){
      const { dealId, from, text } = action.payload
      const deal = state.deals.find(d => d.id === dealId)
      if(!deal) return
      deal.messages.push({ id: nanoid(), from, text, at: new Date().toISOString() })
    },
    loadState(state, action){
      // replace full deals array (used for localStorage hydration)
      const data = action.payload
      if(data && Array.isArray(data.deals)){
        state.deals = data.deals
        state.activeDealId = data.activeDealId || null
      }
    },
    rejectDeal(state, action){
      const deal = state.deals.find(d => d.id === action.payload)
      if(!deal) return
      deal.rejected = true
    },
  }
})

export const {
  createDeal, setActiveDeal, uploadDocument, setNdaSummary, signDocument,
  signNDAForBoth,
  addOffer, respondOffer, advanceStage, markClosed, sendMessage, loadState, rejectDeal
} = dealsSlice.actions
export default dealsSlice.reducer