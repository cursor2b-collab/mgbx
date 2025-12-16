import { useState } from 'react'

export function BatteryWidget() {
  const [loanAmount, setLoanAmount] = useState(10000)
  const [loanTerm, setLoanTerm] = useState(12)
  const interestRate = 5.5

  const monthlyPayment = (loanAmount * (interestRate / 100 / 12)) / (1 - Math.pow(1 + (interestRate / 100 / 12), -loanTerm))

  return (
    <div className="relative flex justify-center items-center">
      {/* SVG Glow Border */}
      <svg className="w-[500px] h-[500px] p-[45px] absolute" viewBox="-50 -30 340 300">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation={10} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect 
          x={0} 
          y={0} 
          width={240} 
          height={120} 
          rx={60} 
          ry={60} 
          className="fill-none stroke-[#A3F030]/80 stroke-[3]"
          style={{ filter: 'url(#glow)', strokeLinecap: 'round' }}
        />
        <rect 
          x={0} 
          y={120} 
          width={240} 
          height={120} 
          rx={60} 
          ry={60} 
          className="fill-none stroke-[#A3F030]/80 stroke-[3]"
          style={{ filter: 'url(#glow)', strokeLinecap: 'round' }}
        />
      </svg>

      {/* Main Card */}
      <div 
        className="absolute w-[240px] h-[240px] rounded-[25%] backdrop-blur-[35px] border-[0.5px] border-white/20 flex justify-center items-center z-[9999] transition-all duration-1000 hover:shadow-[0_0_50px_rgba(163,240,48,0.4)]"
        style={{
          backgroundImage: 'conic-gradient(#37363640, #eceaea1f, #37363643, #3736363f, #eceaea1d, #37363641, #3f3f3f46)',
          boxShadow: 'inset -2px -2px 5px rgb(0, 0, 0), inset 2px 2px 5px rgb(0, 0, 0)'
        }}
      >
        <div className="loan-form text-center px-4 w-full">
          {/* Title */}
          <div className="text-[18px] font-medium text-white mb-3">
            贷款计算器
          </div>

          {/* Loan Amount */}
          <div className="mb-3">
            <label className="text-[10px] text-[#aaa] block mb-1">贷款金额</label>
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-1 bg-[#333] rounded-full appearance-none cursor-pointer slider"
            />
            <div className="text-[16px] text-[#A3F030] mt-1">
              ${loanAmount.toLocaleString()}
            </div>
          </div>

          {/* Loan Term */}
          <div className="mb-3">
            <label className="text-[10px] text-[#aaa] block mb-1">期限（月）</label>
            <input
              type="range"
              min="6"
              max="60"
              step="6"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full h-1 bg-[#333] rounded-full appearance-none cursor-pointer slider"
            />
            <div className="text-[16px] text-[#A3F030] mt-1">
              {loanTerm} 月
            </div>
          </div>

          {/* Interest Rate & Monthly Payment */}
          <div className="text-[10px] text-[#aaa] mb-1">
            利率: {interestRate}%
          </div>
          <div className="text-[12px] text-white">
            月供: <span className="text-[#A3F030]">${monthlyPayment.toFixed(2)}</span>
          </div>

          {/* Apply Button */}
          <button className="w-full bg-[#A3F030] text-black text-[11px] py-2 rounded-2xl mt-3 hover:bg-[#8fd028] transition-colors flex items-center justify-center">
            立即申请
          </button>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: #A3F030;
          border-radius: 50%;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #A3F030;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .loan-form {
          border-radius: 25%;
        }

        .loan-form:hover {
          background-image: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0),
            rgba(163, 240, 48, 0.2)
          );
          border-radius: 25%;
        }
      `}</style>
    </div>
  )
}
