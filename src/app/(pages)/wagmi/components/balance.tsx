import { useReadContract } from 'wagmi'
import { abi } from '../abi'
import React from 'react'
import { formatEther } from 'ethers/utils'
function Balance() {
  // 查询合约
  const result = useReadContract({
    abi,
    address: '0x7f68f950AfCB47B976C2075f409F595AF8Dd82dD',
    functionName: 'balanceOf',
    args: ["0x2bcBa6Fce85C9781F29d05629cE6BB8858f21Bc2"]

  })
  return <div>{formatEther(result.data as string ?? "0")}SepoliaETH</div>;
}

export default React.memo(Balance);