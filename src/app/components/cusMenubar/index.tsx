import {
  Menubar,
  MenubarMenu,
} from "@/components/ui/menubar";
import Link from "next/link";
// import { ConnectButton } from '@rainbow-me/rainbowkit';
import ConnectionButton from '@/wallet-sdk/components/ConnectionButton';
export default function CusMenubar() {
  return (
    <Menubar>
      <MenubarMenu>
        <div className="flex justify-between w-full px-10 bg-gray-50">
          <div className="flex items-center">
            <Link className="pr-10" href="/">home</Link>
            <Link className="pr-10" href="/wagmi">wagmi</Link>
            <Link className="pr-10" href="/ethers">ethers</Link>
            <Link className="pr-10" href="/viem">viem</Link>
          </div>
          <div>
            {/* <ConnectButton /> */}
             <ConnectionButton></ConnectionButton>
          </div>
        </div>
      </MenubarMenu>
    </Menubar>
  )

}