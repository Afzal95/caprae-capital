import { DEAL_STAGES, advanceStage, addTask, toggleTask } from '@/redux/dealsSlice'
import { useDispatch } from 'react-redux'

export default function DealPipeline({ deal }){
  const dispatch = useDispatch()
  return (
    <div className="card">
      <div className="text-lg font-semibold mb-2">Pipeline</div>
      <div className="flex flex-col gap-3">
        {DEAL_STAGES.map(s => (
          <div key={s} className={`p-3 rounded ${s===deal.stage ? 'bg-teal text-white' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-center">
              <div className="font-medium">{s}</div>
              <div className="text-sm">{s===deal.stage ? 'Current' : ''}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}