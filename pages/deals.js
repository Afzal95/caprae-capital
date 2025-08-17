import Layout from '@/components/Layout'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import DealStage from '@/components/DealStage'
import DealPipeline from '@/components/DealPipeline'
import MessageThread from '@/components/MessageThread'
import { advanceStage, setActiveDeal, loadState, signNDAForBoth } from '@/redux/dealsSlice'

export default function DealsPage(){
  const dispatch = useDispatch()
  const deals = useSelector(s => s.deals.deals)
  const activeDealId = useSelector(s => s.deals.activeDealId)
  const user = useSelector(s => s.user)
  const [role] = useState(user.role || 'buyer')
  const [showCongrats, setShowCongrats] = useState(false);
  const prevClosedRef = useRef(false);
  const mounted = useRef(false);
  const [hydrated, setHydrated] = useState(false); // ✅ track hydration

  // hydrate from localStorage on mount
  useEffect(()=>{
    try{
      const raw = typeof window !== 'undefined' ? localStorage.getItem('caprae_deals_v1') : null;
      if(raw){
        const parsed = JSON.parse(raw)
        if(parsed && Array.isArray(parsed.deals) && parsed.deals.length > 0){
          dispatch(loadState(parsed))
          // If no activeDealId, set to most recent deal
          if(!parsed.activeDealId && parsed.deals.length > 0){
            dispatch(setActiveDeal(parsed.deals[parsed.deals.length-1].id))
          }
        } else {
          // fallback to hardcoded sample deals if localStorage is empty
          const sampleDeals = [{
            id: 'sample1',
            counterpartName: 'Acme Corp',
            stage: 'NDA',
            tasks: [],
            messages: [],
            documents: [],
            ndaSummary: null,
            signed: { buyer: true, seller: true },
            offers: [],
            closed: false
          }];
          dispatch(loadState({ deals: sampleDeals, activeDealId: 'sample1' }))
        }
      } else {
        // fallback to hardcoded sample deals if localStorage is empty
        const sampleDeals = [{
          id: 'sample1',
          counterpartName: 'Acme Corp',
          stage: 'NDA',
          tasks: [],
          messages: [],
          documents: [],
          ndaSummary: null,
          signed: { buyer: true, seller: true },
          offers: [],
          closed: false
        }];
        dispatch(loadState({ deals: sampleDeals, activeDealId: 'sample1' }))
      }
    }catch(e){ /* ignore */ }
    setHydrated(true); // ✅ mark hydration complete after localStorage logic
  }, [dispatch])

  // persist to localStorage whenever deals change
  useEffect(()=>{
    const toSave = { deals, activeDealId }
    try{ localStorage.setItem('caprae_deals_v1', JSON.stringify(toSave)) }catch(e){}
  }, [deals, activeDealId])

  // reset congratulation modal on first mount
  useEffect(()=>{
    setShowCongrats(false);
  },[])

  const deal = deals.find(d => d.id === activeDealId)

  // ✅ Correct congratulations modal logic
  useEffect(() => {
    if (!hydrated) return; // wait until hydration done

    if (!mounted.current) {
      mounted.current = true;
      return; // skip first run after hydration
    }

    if (deal && !prevClosedRef.current && deal.closed) {
      setShowCongrats(true);
    }

    prevClosedRef.current = deal?.closed;
  }, [deal?.closed, hydrated]);

  // if no active deal, show message
  if(!activeDealId){
    return (
      <Layout>
        <div className="card">
          <div className="text-lg font-semibold">No active deal</div>
          <div className="text-sm text-gray-600">Accept a match from the Matches page to start a deal.</div>
        </div>
      </Layout>
    )
  }

  if(!deal) return (<Layout><div className="card">Deal not found.</div></Layout>)

  const onAdvance = () => {
    if (!deal) return;

    // Only allow advancing from NDA if both parties have signed
    if (deal.stage === 'NDA') {
      if (!deal.signed.buyer || !deal.signed.seller) {
        if (window.confirm('Both parties must sign NDA before advancing. Click OK to sign for both and continue.')) {
          dispatch(signNDAForBoth(deal.id));
        } else {
          return;
        }
      }
    }

    dispatch(advanceStage(deal.id));
  };

  return (
    <Layout>
      {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
            <div className="text-2xl font-bold mb-2">🎉 Congratulations!</div>
            <div className="mb-4">The deal with <span className="font-semibold">{deal.counterpartName}</span> has been <span className="text-green-600 font-semibold">finalized and closed</span>.</div>
            <div className="mb-4 text-sm text-gray-600">Thank you for using Caprae Platform. You can view details or start a new deal from the dashboard.</div>
            <button className="btn bg-teal text-white mt-2" onClick={()=>setShowCongrats(false)}>Close</button>
          </div>
        </div>
      )}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold">Deal with {deal.counterpartName}</div>
          <div className="text-sm text-gray-600">Stage: {deal.stage}</div>
          <div className="text-sm text-gray-700 mt-1">
            Status: {deal.closed ? 'Closed' : (deal.stage === 'NDA' ? 'Opened' : 'In Progress')}
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn bg-white border" onClick={()=>dispatch(setActiveDeal(null))}>Exit Deal</button>
          <button className="btn bg-red-500 text-white" onClick={()=>{
            localStorage.clear();
            window.location.href = '/';
          }}>Logout</button>
          <button className="btn bg-gray-400 text-white" onClick={()=>{
            dispatch({type: 'deals/rejectDeal', payload: deal.id});
            dispatch(setActiveDeal(null));
          }}>Reject Deal</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <DealStage deal={deal} role={role} />
{deal.stage === 'NDA' && (
  <div className="card mb-4">
    <div className="font-medium mb-2">Sign NDA</div>
    <div className="flex gap-2">
      <button
        className={`btn ${deal.signed.seller ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white'}`}
        disabled={deal.signed.seller}
        onClick={()=>dispatch({type: 'deals/signDocument', payload: {dealId: deal.id, role: 'seller'}})}
      >{deal.signed.seller ? 'Seller Signed' : 'Sign as Seller'}</button>
      <button
        className={`btn ${deal.signed.buyer ? 'bg-gray-300 text-gray-500' : 'bg-green-500 text-white'}`}
        disabled={deal.signed.buyer}
        onClick={()=>dispatch({type: 'deals/signDocument', payload: {dealId: deal.id, role: 'buyer'}})}
      >{deal.signed.buyer ? 'Buyer Signed' : 'Sign as Buyer'}</button>
    </div>
    <div className="flex gap-2 flex-col mt-4">
      <button
        className={`btn ${(deal.signed.buyer || deal.signed.seller) ? 'bg-teal text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        onClick={onAdvance}
        disabled={!(deal.signed.buyer || deal.signed.seller)}
      >Advance Stage</button>
      {!(deal.signed.buyer || deal.signed.seller) && (
        <div className="text-xs text-red-500 mt-1">At least one party must sign NDA before advancing.</div>
      )}
    </div>
  </div>
)}
{/* Always show Advance Stage button for other stages except NDA */}
{deal.stage !== 'NDA' && deal.stage !== 'Closing' && (
  <div className="card mb-4">
    <div className="flex gap-2 flex-col">
      <button
        className="btn bg-teal text-white"
        onClick={onAdvance}
      >Advance Stage</button>
    </div>
  </div>
)}
{/* Closing section: show Close Deal button after payment confirmation */}
{deal.stage === 'Closing' && (
  <div className="card mb-4">
    <div className="flex gap-2 flex-col">
      <button
        className="btn bg-green-600 text-white"
        onClick={() => {
          if (window.confirm('Confirm payment received and close the deal?')) {
            dispatch({type: 'deals/markClosed', payload: deal.id});
            setShowCongrats(true);
          }
        }}
      >Close Deal</button>
      <div className="text-xs text-gray-600 mt-1">Once payment is confirmed, click to finalize and close the deal.</div>
    </div>
  </div>
)}
{deal.stage === 'Due Diligence' && (
  <div className="card mb-4">
    <div className="font-medium mb-2">AI Risk Highlights</div>
    {deal.documents && deal.documents.length > 0 ? (
      <div className="text-sm text-gray-700">AI Risk Highlights (stub): Financials/Documents have been uploaded. [AI analysis would appear here]</div>
    ) : (
      <div className="text-sm text-red-500">Please upload Financials or Documents to view AI Risk Highlights.</div>
    )}
  </div>
)}
          <div className="card">
            <div className="font-medium mb-2">Offer History</div>
            {deal.offers.length === 0 ? <div className="text-sm text-gray-500">No offers yet</div> : deal.offers.map(o => (
              <div key={o.id} className="p-2 bg-gray-50 rounded mb-2">
                <div className="text-sm font-medium">{o.from} • ${o.amount} • <span className="text-xs text-gray-500">{o.status}</span></div>
                <div className="text-xs text-gray-500">{new Date(o.at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <DealPipeline deal={deal} />
          <MessageThread deal={deal} />
        </div>
      </div>
    </Layout>
  )
}
