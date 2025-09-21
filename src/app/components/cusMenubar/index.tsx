import {
  Menubar,
  MenubarMenu,
} from "@/components/ui/menubar";
import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';
export default function CusMenubar() {
  return (
    <Menubar>
      <MenubarMenu>
        <div className="flex justify-between w-full px-10">
          <div className="flex items-center">
            <Link className="pr-10" href="/">home</Link>
            <Link className="pr-10" href="/wagmi">wagmi</Link>
            <Link className="pr-10" href="/ethers">ethers</Link>
            <Link className="pr-10" href="/viem">viem</Link>
          </div>
          <div>
            <ConnectButton />
          </div>
        </div>
      </MenubarMenu>
    </Menubar>
  )

}