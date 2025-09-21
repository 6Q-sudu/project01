"use client"
import { useState } from "react"
import View from './components/view';
import { useSendTransaction } from 'wagmi'
import { parseEther, formatEther } from 'ethers/utils'
import { abi } from './abi'
import { useWriteContract } from 'wagmi'
import Balance from './components/balance'
export default function Wagmi() {
  const [index, setIndex] = useState(0);
  const changeIndex = (value: number) => {
    if (value === index) return;
    setIndex(value);
  }

  // 查询一个地址的余额
  const [data, setData] = useState({
    _address: "",
    address: "",
    _transaction: "",
    transaction: ""
  })

  const changeAddress = (type: string) => {
    if (type === "balance") {
      setData({
        ...data,
        address: data._address,
      })
    } else if (type === "transaction") {
      setData({
        ...data,
        transaction: data._transaction,
      })
      sendTran(data._transaction);
    } else if (type === "balanceOf") {
      console.log("balanceOf");
      setBalanceKey(new Date().getTime());
    } else if (type === "transfer") {
      console.log("transfer");
      transferFn()
    }
  }
  function inputChange(event: Event, type: string) {
    console.log(event);
    if (type === "balance") {
      const address = event.target?.value;
      setData({
        ...data,
        _address: address
      })
    } else if (type === "transaction") {
      const transaction = event.target?.value;
      setData({
        ...data,
        _transaction: transaction
      })
    }
  }
  // 发起交易
  const { sendTransaction, sendTransactionAsync } = useSendTransaction();
  const sendTran = async (value: string) => {
    if (value == '') return;
    try {
      const result = await sendTransactionAsync({
        to: "0x2bcBa6Fce85C9781F29d05629cE6BB8858f21Bc2",
        value: parseEther(value),
      })
      console.log("sendTransaction", result);
    } catch (error) {
      console.error(error);
    }
  }
  // 查询合约
  const [balanceKey, setBalanceKey] = useState(new Date().getTime());

  // 监听transfer
  const { writeContract } = useWriteContract();
  const transferFn = async () => {
    try {
      const result = await writeContract({
        abi,
        address: "0x7f68f950AfCB47B976C2075f409F595AF8Dd82dD",
        functionName: 'mint',
        args: [
          parseEther('0.001')
        ]
      })
      console.log("writeContract", result);

    } catch (error) {
      console.error("writeContract", error);
    }
  }

  return <div >
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
          <View address={data.address}></View>
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
          <Balance key={balanceKey}></Balance>
        </div>
      </div>
    }
    {
      index === 3 &&
      <div className="m-10 flex flex-col justify-center items-center">
        <div className="mt-10">
          <button className="border border-black" onClick={() => changeAddress("transfer")}>mint 0.001SepoliaETH</button>
        </div>
      </div>
    }
    <div >

    </div>
  </div>
}