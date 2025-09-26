
"use client"
import { Contract, ethers, parseEther, parseUnits } from "ethers";
import { ChangeEvent, useState } from "react"
import { abi } from '../wagmi/abi'

let provider: ethers.BrowserProvider | ethers.AbstractProvider;
if (window.ethereum == null) {
  provider = ethers.getDefaultProvider()
} else {
  provider = new ethers.BrowserProvider(window.ethereum)
}
// let provider = new ethers.JsonRpcProvider("https://sepolia.drpc.org");
let signer: ethers.JsonRpcSigner | null = null;
let contract: ethers.Contract | null = null;
let contract2: ethers.Contract | null = null;
provider.getSigner().then((res) => {
  signer = res;
  console.log("signer:", signer);
  contract = new Contract("0x7f68f950AfCB47B976C2075f409F595AF8Dd82dD", abi, provider);
  console.log("contract:", contract);
  contract2 = contract.connect(signer);
});
// 合约

// 通过私钥创建一个钱包实例
// let signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY,provider);

export default function Ethers() {
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

      provider.getBalance(data._address).then((balance) => {
        console.log("balance:", balance);
        setData({
          ...data,
          balance: ethers.formatEther(balance)
        })
      });
    } else if (type === "transaction") {
      setData({
        ...data,
        transaction: data._transaction,
      })
      console.log("data._transaction:", data._transaction);
      signer.sendTransaction({
        to: "0x2bcBa6Fce85C9781F29d05629cE6BB8858f21Bc2",
        value: parseEther(data._transaction),
        gasLimit: 21000,
      }).then((tx) => {
        console.log("tx:", tx);
      })
    } else if (type === "balanceOf") {
      if (contract) {
        contract.balanceOf("0x2bcBa6Fce85C9781F29d05629cE6BB8858f21Bc2").then((res: any) => {
          console.log("balanceOf:", res);
          setBalance(ethers.formatEther(res));
        });
      } else {
        console.error("Contract is not initialized.");
      }
    } else if (type === "transfer") {
      if (contract2) {
        contract.on("Transfer", (from, to, _amount, event) => {
          const amount = ethers.formatEther(_amount, 18)
          console.log(`${from} => ${to}: ${amount}`);
          event.removeListener();
        });
        contract2.transfer("0x2bcBa6Fce85C9781F29d05629cE6BB8858f21Bc2", parseUnits("0.001", 18)).then((res: any) => {
          console.log("transfer:", res);
        });
      } else {
        console.error("Contract2 is not initialized.");
      }
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
            {balance} SepoliaETH
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

