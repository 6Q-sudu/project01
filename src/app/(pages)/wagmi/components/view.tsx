import { useBalance } from 'wagmi'
import { formatEther } from 'ethers/utils';
import React from 'react'
const View = (props: any) => {
  const { address } = props
  const { data: balance, isSuccess: isBalanceSuccess, error: balanceError } = useBalance({
    address: address,
  })
  const ethMoney = formatEther(balance?.value || 0)
  return <div>
    结果：{ethMoney} ETH
  </div>
}

export default React.memo(View);