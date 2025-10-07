interface ChainModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  chains?: { id: number; name: string; rpcUrl: string; currency: { name: string; symbol: string; decimals: number }; blockExplorer: { name: string; url: string } }[];
  onSelectChain?: (chainId: number) => void;
}

const ChainModal = ({ isOpen, onClose, chains, onSelectChain }: ChainModalProps) => {
  if (!isOpen) return null;
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50' onClick={onClose}>
      <div className='bg-white p-4 rounded-lg'>
        <h2 className='text-2xl font-bold'>
          Select a Chain
        </h2>
        {/* 渲染 chains */}
        <div className='space-y-3 max-h-[60vh] overflow-y-auto pr-l'>
          {
            chains?.map((chain) => (
              <div key={chain.id} className='flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100'
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();
                  if (onSelectChain) {
                    onSelectChain(chain.id);
                  }
                }}>
                <span className='text-sm'>{chain.name} ({chain.id})</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default ChainModal;