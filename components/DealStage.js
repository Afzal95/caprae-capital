import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { uploadDocument, setNdaSummary, signDocument, addOffer, respondOffer } from '@/redux/dealsSlice'

export default function DealStage({ deal, role }){
  const dispatch = useDispatch()
  const [fileName, setFileName] = useState('')
  const [fakeAISummary, setFakeAISummary] = useState('')

  const handleUpload = (e, docType) => {
    const file = e.target.files && e.target.files[0]
    if(!file) return
    setFileName(file.name)
    // store filename in redux
    dispatch(uploadDocument({ dealId: deal.id, docType, name: file.name, uploadedBy: role }))
    // simulate AI summary generation for NDA
    if(docType === 'nda'){
      const summary = `This NDA (uploaded as ${file.name}) requires both parties to keep confidential information private for 3 years. It limits use of data to evaluation purposes and includes standard non-disclosure clauses.`
      setFakeAISummary(summary)
      dispatch(setNdaSummary({ dealId: deal.id, summary }))
    }
    // for other docs we could generate different stub summaries
  }

  const handleSign = (which) => {
    dispatch(signDocument({ dealId: deal.id, role: which }))
  }

  const handleAddOffer = () => {
    const amount = prompt('Enter offer amount (e.g., 1200000)')
    if(!amount) return
    dispatch(addOffer({ dealId: deal.id, amount, from: role, notes: '' }))
  }

  return (
    <div className="card space-y-4">
      <div className="text-lg font-semibold">Stage: {deal.stage}</div>

      {deal.stage === 'NDA' && (
        <div>
          <div className="mb-2">Upload NDA (PDF or Image)</div>
          <input type="file" accept="application/pdf,image/*" onChange={(e)=>handleUpload(e,'nda')} />
          {fileName && <div className="mt-2 text-sm text-gray-700">Uploaded: {fileName}</div>}
          {deal.ndaSummary && (
            <div className="mt-3 p-3 bg-gray-50 rounded">
              <div className="font-medium">AI Summary of NDA</div>
              <div className="text-sm text-gray-700 mt-1">{deal.ndaSummary}</div>
            </div>
          )}
          <div className="mt-3 flex gap-2">
            {!deal.signed.seller && role === 'seller' && <button className="btn bg-teal text-white" onClick={()=>handleSign('seller')}>Sign NDA (Seller)</button>}
            {!deal.signed.buyer && role === 'buyer' && <button className="btn bg-teal text-white" onClick={()=>handleSign('buyer')}>Sign NDA (Buyer)</button>}
          </div>
        </div>
      )}

      {deal.stage === 'Due Diligence' && (
        <div>
          <div className="mb-2">Upload Financials / Documents</div>
          <input type="file" accept="application/pdf,image/*" onChange={(e)=>handleUpload(e,'financials')} />
          <div className="mt-3">
            <div className="font-medium">AI Risk Highlights (stub)</div>
            <ul className="list-disc pl-6 text-sm text-gray-700 mt-2">
              <li>Revenue concentration: top 3 customers = 45% of revenue.</li>
              <li>Key person risk: CEO responsible for major client relationships.</li>
              <li>Minor compliance item in 2019 (disclosed).</li>
            </ul>
          </div>
        </div>
      )}

      {deal.stage === 'Negotiation' && (
        <div>
          <div className="mb-2">Offers</div>
          <div className="space-y-2">
            {deal.offers.length === 0 && <div className="text-sm text-gray-500">No offers yet.</div>}
            {deal.offers.map(o=>(
              <div key={o.id} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">{o.from} • ${o.amount}</div>
                  <div className="text-xs text-gray-500">{new Date(o.at).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  {role !== o.from && o.status === 'pending' && <button className="btn bg-white border" onClick={()=>{ const ans = confirm('Accept offer?'); dispatch(respondOffer({ dealId: deal.id, offerId: o.id, status: ans ? 'accepted' : 'rejected' })) }}>Respond</button>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <button className="btn bg-teal text-white" onClick={handleAddOffer}>Make an Offer</button>
          </div>
        </div>
      )}

      {deal.stage === 'LOI' && (
        <div>
          <div className="font-medium">Draft LOI (auto-generated)</div>
          <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded">This Letter of Intent outlines the principal terms for the acquisition of {deal.counterpartName}. Purchase price, timeline, and exclusivity are included. (Stub)</div>
          <div className="mt-3 flex gap-2">
            <button className="btn bg-teal text-white" onClick={()=>alert('LOI signed (stub)')}>Sign LOI</button>
          </div>
        </div>
      )}

      {deal.stage === 'Contract' && (
        <div>
          <div className="mb-2">Upload final contract</div>
          <input type="file" accept="application/pdf" onChange={(e)=>handleUpload(e,'contract')} />
          <div className="mt-3 text-sm text-gray-700">After both parties confirm, mark as ready for closing.</div>
        </div>
      )}

      {deal.stage === 'Closing' && (
        <div>
          <div className="font-medium">Closing</div>
          <div className="mt-2 text-sm text-gray-700">Confirm payment and transfer ownership documents.</div>
          <div className="mt-3">
            <button className="btn bg-teal text-white" onClick={()=>alert('Payment confirmed (stub)')}>Confirm Payment</button>
          </div>
        </div>
      )}
    </div>
  )
}