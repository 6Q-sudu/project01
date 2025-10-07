"use client"
import { ChangeEvent, useState } from "react"
import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { sepolia } from 'viem/chains'
import { parseEther, formatEther } from 'ethers/utils'
import { getContract } from 'viem'
import { abi } from '../wagmi/abi'

const client = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: sepolia,
  transport: http(),
})

const [account] = await window.ethereum.request({
  method: 'eth_requestAccounts'
})
console.log(account);

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: custom(window.ethereum!)
})

const contract = getContract({
  address: '0x7f68f950AfCB47B976C2075f409F595AF8Dd82dD',
  abi: abi,
  client: { public: client, wallet: walletClient }
})
const unwatch = client.watchContractEvent({
  address: '0x7f68f950AfCB47B976C2075f409F595AF8Dd82dD',
  abi: abi,
  eventName: 'Transfer',
  onLogs: logs => console.log('Transfer logs', logs),
  onError: error => console.error('Error11', error),
})
export default function Viem() {
  const [index, setIndex] = useState(0);
  function changeIndex(value: number): void {
    if (value === index) return;
    setIndex(value);
  }
  // 查询一个地址的余额
  const [data, setData] = useState({
    _address: "",
    address: "",
    _transaction: "",
    transaction: "",
    balance: ""
  })
  const [balance, setBalance] = useState("");
  function inputChange(event: ChangeEvent<HTMLInputElement>, type: string): void {
    if (type === "balance") {
      const address = event.target.value;
      setData({
        ...data,
        _address: address
      })
    } else if (type === "transaction") {
      const transaction = event.target.value;
      setData({
        ...data,
        _transaction: transaction
      })
    }
  }
  function changeAddress(type: string): void {
    if (type === "balance") {
      setData({
        ...data,
        address: data._address,
      })
      // Ensure the address is a valid 0x-prefixed string
      if (data._address.startsWith("0x")) {
        client.getBalance({
          address: data._address as `0x${string}`,
        }).then((res) => {
          console.log("balance:", res);
          setData({
            ...data,
            balance: formatEther(res),
          })
        });
      } else {
        alert("请输入以0x开头的有效地址");
      }

    } else if (type === "transaction") {
      setData({
        ...data,
        transaction: data._transaction,
      })
      walletClient.sendTransaction({
        to: '0x2bcBa6Fce85C9781F29d05629cE6BB8858f21Bc2',
        value: parseEther(data._transaction),
        gasLimit: 21000,
        account: account,
      }).then((tx) => {
        console.log("tx:", tx);
      })
    } else if (type === "balanceOf") {
      contract.read.balanceOf([
        '0x2bcBa6Fce85C9781F29d05629cE6BB8858f21Bc2',
      ]).then((res) => {
        console.log("balanceOf:", res);
        setBalance(formatEther(res));
      })
    }
    else if (type === "transfer") {

      client.simulateContract({
        account,
        address: '0x7f68f950AfCB47B976C2075f409F595AF8Dd82dD',
        abi: abi,
        functionName: 'transfer',
        args: ["0x2bcBa6Fce85C9781F29d05629cE6BB8858f21Bc2", parseEther("0.001")]
      }).then((res) => {
        console.log("simulateContract:", res);
        walletClient.writeContract(res.request).then((tx) => {
          console.log("tx:", tx);
        })
      })
    }
  }
  return (
    <div>
      <div className="flex justify-center mt-4">
        <button className="px-5 py-2 mr-2 flex justify-center items-center rounded-2xl border border-black border-solid" onClick={() => changeIndex(0)}>余额</button>
        <button className="px-5 py-2 mr-2 flex justify-center items-center rounded-2xl border border-black border-solid" onClick={() => changeIndex(1)}>交易</button>
        <button className="px-5 py-2 mr-2 flex justify-center items-center rounded-2xl border border-black border-solid" onClick={() => changeIndex(2)}>查询合约</button>
        <button className="px-5 py-2 mr-2 flex justify-center items-center rounded-2xl border border-black border-solid" onClick={() => changeIndex(3)}>事件</button>
      </div>
      {index === 0 &&
        <div className="m-10 flex flex-col justify-center items-center">
          <div>
            <label htmlFor="balance">address:</label>
            <input className="border border-black" type="text" id="balance" name="balance" defaultValue={data._address} onChange={(event) => inputChange(event, "balance")} />
          </div>
          <div className="mt-10">
            <button className="border border-black" onClick={() => changeAddress("balance")}>submit</button>
            <div className="mt-10">结果:{data.balance} ETH</div>
          </div>
        </div>
      }
      {
        index === 1 &&
        <div className="m-10 flex flex-col justify-center items-center">
          <div>
            <label htmlFor="transaction">amount:</label>
            <input className="border border-black" type="number" id="transaction" name="transaction" defaultValue={data._transaction} onChange={(event) => inputChange(event, "transaction")} />ETH
          </div>
          <div className="mt-10">
            <button className="border border-black" onClick={() => changeAddress("transaction")}>transact</button>
          </div>
        </div>
      }
      {
        index === 2 &&
        <div className="m-10 flex flex-col justify-center items-center">
          <div className="mt-10">
            <button className="border border-black" onClick={() => changeAddress("balanceOf")}>balanceOf</button>
          </div>
          <div className="mt-10">
            {balance} WTF
          </div>
        </div>
      }
      {
        index === 3 &&
        <div className="m-10 flex flex-col justify-center items-center">
          <div className="mt-10">
            <button className="border border-black" onClick={() => changeAddress("transfer")}>transfer 0.001SepoliaETH</button>
          </div>
        </div>
      }
    </div>
  )
}
